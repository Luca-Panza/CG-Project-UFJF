import * as THREE from "three";
import { OrbitControls } from "../build/jsm/controls/OrbitControls.js";
import {
  initRenderer,
  initCamera,
  initDefaultBasicLight,
  setDefaultMaterial,
  createGroundPlaneXZ,
} from "../libs/util/util.js";
import { SecondaryBoxTopEsquerda } from "./util/util.js";
import { createLevel } from "./components/createLevel.js";
import { keyboardUpdateTank1 } from "./controls/keyBoardControl.js";
import { buildTutorial } from "./controls/tutorialControl.js";
import { checkCollisions } from "./controls/collisionsControl.js";
import { updateCameraPosition } from "./controls/cameraControl.js";
import { createBBHelper } from "./helpers/bbHelper.js";
import {
  levels,
  scene,
  walls,
  bbWalls,
  bbMovingWalls,
  movingWalls,
} from "./constants/constants.js";
import { TankImport } from "./components/importTank.js";
import { createLampposts } from "./components/importLamp.js";
import {
  createLightsForLevel0,
  createLightsForLevel1,
  createLightsForLevel2,
} from "./components/createLight.js";
import { ProgressBar } from "./components/barraDeVida.js";
import { enemyTankBehavior } from "./controls/tankInimigoControl.js";
import { CSG } from "../libs/other/CSGMesh.js";
import { shootCannon } from "./controls/tiroCanhao.js";
import {
  createMovingWall,
  updateWalls,
} from "./components/createMovingWalls.js";
import { InfoBox2 } from "./util/util.js";
import {
  clearAllPowerUps,
  updatePowerUpSystem,
} from "./controls/powerUpSystem.js";

let renderer, camera, material, light, orbit, prevCameraPosition;
let orbitControlsEnabled = false;
let godModeEnabled = false;
let currentLevelIndex = 0;

let mensagem = new InfoBox2();

const initialWidth = 85;
const initialHeight = 60;
let planeWidth = initialWidth;
let planeHeight = initialHeight;
let index = 0;

// Declarar variáveis globais para os tanques
let tank1, tank2, tank3, tank4;
let cannon;

// Função para iniciar o jogo
function startGame() {
  // Esconde a tela inicial
  const startScreen = document.getElementById("start-screen");
  startScreen.style.display = "none";

  // Exibe a área do jogo
  const gameOutput = document.getElementById("webgl-output");
  gameOutput.style.display = "block";

  // Chama a função init para inicializar o jogo
  init();
}

// Evento no botão para iniciar o jogo
document.getElementById("start-button").addEventListener("click", startGame);

function init() {
  renderer = initRenderer();
  camera = initCamera(new THREE.Vector3(0, 15, 30));
  material = setDefaultMaterial();

  orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enabled = false;

  // Ajusta os limites de rotação vertical para que a câmera não vire para baixo demais
  orbit.minPolarAngle = Math.PI / 4; // Limite mínimo (ângulo menor que isso impede olhar para baixo)
  orbit.maxPolarAngle = Math.PI / 2.5; // Limite máximo (impede a câmera de virar completamente)

  updateGroundPlane(index);

  render();
}

//-- CRIANDO O MAPA EQUIRETANGULAR ---------------------------------------------------------------------
const textureLoader = new THREE.TextureLoader();
let textureEquirec = textureLoader.load("./skybox.jpg");
textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
textureEquirec.colorSpace = THREE.SRGBColorSpace;

// Define o fundo da cena como o mapa equiretangular
scene.background = textureEquirec;

function updateGroundPlane(index) {
  // Remove o plano de fundo anterior se houver
  const existingPlane = scene.getObjectByName("groundPlane");
  if (existingPlane) scene.remove(existingPlane);

  // Ajusta o tamanho do plano de acordo com o nível
  if (index === 2) {
    planeWidth = 110;
    planeHeight = 76;
  } else {
    planeWidth = initialWidth;
    planeHeight = initialHeight;
  }

  const textureLoader = new THREE.TextureLoader();
  const floorTexturePath = `/T2/assets/floorTextures/floorTextureLevel${
    index + 1
  }.jpg`;
  const floorTexture = textureLoader.load(floorTexturePath);

  floorTexture.colorSpace = THREE.SRGBColorSpace;
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;

  floorTexture.repeat.set(planeWidth / 5, planeHeight / 5);

  const planeMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });
  const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);

  plane.rotation.x = -Math.PI / 2;
  plane.name = "groundPlane";
  plane.receiveShadow = true;

  scene.add(plane);
}

function onWindowResize() {
  updateGroundPlane(index);
}

function createTank(color, position, rotation) {
  const tank = new TankImport(color, position, rotation);
  let loadedTank = null;
  let bbTank = new THREE.Box3();
  let bbHelper;

  return tank
    .loadTank()
    .then((tankObject) => {
      tankObject.position.copy(position);
      tankObject.rotation.y = rotation;

      if (color !== "tanqueUsuario") {
        tankObject.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshPhongMaterial({
              color,
              specular: 0x555555,
              shininess: 30,
            });
          }
        });
      }

      tank.object = tankObject;
      scene.add(tankObject);
      loadedTank = tankObject;

      // Criando a barra de progresso
      let pbarTank = new ProgressBar(tank.vida);
      pbarTank.position.set(0, 6);
      tankObject.add(pbarTank);

      bbTank.setFromObject(tankObject);
      bbHelper = createBBHelper(bbTank, "white");
      // scene.add(bbHelper);

      return { tank, bbTank, bbHelper, pbarTank };
    })
    .catch((error) => {
      console.error(`Erro ao adicionar o tanque à cena: ${error}`);
    });
}

function createRotatingCannon() {
  const createCylinderMesh = (
    radiusTop,
    radiusBottom,
    height,
    segments,
    position,
    rotation
  ) => {
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments)
    );
    mesh.position.copy(position);
    mesh.rotation.copy(rotation);
    mesh.updateMatrix();
    return mesh;
  };

  // Corpo do canhão (cilindro principal)
  let cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 1));
  let cylinderMesh = createCylinderMesh(
    2,
    2,
    4,
    20,
    new THREE.Vector3(0, 0, 0),
    new THREE.Euler(Math.PI / 2, 0, 0) // Sem rotação no eixo Z
  );

  let cubeCSG = CSG.fromMesh(cubeMesh);
  let cylinderCSG = CSG.fromMesh(cylinderMesh);
  let intersectedCSG = cubeCSG.intersect(cylinderCSG);

  // Cilindro do corpo do canhão
  let cylinderMesh1 = createCylinderMesh(
    0.4,
    0.4,
    4,
    20,
    new THREE.Vector3(0, 0, -2.5),
    new THREE.Euler(Math.PI / 2, 0, 0) // Sem rotação no eixo Z
  );
  let cylinderCSG1 = CSG.fromMesh(cylinderMesh1);
  let finalCSG = intersectedCSG.union(cylinderCSG1);

  // Cilindro da boca do canhão, agora rotacionado em 90 graus no eixo Z
  let cylinderMesh2 = createCylinderMesh(
    0.45,
    0.45,
    8,
    20,
    new THREE.Vector3(0, 0, -4), // Ajuste a posição do cilindro para que fique na boca do canhão
    new THREE.Euler(0, 0, Math.PI / 2) // Rotação de 90 graus no eixo Z
  );
  let cylinderCSG2 = CSG.fromMesh(cylinderMesh2);

  // Cilindro interno da boca do canhão
  let innerCylinderMesh = createCylinderMesh(
    0.35,
    0.35,
    8,
    20,
    new THREE.Vector3(0, 0, -4),
    new THREE.Euler(0, 0, Math.PI / 2) // Mantém a mesma rotação da boca
  );
  let innerCylinderCSG = CSG.fromMesh(innerCylinderMesh);
  let hollowCylinderCSG = cylinderCSG2.subtract(innerCylinderCSG);

  finalCSG = finalCSG.union(hollowCylinderCSG);

  // Criar mesh final
  let csgFinal = CSG.toMesh(finalCSG, new THREE.Matrix4());
  csgFinal.material = new THREE.MeshPhongMaterial({ color: "lightgreen" });

  let cannonGroup = new THREE.Group();
  cannonGroup.add(csgFinal);
  cannonGroup.position.set(-2, 3, 0);
  cannonGroup.rotation.x = Math.PI / 2; // Mantém a rotação do canhão no eixo X

  return cannonGroup;
}

function comportamentoCannon(canhao, tanks, targetBoundingBox, index) {
  const closestTank = findClosestTank(canhao, tanks);
  if (closestTank) {
    const targetPosition = closestTank.object.position;
    const cannonPosition = canhao.position.clone();

    // Calcular a direção para o tanque mais próximo
    const direction = new THREE.Vector3()
      .subVectors(targetPosition, cannonPosition)
      .normalize();

    // Atualizar a rotação do canhão lentamente em direção ao tanque mais próximo
    const targetRotationZ = Math.atan2(direction.z, direction.x); // Cálculo da rotação desejada no eixo Z
    const rotationSpeed = 0.01; // Ajuste a velocidade da rotação

    // Rotação suave em direção ao tanque
    canhao.rotation.z += THREE.MathUtils.clamp(
      targetRotationZ - canhao.rotation.z,
      -rotationSpeed,
      rotationSpeed
    );

    // Disparar se a cadência de tiro permitir
    shootCannon(canhao, closestTank.object, targetBoundingBox, index);
  }
}

// Função para encontrar o tanque mais próximo
function findClosestTank(canhao, tanks) {
  let closestTank = null;
  let closestDistance = Infinity;

  tanks.forEach((tank) => {
    const distance = canhao.position.distanceTo(tank.object.position);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestTank = tank;
    }
  });

  return closestTank; // Retorna o tanque mais próximo
}

function clearPreviousLevel() {
  console.log("Limpando paredes e caixas de colisão...");
  walls.forEach((wall) => scene.remove(wall));
  walls.length = 0;
  bbWalls.forEach((bbWall) => scene.remove(bbWall));
  bbWalls.length = 0;
}

function resetGame(index) {
  // resetando o GodMode
  godModeEnabled = false;
  mensagem.clear();

  // Remove e reseta todos os power-ups
  clearAllPowerUps(scene);

  console.log("Removendo todos os objetos da cena...");
  while (scene.children.length > 0) {
    const child = scene.children[0];
    scene.remove(child);
    if (child.geometry) {
      child.geometry.dispose();
    }
    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach((material) => material.dispose());
      } else {
        child.material.dispose();
      }
    }
  }
  clearPreviousLevel();
  updateGroundPlane(index);

  createLevel(levels[index], planeWidth, planeHeight, scene, index);

  let tankPromises = [];
  if (index === 0) {
    createLightsForLevel0(scene, renderer);

    tankPromises.push(
      createTank("tanqueUsuario", new THREE.Vector3(-20, 0, 15), Math.PI)
    );
    tankPromises.push(
      createTank(0x0000ff, new THREE.Vector3(20, 0, 15), Math.PI)
    );
  } else if (index === 1) {
    createLightsForLevel1(scene, renderer);

    tankPromises.push(
      createTank("tanqueUsuario", new THREE.Vector3(-30, 0, -15), Math.PI / 360)
    );
    tankPromises.push(
      createTank(0x0000ff, new THREE.Vector3(30, 0, -15), Math.PI / 360)
    );
    tankPromises.push(
      createTank(0xff0000, new THREE.Vector3(30, 0, 15), Math.PI)
    );

    createLampposts(scene);

    cannon = createRotatingCannon();
    scene.add(cannon);
  } else if (index === 2) {
    createLightsForLevel2(scene, renderer);

    createMovingWall(scene, new THREE.Vector3(2.5, 2.5, 0), 0);
    createMovingWall(scene, new THREE.Vector3(-22.5, 2.5, 0), 0);
    createMovingWall(scene, new THREE.Vector3(27.5, 2.5, 0), 0);

    // Definição para o nível 3
    tankPromises.push(
      createTank("tanqueUsuario", new THREE.Vector3(-35, 0, 0), Math.PI / 2)
    );
    tankPromises.push(
      createTank(0x0000ff, new THREE.Vector3(-10, 0, -20), Math.PI / 360)
    );
    tankPromises.push(
      createTank(0xff0000, new THREE.Vector3(15, 0, 20), Math.PI)
    );

    tankPromises.push(
      createTank(0xff00ff, new THREE.Vector3(40, 0, -20), Math.PI / 360)
    );
  }

  Promise.all(tankPromises).then((results) => {
    [tank1, tank2, tank3, tank4] = results;
    if (tank1) tank1.tank.vida = 10;
    if (tank2) {
      tank2.tank.vida = 10;
      tank2.tank.object.visible = true;
    }
    if (tank3) {
      tank3.tank.vida = 10;
      tank3.tank.object.visible = true;
    }
    if (tank4) {
      tank4.tank.vida = 10;
      tank4.tank.object.visible = true;
    }
  });
}

//init();

function Godmode() {
  godModeEnabled = !godModeEnabled;

  // Limpa o conteúdo anterior da mensagem
  mensagem.clear();

  if (godModeEnabled) {
    mensagem.add("God mode Ativado");
    tank1.tank.godMode = true;
  } else {
    tank1.tank.godMode = false;
  }
  mensagem.show();
}

window.addEventListener("resize", onWindowResize, false);

window.addEventListener("keydown", (event) => {
  if (event.key === "o") {
    orbitControlsEnabled = !orbitControlsEnabled;
    orbit.enabled = orbitControlsEnabled;

    if (orbitControlsEnabled) {
      // Salva a posição anterior da câmera
      prevCameraPosition = camera.position.clone();

      // Cria um vetor de direção para capturar onde a câmera estava olhando
      //const cameraDirection = new THREE.Vector3();
      //camera.getWorldDirection(cameraDirection);

      // Define o foco do OrbitControls para onde a câmera estava apontando
      const cameraTarget = new THREE.Vector3();
      // cameraTarget.copy(camera.position).add(cameraDirection.multiplyScalar(1000)); // Distância arbitrária para o foco

      // orbit.target.copy(cameraTarget);

      // Habilita apenas o zoom e desabilita rotação e pan
      //orbit.enableRotate = false; // Desabilita rotação
      //orbit.enablePan = false; // Desabilita movimento de pan
      //orbit.enableZoom = true; // Habilita zoom

      prevCameraPosition = camera.position.clone();
    } else {
      camera.position.copy(prevCameraPosition);
    }
  } else if (event.key === "1") {
    index = 0;
    currentLevelIndex = 0;
    resetGame(index);
  } else if (event.key === "2") {
    index = 1;
    currentLevelIndex = 1;
    resetGame(index);
  } else if (event.key === "3") {
    index = 2;
    currentLevelIndex = 2;
    resetGame(index);
  } else if (event.key === "g") {
    Godmode();
  }
});

resetGame(index);

buildTutorial();

const tituloNivel = new SecondaryBoxTopEsquerda();

function mostraNivel() {
  tituloNivel.changeMessage("Nível " + (index + 1));
}

function atualizaBarraDeVida() {
  if (tank1) tank1.pbarTank.updateProgress(tank1.tank.vida);
  if (tank2) tank2.pbarTank.updateProgress(tank2.tank.vida);
  if (tank3) tank3.pbarTank.updateProgress(tank3.tank.vida);
  if (tank4) tank4.pbarTank.updateProgress(tank4.tank.vida);
}

function verificaPlacar() {
  if (index === 0) {
    if (tank1.tank.vida <= 0) {
      tank1.tank.vida = 10;
      tank2.tank.vida = 10;
      alert("Você perdeu! Tente novamente.");
      resetGame(0);
    } else if (tank2.tank.vida <= 0) {
      tank1.tank.vida = 10;
      tank2.tank.vida = 10;
      index = 1;
      currentLevelIndex = 1;
      alert("Parabéns! Você venceu o nível 1! Está pronto para o nível 2?");
      resetGame(1);
    }
  } else if (index === 1) {
    if (tank1.tank.vida <= 0) {
      tank1.tank.vida = 10;
      tank2.tank.vida = 10;
      tank3.tank.vida = 10;
      alert("Você perdeu! Tente novamente.");
      resetGame(1);
    }
    if (tank2.tank.vida <= 0 && tank3.tank.vida <= 0) {
      tank1.tank.vida = 10;
      tank2.tank.vida = 10;
      tank3.tank.vida = 10;
      index = 2;
      currentLevelIndex = 2;
      alert("Parabéns! Você venceu o nível 2! Está pronto para o nível 3?");
      resetGame(2);
    }
    if (tank2.tank.vida <= 0) {
      tank2.tank.object.visible = false;
    }
    if (tank3.tank.vida <= 0) {
      tank3.tank.object.visible = false;
    }
  } else if (index === 2) {
    if (tank1.tank.vida <= 0) {
      tank1.tank.vida = 10;
      tank2.tank.vida = 10;
      tank3.tank.vida = 10;
      tank4.tank.vida = 10;
      alert("Você perdeu! Tente novamente.");
      resetGame(2);
    }

    if (tank2.tank.vida <= 0 && tank3.tank.vida <= 0 && tank4.tank.vida <= 0) {
      tank1.tank.vida = 10;
      tank2.tank.vida = 10;
      tank3.tank.vida = 10;
      tank4.tank.vida = 10;
      index = 0;
      currentLevelIndex = 0;
      alert("Parabéns! Você venceu o jogo! Quer jogar novamente?");
      resetGame(0);
    }

    if (tank2.tank.vida <= 0) {
      tank2.tank.object.visible = false;
    }
    if (tank3.tank.vida <= 0) {
      tank3.tank.object.visible = false;
    }
    if (tank4.tank.vida <= 0) {
      tank4.tank.object.visible = false;
    }
  }
}

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);

  updatePowerUpSystem(scene, tank1.tank, tank1.bbTank, index); // Passa o nível atual (index)

  if (index === 0) {
    if (tank1 && tank2) {
      keyboardUpdateTank1(
        index,
        tank1.tank,
        tank1.bbTank,
        tank2.tank,
        tank2.bbTank,
        null,
        null
      );
      checkCollisions(
        index,
        tank1.tank.object,
        tank1.bbTank,
        tank2.tank.object,
        tank2.bbTank,
        null,
        null,
        null,
        null,
        bbWalls,
        null,
        null
      );
      updateCameraPosition(camera, tank1.tank.object, orbitControlsEnabled);
      enemyTankBehavior(
        index,
        2,
        tank2.tank,
        tank2.bbTank,
        tank1.tank,
        tank1.bbTank
      );

      mostraNivel();
      verificaPlacar();
      atualizaBarraDeVida();
    }
  } else if (index === 1) {
    if (tank1 && tank2 && tank3) {
      if (cannon) {
        let targetTank = [tank1.tank, tank2.tank, tank3.tank];
        let targetBoundingBox = [tank1.bbTank, tank2.bbTank, tank3.bbTank];
        comportamentoCannon(cannon, targetTank, targetBoundingBox, index);
      }
      keyboardUpdateTank1(
        index,
        tank1.tank,
        tank1.bbTank,
        tank2.tank,
        tank2.bbTank,
        tank3.tank,
        tank3.bbTank
      );
      checkCollisions(
        index,
        tank1.tank.object,
        tank1.bbTank,
        tank2.tank.object,
        tank2.bbTank,
        tank3.tank.object,
        tank3.bbTank,
        null,
        null,
        bbWalls,
        null,
        null
      );
      updateCameraPosition(camera, tank1.tank.object, orbitControlsEnabled);

      if (tank2.tank.object.visible) {
        enemyTankBehavior(
          index,
          2,
          tank2.tank,
          tank2.bbTank,
          tank1.tank,
          tank1.bbTank,
          tank3.tank,
          tank3.bbTank
        );
      }

      if (tank3.tank.object.visible) {
        enemyTankBehavior(
          index,
          3,
          tank3.tank,
          tank3.bbTank,
          tank1.tank,
          tank1.bbTank,
          tank2.tank,
          tank2.bbTank
        );
      }

      mostraNivel();
      verificaPlacar();
      atualizaBarraDeVida();
    }
  } else if (index === 2) {
    if (tank1 && tank2 && tank3 && tank4) {
      keyboardUpdateTank1(
        index,
        tank1.tank,
        tank1.bbTank,
        tank2.tank,
        tank2.bbTank,
        tank3.tank,
        tank3.bbTank,
        tank4.tank,
        tank4.bbTank
      );

      checkCollisions(
        index,
        tank1.tank.object,
        tank1.bbTank,
        tank2.tank.object,
        tank2.bbTank,
        tank3.tank.object,
        tank3.bbTank,
        tank4.tank.object,
        tank4.bbTank,
        bbWalls,
        movingWalls,
        bbMovingWalls
      );

      if (tank2.tank.object.visible) {
        enemyTankBehavior(
          index,
          2,
          tank2.tank,
          tank2.bbTank,
          tank1.tank,
          tank1.bbTank,
          tank3.tank,
          tank3.bbTank,
          tank4.tank,
          tank4.bbTank
        );
      }

      if (tank3.tank.object.visible) {
        enemyTankBehavior(
          index,
          3,
          tank3.tank,
          tank3.bbTank,
          tank1.tank,
          tank1.bbTank,
          tank2.tank,
          tank2.bbTank,
          tank4.tank,
          tank4.bbTank
        );
      }
      if (tank4.tank.object.visible) {
        enemyTankBehavior(
          index,
          4,
          tank4.tank,
          tank4.bbTank,
          tank1.tank,
          tank1.bbTank,
          tank2.tank,
          tank2.bbTank,
          tank3.tank,
          tank3.bbTank
        );
      }

      updateCameraPosition(camera, tank1.tank.object, orbitControlsEnabled);

      updateWalls(planeHeight);

      mostraNivel();
      verificaPlacar();
      atualizaBarraDeVida();
    }
  }
}
