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
import { levels, scene, walls, bbWalls } from "./constants/constants.js";
import { TankImport } from "./components/importTank.js";
import { createLampposts } from "./components/importLamp.js";
import { createLightsForLevel1 } from "./components/createLight.js";
import { ProgressBar } from "./components/barraDeVida.js";
import { enemyTankBehavior } from "./controls/tankInimigoControl.js";
import { CSG } from "../libs/other/CSGMesh.js";
import { shootCannon } from "./controls/tiroCanhao.js";
import {createMovingWall, updateWalls} from "./components/wall.js";


let renderer, camera, material, light, orbit, prevCameraPosition;
let orbitControlsEnabled = false;
let currentLevelIndex = 0;

const initialWidth = 85;
const initialHeight = 60;
let planeWidth = initialWidth;
let planeHeight = initialHeight;
let index = 0;

// Declarar variáveis globais para os tanques
let tank1, tank2, tank3, tank4;
let cannon;

function init() {
  renderer = initRenderer();
  camera = initCamera(new THREE.Vector3(0, 15, 30));
  material = setDefaultMaterial();
  orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enabled = false;
  updateGroundPlane(index);
}

function updateGroundPlane(index) {
  // Remove o plano de fundo anterior se houver
  const existingPlane = scene.getObjectByName("groundPlane");
  if (existingPlane) scene.remove(existingPlane);

  // Ajusta o tamanho do plano de acordo com o nível
  if (index === 2) { // Aqui usamos === para verificar o nível 3
    planeWidth = 110;  // Aumenta o tamanho do plano para o nível 3
    planeHeight = 60;
  } else {
    planeWidth = initialWidth;  // Para os outros níveis, mantemos o tamanho inicial
    planeHeight = initialHeight;
  }

  // Cria e adiciona o novo plano de fundo
  const plane = createGroundPlaneXZ(planeWidth, planeHeight);
  plane.name = "groundPlane";
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

  return tank.loadTank().then((tankObject) => {
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
  }).catch((error) => {
    console.error(`Erro ao adicionar o tanque à cena: ${error}`);
  });
}

function createRotatingCannon() {
  const createCylinderMesh = (radiusTop, radiusBottom, height, segments, position, rotation) => {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments));
    mesh.position.copy(position);
    mesh.rotation.copy(rotation);
    mesh.updateMatrix();
    return mesh;
  };

  let cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 1));
  let cylinderMesh = createCylinderMesh(2, 2, 4, 20, new THREE.Vector3(0, 0, 0), new THREE.Euler(Math.PI / 2, 0, 0));

  let cubeCSG = CSG.fromMesh(cubeMesh);
  let cylinderCSG = CSG.fromMesh(cylinderMesh);
  let intersectedCSG = cubeCSG.intersect(cylinderCSG);

  let cylinderMesh1 = createCylinderMesh(0.4, 0.4, 4, 20, new THREE.Vector3(0, 0, -2.5), new THREE.Euler(Math.PI / 2, 0, 0));
  let cylinderCSG1 = CSG.fromMesh(cylinderMesh1);
  let finalCSG = intersectedCSG.union(cylinderCSG1);

  let cylinderMesh2 = createCylinderMesh(0.45, 0.45, 8, 20, new THREE.Vector3(0, 0, -4), new THREE.Euler(0, Math.PI / 2, 0));
  let cylinderCSG2 = CSG.fromMesh(cylinderMesh2);

  let innerCylinderMesh = createCylinderMesh(0.35, 0.35, 8, 20, new THREE.Vector3(0, 0, -4), new THREE.Euler(0, Math.PI / 2, 0));
  let innerCylinderCSG = CSG.fromMesh(innerCylinderMesh);
  let hollowCylinderCSG = cylinderCSG2.subtract(innerCylinderCSG);

  finalCSG = finalCSG.union(hollowCylinderCSG);
  let csgFinal = CSG.toMesh(finalCSG, new THREE.Matrix4());
  csgFinal.material = new THREE.MeshPhongMaterial({ color: "lightgreen" });

  let cannonGroup = new THREE.Group();
  cannonGroup.add(csgFinal);
  cannonGroup.position.set(-2, 3, 0);
  cannonGroup.rotation.x = Math.PI / 2;

  return cannonGroup;
}

function comportamentoCannon(canhao, targetTank, targetBoundingBox, index) {
  canhao.rotation.z += 0.01; // Rotação lenta ao redor do eixo Z
  shootCannon(canhao, targetTank, targetBoundingBox, index);
}

function clearPreviousLevel() {
  console.log("Limpando paredes e caixas de colisão...");
  walls.forEach((wall) => scene.remove(wall));
  walls.length = 0;
  bbWalls.forEach((bbWall) => scene.remove(bbWall));
  bbWalls.length = 0;
}

function resetGame(index) {
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
    light = initDefaultBasicLight(scene);
    tankPromises.push(
      createTank("tanqueUsuario", new THREE.Vector3(-20, 0, 15), Math.PI)
    );
    tankPromises.push(
      createTank(0x0000ff, new THREE.Vector3(20, 0, 15), Math.PI)
    );
  } else if (index === 1) {
    tankPromises.push(
      createTank("tanqueUsuario", new THREE.Vector3(-30, 0, -15), Math.PI / 360)
    );
    tankPromises.push(
      createTank(0x0000ff, new THREE.Vector3(30, 0, -15), Math.PI / 360)
    );
    tankPromises.push(
      createTank(0xff0000, new THREE.Vector3(30, 0, 15), Math.PI)
    );

    createLightsForLevel1(scene, renderer);
    createLampposts(scene);

    cannon = createRotatingCannon();
    scene.add(cannon);

  } else if (index === 2) {
    light = initDefaultBasicLight(scene);
    createMovingWall(scene, new THREE.Vector3(2.5, 2.5, 0), 0, 0xFFA500);
    createMovingWall(scene, new THREE.Vector3(-22.5, 2.5, 0), 0, 0xFFA500);
    createMovingWall(scene, new THREE.Vector3(27.5, 2.5, 0), 0, 0xFFA500);

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


init();

window.addEventListener("resize", onWindowResize, false);

window.addEventListener("keydown", (event) => {
  if (event.key === "o") {
    orbitControlsEnabled = !orbitControlsEnabled;
    orbit.enabled = orbitControlsEnabled;
    if (!orbitControlsEnabled) {
      camera.position.copy(prevCameraPosition);
    } else {
      prevCameraPosition = camera.position.clone();
    }
  } else if (event.key === "1") {
    index = 0;
    currentLevelIndex = 0;
    resetGame(index);
  } else if (event.key === "2") {
    index = 1;
    currentLevelIndex = 1;
    resetGame(index);
  }
  else if (event.key === "3") {
    index = 2;
    currentLevelIndex = 2;
    resetGame(index);
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
      alert("Você perdeu! Tente novamente.");
      resetGame(0);
    } else if (tank2.tank.vida <= 0) {
      alert("Parabéns! Você venceu o nível 1! Está pronto para o nível 2?");
      resetGame(1);
    }
  } else if (index === 1) {
    if (tank1.tank.vida <= 0) {
      alert("Você perdeu! Tente novamente.");
      resetGame(1);
    }
    if (tank2.tank.vida <= 0 && tank3.tank.vida > 0) {
      tank2.tank.object.visible = false;
    }
    if (tank3.tank.vida <= 0 && tank2.tank.vida > 0) {
      tank3.tank.object.visible = false;
    }
    if (tank2.tank.vida <= 0 && tank3.tank.vida <= 0) {
      alert("Parabéns! Você venceu o jogo! Quer jogar novamente?");
      resetGame(1);
    }
  }
  else if (index === 2) {

  }
}

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);

  if (index === 0) {
    if (tank1 && tank2) {
      keyboardUpdateTank1(
        index,
        tank1.tank,
        tank1.bbTank,
        tank2.tank,
        tank2.bbTank,
        null,
        null,
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
        bbWalls
      );
      updateCameraPosition(
        camera,
        tank1.tank.object,
        orbitControlsEnabled
      );
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
        bbWalls
      );
      updateCameraPosition(
        camera,
        tank1.tank.object,
        orbitControlsEnabled
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
  }

  else if (index === 2) {
    if (tank1 && tank2 && tank3 && tank4) {
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
        tank4.tank.object, 
        tank4.bbTank,
        bbWalls
      );

      updateCameraPosition(
        camera,
        tank1.tank.object,
        orbitControlsEnabled
      );

      updateWalls(planeHeight);

      mostraNivel();
      verificaPlacar();
      atualizaBarraDeVida();
    }
  }
}

render();
