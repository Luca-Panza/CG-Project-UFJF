// Eduarda Araujo Carvalho - 202265022AC
// Maria Clara Ribeiro de Menezes - 202165101AC
// Luca Rodrigues Panza - 202465173A

import * as THREE from "three";
import { OrbitControls } from "../build/jsm/controls/OrbitControls.js";
import { initRenderer, initCamera, initDefaultBasicLight, setDefaultMaterial, createGroundPlaneXZ } from "../libs/util/util.js";
import { SecondaryBoxTopEsquerda, SecondaryBoxTopDireita } from "./util/util.js";

import { Tank } from "./components/createTank.js";
import { createLevel } from "./components/createLevel.js";
import { keyboardUpdateTank1, keyboardUpdateTank2 } from "./controls/keyBoardControl.js";
import { buildTutorial } from "./controls/tutorialControl.js";
import { checkCollisions } from "./controls/collisionsControl.js";
import { updateCameraPosition } from "./controls/cameraControl.js";
import { createBBHelper } from "./helpers/bbHelper.js";
import { levels, scene, walls, bbWalls, currentLevelIndex } from "./constants/constants.js";
import { TankImport } from "./components/importTank.js";
import { createLampposts } from "./components/importLamp.js";
import { createLightsForLevel1 } from "./components/createLight.js";

let renderer, camera, material, light, orbit, prevCameraPosition;
let orbitControlsEnabled = false;

const initialWidth = 85;
const initialHeight = 60;

let planeWidth = initialWidth;
let planeHeight = initialHeight;

function init() {
  renderer = initRenderer();
  camera = initCamera(new THREE.Vector3(0, 15, 30));
  material = setDefaultMaterial();
  light = initDefaultBasicLight(scene);
  orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enabled = false;

  // Configuração inicial do canvas
  updateRendererSize();
  updateCameraAspect();
  updateGroundPlane();
}

function updateRendererSize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
}

function updateCameraAspect() {
  const aspect = Math.max(window.innerWidth / window.innerHeight);
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
}

function updateGroundPlane() {
  // Remove o plano antigo
  const oldPlane = scene.getObjectByName("groundPlane");
  if (oldPlane) {
    scene.remove(oldPlane);
  }

  // Ajusta o tamanho do plano com base na nova proporção
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

init();

window.addEventListener("resize", onWindowResize, false);

window.addEventListener("keydown", function (event) {
  if (event.key === "o") {
    orbitControlsEnabled = !orbitControlsEnabled;

    if (orbitControlsEnabled) {
      prevCameraPosition = camera.position.clone();
      orbit.enabled = true;
    } else {
      orbit.enabled = false;
      camera.position.copy(prevCameraPosition);
    }
  } else if (event.key === "1") {
    resetaJogo(0);
  } else if (event.key == "2") {
    resetaJogo(1);
  }
});

function clearPreviousLevel() {
  // Remover paredes da cena
  walls.forEach((wall) => scene.remove(wall));
  walls.length = 0; // Limpa a lista de paredes

  // Remover bounding boxes da cena
  bbWalls.forEach((bbWall) => {
    scene.remove(bbWall);
  });
  bbWalls.length = 0; // Limpa a lista de bounding boxes
}

function resetaJogo(currentLevelIndex) {
  // Limpar cena
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }
  clearPreviousLevel();
  // Recriar o plano de fundo (ground plane)
  updateGroundPlane();

  light = initDefaultBasicLight(scene);

  // Recriar o nível atual
  createLevel(levels[currentLevelIndex], planeWidth / 2, planeHeight, scene);

  // Recriar os tanques nas posições iniciais
  if (currentLevelIndex === 0) {
    //Adicionar o tanque na posição (-20, 0, -15)
    //Adicionar o tanque na posição (20, 0, -15)
  } else if (currentLevelIndex === 1) {
    //Adicionar o tanque na posição (-30, 0, -15)
    //Adicionar o tanque na posição (30, 0, -15)
    //Adicionar o tanque na posição (30, 0, 15)
  }
  // Adicionar os tanques à cena
  scene.add(tank1.object);
  scene.add(tank2.object);

  // Recriar os bounding boxes dos tanques
  bbTank1 = new THREE.Box3().setFromObject(tank1.object);
  bbTank2 = new THREE.Box3().setFromObject(tank2.object);

  // Adicionar bounding boxes helpers à cena
  bbHelper1 = createBBHelper(bbTank1, "white");
  bbHelper2 = createBBHelper(bbTank2, "white");
  scene.add(bbHelper1);
  scene.add(bbHelper2);

  // Recriar o placar
  placar1.changeMessage("Dano Tanque 1 (Vermelho) 0");
  placar2.changeMessage("Dano Tanque 2 (Azul) 0");

  // Resetar dano dos tanques
  tank1.dano = 0;
  tank2.dano = 0;

  if (currentLevelIndex === 1) {
    // Adicionar luzes para o nível 1
    createLightsForLevel1(scene, renderer);

    // Criação de postes de luz
    createLampposts(scene);
  }
}

// Criando o nível com as dimensões iniciais
createLevel(levels[currentLevelIndex], planeWidth / 2, planeHeight, scene);

//Exemplo de criar o tanque importado
let tank = new TankImport(0xff0000, new THREE.Vector3(0, 0, 0), Math.PI);

// Criando os tanques
let tank1 = new Tank(0xff0000, new THREE.Vector3(-20, 0, 15));
let tank2 = new Tank(0x4169e1, new THREE.Vector3(20, 0, 15));

// Adicionando os tanques à cena
scene.add(tank1.object);
scene.add(tank2.object);

//Adicionando o tanque na cena
tank
  .loadTank()
  .then((tankObject) => {
    tankObject.position.copy(new THREE.Vector3(0, 0, 0)); // Define a posição do tanque
    tankObject.rotation.y = Math.PI; // Define a rotação do tanque
    tankObject.traverse((child) => {
      if (child.isMesh) {
        child.material.color.setHex(0xff0000); // Ajusta a cor do tanque
      }
    });
    scene.add(tankObject);
    console.log("Tanque adicionado à cena:", tankObject);
  })
  .catch((error) => {
    console.error("Erro ao adicionar o tanque à cena:", error);
  });

// Criando os bounding boxes dos tanques
let bbTank1 = new THREE.Box3();
let bbTank2 = new THREE.Box3();

bbTank1.setFromObject(tank1.object);
bbTank2.setFromObject(tank2.object);

let bbHelper1 = createBBHelper(bbTank1, "white");
let bbHelper2 = createBBHelper(bbTank2, "white");
scene.add(bbHelper1);
scene.add(bbHelper2);

// Função para criar a caixa de informações do tutorial
buildTutorial();

// Inicializando os placares
const placar1 = new SecondaryBoxTopEsquerda();
const placar2 = new SecondaryBoxTopDireita();

function mostraPlacar() {
  placar1.changeMessage("Dano Tanque 1 (Vermelho) " + tank1.dano);
  placar2.changeMessage("Dano Tanque 2 (Azul) " + tank2.dano);
}

function VerificaPlacar() {
  if (tank1.dano >= 10) {
    alert("Tanque 2 (azul) venceu!");
    resetaJogo();
  } else if (tank2.dano >= 10) {
    alert("Tanque 1 (vermelho) venceu!");
    resetaJogo();
  }
}

function render() {
  keyboardUpdateTank1(tank1, bbTank1, tank2, bbTank2);
  keyboardUpdateTank2(tank2, bbTank2, tank1, bbTank1);
  checkCollisions(tank1.object, bbTank1, tank2.object, bbTank2, bbWalls);
  updateCameraPosition(camera, tank1.object, tank2.object, orbitControlsEnabled);

  mostraPlacar();
  VerificaPlacar();

  bbHelper1.visible = false;
  bbHelper2.visible = false;

  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

render();
