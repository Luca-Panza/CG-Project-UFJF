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
import { levels } from "./constants/constants.js";

let scene, renderer, camera, material, light, orbit; // Initial variables
let currentLevelIndex = 0; // Index of the current level

scene = new THREE.Scene(); // Create the main scene
renderer = initRenderer(); // Initialize a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Initialize the camera at this position
material = setDefaultMaterial(); // Create a default material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls(camera, renderer.domElement); // Allow rotation, pan, zoom, etc. with the mouse
var infoBox = new SecondaryBox("Teste");

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

function checkCollisionsTankTank(tank1, bbTank1, tank2, bbTank2)
{
  let collision = bbTank1.intersectsBox(bbTank2);
  if (collision) {
    infoBox.changeMessage("Collision detected");
    // em caso de colisão restaura a posição antiga 
    tank1.position.copy(tank1.previousPosition);
    //atualiza os limites
    bbTank1.setFromObject(tank1);
    // em caso de colisão restaura a posição antiga 
    tank2.position.copy(tank2.previousPosition);
    //atualiza os limites
    bbTank2.setFromObject(tank2);
  }
}

function checkCollisionsTankWall(tank, bbTank)
{
  for (let i = 0; i < bbWalls.length; i++) {
    const bbWall = bbWalls[i]; // Access the current bounding box object
    let collision = bbWall.intersectsBox(bbTank);
    if (collision){
      infoBox.changeMessage("Collision detected");
      // em caso de colisão restaura a posição antiga 
      tank.position.copy(tank.previousPosition);
      //atualiza os limites
      bbTank.setFromObject(tank);
    }
  }
}

function render() {
  // this.bbhelpers = true;
  keyboardUpdateTank1(tank1, bbTank1);
  keyboardUpdateTank2(tank2, bbTank2);
  infoBox.changeMessage("No collision detected");
  checkCollisionsTankTank(tank1, bbTank1, tank2, bbTank2); 
  checkCollisionsTankWall(tank1, bbTank1);
  checkCollisionsTankWall(tank2, bbTank2);
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

render();
