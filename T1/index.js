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
import { levels, scene, bbWalls } from "./constants/constants.js";

let renderer, camera, material, light, orbit, prevCameraPosition;
let orbitControlsEnabled = false;
let currentLevelIndex = 0;

const initialWidth = 85;
const initialHeight = 60;

let planeWidth = initialWidth;
let planeHeight = initialHeight;

function init() {
  renderer = initRenderer();
  camera = initCamera(new THREE.Vector3(0, 15, 30));
  material = setDefaultMaterial();
  light = initDefaultBasicLight(scene); // Comentar para remover a inicial "forte" ambiente
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
    currentLevelIndex = 0;
    resetaJogo();
  } else if (event.key == "2") {
    currentLevelIndex = 1;
    resetaJogo();
  }
});

//LUCA
/*
currentLevelIndex = 1;

//Criação da luz ambiente
let ambientColor = "rgb(100,100,100)";
const ambientLight = new THREE.AmbientLight(ambientColor);
scene.add(ambientLight);

function createSpotLight(position, targetPosition) {
  const spotLight = new THREE.SpotLight("white", 20);
  spotLight.position.copy(position);
  spotLight.angle = THREE.MathUtils.degToRad(40);
  spotLight.castShadow = true;
  spotLight.target.position.copy(targetPosition);
  scene.add(spotLight);
  scene.add(spotLight.target);

  const spotHelper = new THREE.SpotLightHelper(spotLight, 0xff8c00);
  scene.add(spotHelper);

  const shadowHelper = new THREE.CameraHelper(spotLight.shadow.camera);
  scene.add(shadowHelper);
}

// Criação das luzes spot nos quatro cantos do mapa
createSpotLight(new THREE.Vector3(-25, 10, -10), new THREE.Vector3(-25, 0, -10)); // Luz 1
createSpotLight(new THREE.Vector3(25, 10, -10), new THREE.Vector3(25, 0, -10)); // Luz 2
createSpotLight(new THREE.Vector3(-25, 10, 10), new THREE.Vector3(-25, 0, 10)); // Luz 3
createSpotLight(new THREE.Vector3(25, 10, 10), new THREE.Vector3(25, 0, 10)); // Luz 4

// Habilitação do mapeamento de sombras no renderizador
//renderer.shadowMap.enabled = true; // Habilita sombras
//renderer.shadowMap.type = THREE.VSMShadowMap; // Define o tipo de sombras
*/

// Criando o nível com as dimensões iniciais
createLevel(levels[currentLevelIndex], planeWidth / 2, planeHeight, scene);

// Criando os tanques
let tank1 = new Tank(0xff0000, new THREE.Vector3(-20, 0, 15));
let tank2 = new Tank(0x4169e1, new THREE.Vector3(20, 0, 15));

// Adicionando os tanques à cena
scene.add(tank1.object);
scene.add(tank2.object);

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

function resetaJogo() {
  tank1.dano = 0;
  tank2.dano = 0;
  location.reload();
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
