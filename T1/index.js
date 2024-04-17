import * as THREE from "three";
import { OrbitControls } from "../build/jsm/controls/OrbitControls.js";
import { Tank } from "./components/createTank.js";
import {
  initRenderer,
  initCamera,
  initDefaultBasicLight,
  setDefaultMaterial,
  onWindowResize,
  createGroundPlaneXZ,
} from "../libs/util/util.js";
import { InfoBox, InfoBox2, InfoBoxTopEsquerda, InfoBoxTopDireita, SecondaryBoxTopEsquerda, SecondaryBoxTopDireita } from "./util/util.js"

// import { createTank } from "./components/createTank.js";
import { createLevel } from "./components/createLevel.js";
import { keyboardUpdateTank1, keyboardUpdateTank2 } from "./controls/keyBoardControl.js";
import { checkCollisions } from "./controls/collisionsControl.js";
import { updateCameraPosition } from "./controls/cameraControl.js";
import { createBBHelper } from "./helpers/bbHelper.js";
import { levels, scene, bbWalls } from "./constants/constants.js";

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
createLevel(levels[currentLevelIndex], planeWidth, planeHeight, scene);

// Criando os tanques
let tank1 = new Tank(0xff0000, new THREE.Vector3(-20, 0, 15));
let tank2 = new Tank(0x4169e1, new THREE.Vector3(20, 0, 15));
//const tank1 = createTank(0xff0000, new THREE.Vector3(-20, 0, 15));
//const tank2 = createTank(0x4169e1, new THREE.Vector3(20, 0, 15));

// Adicionando os tanques à cena
scene.add(tank1.object );
scene.add(tank2.object );

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

buildTutorial();

function buildTutorial() {
  let controls = new InfoBox();
  controls.add("Tanque 1");
  controls.addParagraph();
  controls.add("Mover");
  controls.add("Esquerda/ Direita : A / D");
  controls.add("Frente/ Trás : W / S");
  controls.addParagraph();
  controls.add("Atirar");
  controls.add("Espaço ou Q");
  controls.show();

  let controls2 = new InfoBox2();
  controls2.add("Tanque 2");
  controls2.addParagraph();
  controls2.add("Mover");
  controls2.add("Esquerda/ Direita : Seta Esquerda / Seta Direita");
  controls2.add("Frente/ Trás : Seta cima / Seta baixo");
  controls2.addParagraph();
  controls2.add("Atirar");
  controls2.add("/ ou ,");
  controls2.show();
}

const placar1 = new SecondaryBoxTopEsquerda();
const placar2 = new SecondaryBoxTopDireita();
function mostraPlacar(){
  placar1.changeMessage("Dano Tanque 1 (Vermelho) " + tank1.dano);
  placar2.changeMessage("Dano Tanque 2 (Azul) " + tank2.dano);
}

function resetaJogo() {
  tank1.dano = 0;
  tank2.dano = 0;
  location.reload();
}

function VerificaPlacar() {
  if(tank1.dano >= 10){
    alert("Tanque 2 (azul) venceu!")
    resetaJogo();
  } else if (tank2.dano >= 10) {
    alert("Tanque 1 (vermelho) venceu!")
    resetaJogo();
  }
}


function render() {
  keyboardUpdateTank1(tank1 , bbTank1, tank2, bbTank2);
  keyboardUpdateTank2(tank2 , bbTank2, tank1, bbTank1);
  checkCollisions(tank1.object, bbTank1, tank2.object, bbTank2, bbWalls);
  updateCameraPosition(camera, tank1.object, tank2.object , orbitControlsEnabled);

  mostraPlacar();
  VerificaPlacar();

  // Ajustando a visibilidade dos helpers
  bbHelper1.visible = false;
  bbHelper2.visible = false;

  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

render();
