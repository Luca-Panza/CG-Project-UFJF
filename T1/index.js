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
import { keyboardUpdateTank1, keyboardUpdateTank2 } from "./controls/keyBoardTanks.js";
import { checkCollisions } from "./controls/checkCollisions.js";
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

window.addEventListener('keydown', function(event) {
  if (event.key === 'o') {
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

// criando esse objeto para guardar as paredes do cenário e seus limites
const walls = [];
const bbWalls = [];

// Function to create the level based on the current level matrix
function createLevel(levelData) {
  const wallGeometry = new THREE.BoxGeometry(5, 5, 5);
  const wallMaterial = new THREE.MeshBasicMaterial({ color: 'grey' });

  const blockSize = 5;
  // Calculate the offset to center the level on the plane
  const offsetX = -(planeWidth / 2 - blockSize / 2);
  const offsetZ = planeHeight / 2 - blockSize / 2;

  for (let i = 0; i < levelData.length; i++) {
    for (let j = 0; j < levelData[i].length; j++) {
      if (levelData[i][j] === 1) {
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        // Position the block within the plane
        const posX = j * 5 + offsetX;
        const posY = 2.5;
        const posZ = -i * 5 + offsetZ;
        wall.position.set(posX, posY, posZ);
        let bbWall = new THREE.Box3();
        bbWall.setFromObject(wall);
        //let bbHelperWall = createBBHelper(bbWall, 'white');
        walls.push(wall);
        bbWalls.push(bbWall);
        scene.add(wall);
      }
    }
  }
}

// Create the current level
createLevel(levels[currentLevelIndex]);

function createBBHelper(bb, color) {
  // Create a bounding box helper
  let helper = new THREE.Box3Helper(bb, color);
  scene.add(helper);
  return helper;
}

// Criando os tanques e seus bounding box e adiciondo a cena
const tank1 = createTank(0xff0000, new THREE.Vector3(-20, 0, 15));
const tank2 = createTank(0x0000ff, new THREE.Vector3(20, 0, 15));


let bbTank1 = new THREE.Box3();
bbTank1.setFromObject(tank1);
// let bbHelper1 = createBBHelper(bbTank1, 'white');

let bbTank2 = new THREE.Box3();
bbTank2.setFromObject(tank2);
// let bbHelper2 = createBBHelper(bbTank2, 'white');

scene.add(tank1);
scene.add(tank2);

function updateCameraPosition() {
  const minDistance = 15;

  const midpoint = new THREE.Vector3().addVectors(tank1.position, tank2.position).multiplyScalar(0.5);
  const distance = tank1.position.distanceTo(tank2.position);

  const adjustedDistance = Math.max(distance, minDistance);
  const angle = Math.PI / 2;

  if (!orbitControlsEnabled) { // Apenas ajuste a posição da câmera se os controles orbitais estiverem desativados
    // Calcula as coordenadas x, y e z da posição da câmera com base no ângulo e na distância ajustada
    const offsetX = Math.cos(angle) * adjustedDistance;
    const offsetY = adjustedDistance;
    const offsetZ = Math.sin(angle) * adjustedDistance;

    camera.position.set(midpoint.x + offsetX, midpoint.y + offsetY, midpoint.z + offsetZ);
    camera.lookAt(midpoint);
  }
}

function render() {
  // this.bbhelpers = true;
  keyboardUpdateTank1(tank1, bbTank1);
  keyboardUpdateTank2(tank2, bbTank2);
  // infoBox.changeMessage("No collision detected");
  checkCollisions(tank1, bbTank1, tank2, bbTank2, bbWalls);
  updateCameraPosition();
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

render();
