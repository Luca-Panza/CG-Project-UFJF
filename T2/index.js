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

  planeWidth = Math.max(
    initialWidth * (window.innerWidth / window.innerHeight),
    initialWidth
  );
  planeHeight = Math.max(
    initialHeight,
    initialHeight * (window.innerHeight / window.innerWidth)
  );

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

    // Criação de luzes para o nível 1
    createLightsForLevel1(scene, renderer);

    // Criação de postes de luz
    createLampposts(scene);

    // let sphereMesh = new THREE.Mesh(new THREE.SphereGeometry(1.75, 20, 20));
    // sphereMesh.position.set(0, 2, 0);
    // scene.add(sphereMesh);

    // let cylinderMesh = new THREE.Mesh(
    //   new THREE.CylinderGeometry(0.85, 0.85, 2, 20)
    // );
    // cylinderMesh.position(0, 10, 0);
    // scene.add(cylinderMesh);

    // let cylinderMesh = new THREE.Mesh(
    //   new THREE.CylinderGeometry(0.4, 0.4, 2, 20)
    // );
    // cylinderMesh.position.set(0, 2, 0);
    // scene.add(cylinderMesh);

    // const cannonGeometry = new THREE.CylinderGeometry(0.75, 0.75, 5);
    // const cannonMaterial = new THREE.MeshBasicMaterial({ color: 0x505050 });
    // let canhao = new THREE.Mesh(cannonGeometry, cannonMaterial);
    // canhao.position.set(0, 1.5, 0.0);
    // canhao.rotateZ(Math.PI / 2); // Rotação para que o canhão fique na vertical
    // // cylinderMesh.add(canhao);

    // const cannonGeometry2 = new THREE.CylinderGeometry(0.2, 0.2, 5);
    // const cannonMaterial2 = new THREE.MeshBasicMaterial({ color: 0x505050 });
    // let canhao2 = new THREE.Mesh(cannonGeometry2, cannonMaterial2);
    // canhao2.position.set(0, 1.5, 0.0);
    // canhao2.rotateZ(Math.PI / 2); // Rotação para que o canhão fique na vertical
    // canhao2.matrixAutoUpdate = false;
    // canhao2.updateMatrix();

    // let auxMat = new THREE.Matrix4();

    // let furo = CSG.fromMesh(canhao2);
    // let canhao1 = CSG.fromMesh(canhao);
    // let canhaoFurado = canhao1.subtract(furo); // Execute subtraction
    // mesh1 = CSG.toMesh(canhaoFurado, auxMat);
    // mesh1.material = new THREE.MeshPhongMaterial({ color: "lightgreen" });
    // mesh1.position.set(0, 1.5, 0.0);
    // cylinderMesh.add(mesh1);
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
        bbWalls
      );
      updateCameraPosition(
        camera,
        index,
        tank1.tank.object,
        tank2.tank.object,
        orbitControlsEnabled
      );
      enemyTankBehavior(
        index,
        tank2.tank,
        tank2.bbTank,
        tank1.tank,
        tank1.bbTank,
        bbWalls
      );

      mostraNivel();
      verificaPlacar();
      atualizaBarraDeVida();
    }
  } else if (index === 1) {
    if (tank1 && tank2 && tank3) {
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
        bbWalls
      );
      updateCameraPosition(
        camera,
        index,
        tank1.tank.object,
        tank2.tank.object,
        tank3.tank.object,
        orbitControlsEnabled
      );

      mostraNivel();
      verificaPlacar();
      atualizaBarraDeVida();
    }
  }
}

render();
