import * as THREE from "three";
import { OrbitControls } from "../build/jsm/controls/OrbitControls.js";
import {
  initRenderer,
  initCamera,
  initDefaultBasicLight,
  setDefaultMaterial,
  onWindowResize,
  createGroundPlaneXZ,
} from "../libs/util/util.js";
import { SecondaryBoxTopEsquerda, SecondaryBoxTopDireita } from "./util/util.js";

import { Tank } from "./components/createTank.js";
import { createLevel } from "./components/createLevel.js";
import { keyboardUpdateTank1, keyboardUpdateTank2 } from "./controls/keyBoardControl.js";
import { buildTutorial } from "./controls/tutorialControl.js";
import { checkCollisions } from "./controls/collisionsControl.js";
import { updateCameraPosition } from "./controls/cameraControl.js";
import { createBBHelper } from "./helpers/bbHelper.js";
import { levels, scene, bbWalls } from "./constants/constants.js";

let renderer, camera, material, light, orbit, prevCameraPosition; // Variável global para a posição anterior da câmera
let orbitControlsEnabled = false; // Variável global para controlar se os controles orbitais estão ativados
let currentLevelIndex = 0; // Index of the current level

renderer = initRenderer(); // Initialize a basic rendererInfoBox, InfoBox2,
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Initialize the camera at this position
material = setDefaultMaterial(); // Create a default material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls(camera, renderer.domElement); // Inicialização dos controles orbitais (inicialmente desativados)
orbit.enabled = false; // Desativar os controles orbitais

// Adicionando um listener para o evento de resize
window.addEventListener(
  "resize",
  function () {
    onWindowResize(camera, renderer);
  },
  false
);

// Adicionando um listener para a tecla 'o' para habilitar/desabilitar os controles orbitais
window.addEventListener("keydown", function (event) {
  if (event.key === "o") {
    orbitControlsEnabled = !orbitControlsEnabled;

    if (orbitControlsEnabled) {
      // Se os controles orbitais estiverem sendo ativados, salve a posição atual da câmera
      prevCameraPosition = camera.position.clone();
      orbit.enabled = true;
    } else {
      // Se os controles orbitais estiverem sendo desativados, restaure a posição da câmera
      orbit.enabled = false;
      camera.position.copy(prevCameraPosition);
    }
  }
});

// Criando o plano
const planeWidth = 85;
const planeHeight = 60;
let plane = createGroundPlaneXZ(planeWidth, planeHeight);
scene.add(plane);

// Função para criar o nível
createLevel(levels[currentLevelIndex], planeWidth, planeHeight, scene);

// Criando os tanques
let tank1 = new Tank(0xff0000, new THREE.Vector3(-20, 0, 15));
let tank2 = new Tank(0x4169e1, new THREE.Vector3(20, 0, 15));

// Adicionando os tanques à cena
scene.add(tank1.object);
scene.add(tank2.object);

// Criando os bounding boxes dos tanques
let bbTank1 = new THREE.Box3();
let bbTank2 = new THREE.Box3();

// Definindo os bounding boxes dos tanques
bbTank1.setFromObject(tank1.object);
bbTank2.setFromObject(tank2.object);

// Adicionando os bounding boxes dos tanques à cena
let bbHelper1 = createBBHelper(bbTank1, "white");
let bbHelper2 = createBBHelper(bbTank2, "white");
scene.add(bbHelper1);
scene.add(bbHelper2);

// Função para criar a caixa de informações do tutorial
buildTutorial();

// Inicializando os placares
const placar1 = new SecondaryBoxTopEsquerda();
const placar2 = new SecondaryBoxTopDireita();

// Função para mostrar o placar
function mostraPlacar() {
  placar1.changeMessage("Dano Tanque 1 (Vermelho) " + tank1.dano);
  placar2.changeMessage("Dano Tanque 2 (Azul) " + tank2.dano);
}

// Função para reiniciar o jogo
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

  // Ajustando a visibilidade dos helpers
  bbHelper1.visible = false;
  bbHelper2.visible = false;

  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

render();
