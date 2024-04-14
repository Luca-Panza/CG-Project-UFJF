import * as THREE from "three";
import { OrbitControls } from "../build/jsm/controls/OrbitControls.js";
import {
  initRenderer,
  initCamera,
  initDefaultBasicLight,
  setDefaultMaterial,
  InfoBox,
  SecondaryBox,
  onWindowResize,
  createGroundPlaneXZ,
} from "../libs/util/util.js";

import { createTank } from "./components/createTank.js";
import { createLevel } from "./components/createLevel.js";
import { keyboardUpdateTank1, keyboardUpdateTank2 } from "./controls/keyBoardControl.js";
import { checkCollisions } from "./controls/collisionsControl.js";
import { updateCameraPosition } from "./controls/cameraControl.js";
import { createBBHelper } from "./helpers/bbHelper.js";
import { levels, scene } from "./constants/constants.js";

let renderer, camera, material, light, orbit, prevCameraPosition; // Variável global para a posição anterior da câmera
let orbitControlsEnabled = false; // Variável global para controlar se os controles orbitais estão ativados
let currentLevelIndex = 0; // Index of the current level

renderer = initRenderer(); // Initialize a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Initialize the camera at this position
material = setDefaultMaterial(); // Create a default material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
// Inicialização dos controles orbitais (inicialmente desativados)
orbit = new OrbitControls(camera, renderer.domElement);
orbit.enabled = false; // Desativar os controles orbitais inicialmente
// var infoBox = new SecondaryBox("Teste");

// Listen for window size changes
window.addEventListener(
  "resize",
  function () {
    onWindowResize(camera, renderer);
  },
  false
);

window.addEventListener("keydown", function (event) {
  if (event.key === "o") {
    orbitControlsEnabled = !orbitControlsEnabled; // Alternar entre habilitar e desabilitar os controles orbitais

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

// Create the ground plane
const planeWidth = 85;
const planeHeight = 60;
let plane = createGroundPlaneXZ(planeWidth, planeHeight);
scene.add(plane);

// Function to create the level based on the current level matrix
let { walls, bbWalls } = createLevel(levels[currentLevelIndex], planeWidth, planeHeight, scene);

// Criando os tanques e seus bounding box e adicionando a cena
const tank1 = createTank(0xff0000, new THREE.Vector3(-20, 0, 15));
const tank2 = createTank(0x4169e1, new THREE.Vector3(20, 0, 15));

let bbTank1 = new THREE.Box3();
bbTank1.setFromObject(tank1);
let bbHelper1 = createBBHelper(bbTank1, "white");

let bbTank2 = new THREE.Box3();
bbTank2.setFromObject(tank2);
let bbHelper2 = createBBHelper(bbTank2, "white");

scene.add(tank1);
scene.add(tank2);

function render() {
  keyboardUpdateTank1(tank1, bbTank1);
  keyboardUpdateTank2(tank2, bbTank2);
  checkCollisions(tank1, bbTank1, tank2, bbTank2, bbWalls);
  updateCameraPosition(camera, tank1, tank2, orbitControlsEnabled);

  // Ajustando a visibilidade dos helpers
  bbHelper1.visible = false;
  bbHelper2.visible = false;

  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

render();
