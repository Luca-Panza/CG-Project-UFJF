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

import createTank from "./components/createTank.js";
import { keyboardUpdateTank1, keyboardUpdateTank2 } from "./controls/keyBoardTanks.js";

let scene, renderer, camera, material, light, orbit; // Initial variables
let currentLevelIndex = 0; // Index of the current level
const levels = [ // Arrays of levels
  [ // Level 1
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ],

];

scene = new THREE.Scene(); // Create the main scene
renderer = initRenderer(); // Initialize a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Initialize the camera at this position
material = setDefaultMaterial(); // Create a default material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls(camera, renderer.domElement); // Allow rotation, pan, zoom, etc. with the mouse

// Listen for window size changes
window.addEventListener(
  "resize",
  function () {
    onWindowResize(camera, renderer);
  },
  false
);

// Create the ground plane
const planeWidth = 85;
const planeHeight = 60;
let plane = createGroundPlaneXZ(planeWidth, planeHeight);
scene.add(plane);

// Function to create the level based on the current level matrix
function createLevel(levelData) {
  const wallGeometry = new THREE.BoxGeometry(5, 5, 5);
  const wallMaterial = new THREE.MeshBasicMaterial({ color: "green" });

  const blockSize = 5;
  // Calculate the offset to center the level on the plane
  const offsetX = - ((planeWidth/2) - (blockSize/2));
  const offsetZ = ((planeHeight/2) - (blockSize/2));

  for (let i = 0; i < levelData.length; i++) {
    for (let j = 0; j < levelData[i].length; j++) {
      if (levelData[i][j] === 1) {
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        // Position the block within the plane
        const posX = j * 5 + offsetX;
        const posY = 2.5;
        const posZ = -i * 5 + offsetZ;
        wall.position.set(posX, posY, posZ);
        scene.add(wall);
      }
    }
  }
}

// Create the current level
createLevel(levels[currentLevelIndex]);

// Create the tanks and add them to the scene
const tank1 = createTank(0xff0000, 0x505050, new THREE.Vector3(-0, 0, 0));
const tank2 = createTank(0x00ff00, 0x505050, new THREE.Vector3(25, 0, 0));

scene.add(tank1);
scene.add(tank2);

function render() {
  keyboardUpdateTank1(tank1);
  keyboardUpdateTank2(tank2);
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

render();
