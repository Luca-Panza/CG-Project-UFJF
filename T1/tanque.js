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
scene = new THREE.Scene(); // Create main scene
renderer = initRenderer(); // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener(
  "resize",
  function () {
    onWindowResize(camera, renderer);
  },
  false
);

/*
// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);
*/

// Create the ground plane
let plane = createGroundPlaneXZ(60, 60);
scene.add(plane);

// Create the tanks and add to the scene
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
