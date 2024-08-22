import * as THREE from "three";
import { OrbitControls } from "../build/jsm/controls/OrbitControls.js";
import { initRenderer, initCamera, initDefaultBasicLight, setDefaultMaterial, createGroundPlaneXZ } from "../libs/util/util.js";
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

let renderer, camera, material, light, orbit, prevCameraPosition;
let orbitControlsEnabled = false;
let currentLevelIndex = 0; // Salva o índice do nível atual

const initialWidth = 85;
const initialHeight = 60;
let planeWidth = initialWidth;
let planeHeight = initialHeight;
let index = 0;

// Declarar variáveis globais para os tanques
let tank1, tank2, tank3;

function init() {
  renderer = initRenderer();
  camera = initCamera(new THREE.Vector3(0, 15, 30));
  material = setDefaultMaterial();
  orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enabled = false;

  updateRendererSize();
  updateCameraAspect();
  updateGroundPlane();
}

function updateRendererSize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
}

function updateCameraAspect() {
  const aspect = window.innerWidth / window.innerHeight;
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
}

function updateGroundPlane() {
  // verificar se o cenário estpá centralizado na posição 00
  const oldPlane = scene.getObjectByName("groundPlane");
  if (oldPlane) scene.remove(oldPlane);

  planeWidth = Math.max(initialWidth * (window.innerWidth / window.innerHeight), initialWidth);
  planeHeight = Math.max(initialHeight, initialHeight * (window.innerHeight / window.innerWidth));

  const plane = createGroundPlaneXZ(planeWidth, planeHeight);
  plane.name = "groundPlane";
  scene.add(plane);
}

function onWindowResize() {
  updateRendererSize();
  updateCameraAspect();
  updateGroundPlane();
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

      if (color != "tanqueUsuario") {
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

      //  Criando a barra de progresso
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

function clearPreviousLevel() {
  walls.forEach((wall) => scene.remove(wall));
  walls.length = 0;
  bbWalls.forEach((bbWall) => scene.remove(bbWall));
  bbWalls.length = 0;
}

function resetaJogo(index) {
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }
  clearPreviousLevel();
  updateGroundPlane();

  //light = initDefaultBasicLight(scene); // Para Iluminação do cenário do index 1

  createLevel(levels[index], planeWidth / 2, planeHeight, scene, index);

  let tankPromises = [];
  if (index === 0) {
    light = initDefaultBasicLight(scene);

    tankPromises.push(createTank("tanqueUsuario", new THREE.Vector3(-20, 0, 15), Math.PI));
    tankPromises.push(createTank(0x0000ff, new THREE.Vector3(20, 0, 15), Math.PI));
  } else if (index === 1) {
    tankPromises.push(createTank("tanqueUsuario", new THREE.Vector3(-30, 0, -15), Math.PI / 360));
    tankPromises.push(createTank(0x0000ff, new THREE.Vector3(30, 0, -15), Math.PI / 360));
    tankPromises.push(createTank(0xff0000, new THREE.Vector3(30, 0, 15), Math.PI));

    // Criação de luzes para o nível 1
    createLightsForLevel1(scene, renderer);

    // Criação de postes de luz
    createLampposts(scene);

    // Criação de um objeto CSG
    // Cria um cubo e um cilindro para interseção
    /*
    let cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 1));
    let cylinderMesh = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 4, 20));

    // Posiciona e rotaciona o cilindro para intersectar com o cubo
    cylinderMesh.position.set(0, 0, 0);
    cylinderMesh.rotation.x = Math.PI / 2; // Rotaciona o cilindro para ficar na horizontal

    // Atualiza as transformações
    cubeMesh.matrixAutoUpdate = false;
    cubeMesh.updateMatrix();
    cylinderMesh.matrixAutoUpdate = false;
    cylinderMesh.updateMatrix();

    // Converte as geometrias para CSG
    let cubeCSG = CSG.fromMesh(cubeMesh);
    let cylinderCSG = CSG.fromMesh(cylinderMesh);

    // Realiza a operação de interseção para criar a base
    let intersectedCSG = cubeCSG.intersect(cylinderCSG);

    // Criação do primeiro cilindro adicional
    let cylinderMesh1 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 4, 20));
    cylinderMesh1.position.set(0, 0, -2.5); // Centro do cilindro base
    cylinderMesh1.rotation.x = Math.PI / 2; // Alinha o cilindro com a base

    // Atualiza as transformações do cilindro adicional
    cylinderMesh1.matrixAutoUpdate = false;
    cylinderMesh1.updateMatrix();

    let cylinderCSG1 = CSG.fromMesh(cylinderMesh1);

    // Realiza a união do cilindro adicional com a base resultante da interseção
    let finalCSG = intersectedCSG.union(cylinderCSG1);

    // Criação do segundo cilindro (maior)
    let cylinderMesh2 = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 8, 20));
    cylinderMesh2.position.set(0, 0, -4); // Posição central na base
    cylinderMesh2.rotation.y = Math.PI / 2; // Rotaciona 90 graus ao redor do eixo Y

    // Atualiza as transformações do segundo cilindro
    cylinderMesh2.matrixAutoUpdate = false;
    cylinderMesh2.updateMatrix();

    let cylinderCSG2 = CSG.fromMesh(cylinderMesh2);

    // Criação de um cilindro menor para subtração (tornando o maior oco)
    let innerCylinderMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 8, 20));
    innerCylinderMesh.position.set(0, 0, -4); // Mesma posição do cilindro maior
    innerCylinderMesh.rotation.y = Math.PI / 2; // Mesma rotação do cilindro maior

    // Atualiza as transformações do cilindro menor
    innerCylinderMesh.matrixAutoUpdate = false;
    innerCylinderMesh.updateMatrix();

    let innerCylinderCSG = CSG.fromMesh(innerCylinderMesh);

    // Subtração do cilindro menor do maior para criar um cilindro oco
    let hollowCylinderCSG = cylinderCSG2.subtract(innerCylinderCSG);

    // Realiza a união do cilindro oco com o objeto base
    finalCSG = finalCSG.union(hollowCylinderCSG);

    // Converte o CSG resultante de volta para um Mesh
    let csgFinal = CSG.toMesh(finalCSG, new THREE.Matrix4());
    csgFinal.material = new THREE.MeshPhongMaterial({ color: "lightgreen" });

    // Adiciona o mesh final à cena
    scene.add(csgFinal);

    csgFinal.position.set(0, 5, 0);
    csgFinal.rotation.x = Math.PI / 2;
    */

    //
  }

  Promise.all(tankPromises).then((results) => {
    // Atribuir os tanques globais
    [tank1, tank2, tank3] = results;
    if (tank1) tank1.tank.vida = 10;
    if (tank2) tank2.tank.vida = 10;
    if (tank3) tank3.tank.vida = 10;
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
    currentLevelIndex = 0; // Atualiza o índice do nível atual
    resetaJogo(index);
  } else if (event.key === "2") {
    index = 1;
    currentLevelIndex = 1; // Atualiza o índice do nível atual
    resetaJogo(index);
  }
});

resetaJogo(index);

buildTutorial();

const tituloNivel = new SecondaryBoxTopEsquerda();

function mostraNivel() {
  tituloNivel.changeMessage("Nível " + (index + 1));
}

function atualizaBarraDeVida() {
  if (tank1) tank1.pbarTank.updateProgress(tank1.tank.vida);
  if (tank2) tank2.pbarTank.updateProgress(tank2.tank.vida);
  if (tank3) tank3.pbarTank.updateProgress(tank3.tank.vida);
}

function verificaPlacar() {
  if (index === 0) {
    if (tank1.tank.vida <= 0) {
      if (tank1) tank1.tank.vida = 10;
      if (tank2) tank2.tank.vida = 10;
      alert("Tanque 2 (azul) venceu!");
      resetaJogo(currentLevelIndex);
    } else if (tank2.tank.vida <= 0) {
      if (tank1) tank1.tank.vida = 10;
      if (tank2) tank2.tank.vida = 10;
      alert("Tanque 1 (vermelho) venceu!");
      resetaJogo(currentLevelIndex);
    }
  } else if (index === 1) {
    // essa lógica aqui deve ser revista para verificar como fazer os vencedores do nível 2 com 3 jogadores
    if (tank1.tank.vida <= 0) {
      if (tank1) tank1.tank.vida = 10;
      if (tank2) tank2.tank.vida = 10;
      if (tank3) tank3.tank.vida = 10;
      alert("Tanque 2 (azul) venceu!");
      resetaJogo(currentLevelIndex);
    } else if (tank2.tank.vida <= 0) {
      if (tank1) tank1.tank.vida = 10;
      if (tank2) tank2.tank.vida = 10;
      if (tank3) tank3.tank.vida = 10;
      alert("Tanque 1 (vermelho) venceu!");
      resetaJogo(currentLevelIndex);
    } else if (tank3.tank.vida <= 0) {
      if (tank1) tank1.tank.vida = 10;
      if (tank2) tank2.tank.vida = 10;
      if (tank3) tank3.tank.vida = 10;
      alert("Tanque 3 (verde) venceu!");
      resetaJogo(currentLevelIndex);
    }
  }
}

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  console.log("Nível atual:", index); // Exibe o nível atual no console

  if (index === 0) {
    if (tank1 && tank2) {
      keyboardUpdateTank1(index, tank1.tank, tank1.bbTank, tank2.tank, tank2.bbTank, null, null);
      checkCollisions(index, tank1.tank.object, tank1.bbTank, tank2.tank.object, tank2.bbTank, null, null, bbWalls);
      updateCameraPosition(camera, index, tank1.tank.object, tank2.tank.object, orbitControlsEnabled);
      enemyTankBehavior(index, tank2.tank, tank2.bbTank, tank1.tank, tank1.bbTank);

      mostraNivel();
      verificaPlacar();
      atualizaBarraDeVida();
    }
  } else if (index === 1) {
    if (tank1 && tank2 && tank3) {
      keyboardUpdateTank1(index, tank1.tank, tank1.bbTank, tank2.tank, tank2.bbTank, tank3.tank, tank3.bbTank);
      checkCollisions(index, tank1.tank.object, tank1.bbTank, tank2.tank.object, tank2.bbTank, tank3.tank.object, tank3.bbTank, bbWalls);
      updateCameraPosition(camera, index, tank1.tank.object, tank2.tank.object, tank3.tank.object, orbitControlsEnabled);

      enemyTankBehavior(index, tank2.tank, tank2.bbTank, tank1.tank, tank1.bbTank, tank3.tank, tank3.bbTank);

      enemyTankBehavior(index, tank3.tank, tank3.bbTank, tank1.tank, tank1.bbTank, tank2.tank, tank2.bbTank);

      mostraNivel();
      verificaPlacar();
      atualizaBarraDeVida();
    }
  }
}

render();
