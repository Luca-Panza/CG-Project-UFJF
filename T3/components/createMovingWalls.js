import * as THREE from "three";
import { createBBHelper } from "../helpers/bbHelper.js";
import { bbMovingWalls, movingWalls } from "../constants/constants.js";

let movingWalls2 = [];
const planeWidth = 110; // Largura do plano
const planeHeight = 60; // Altura do plano

function createMovingWall(scene, position, height) {
  const geometry = new THREE.BoxGeometry(5, 10, 5);

  // Carregar a textura da caixa (crate)
  const textureLoader = new THREE.TextureLoader();
  const crateTexture = textureLoader.load("./assets/crateTextures/movingCrateTexture.jpg");

  // Aplicar a textura ao material de Phong
  const material = new THREE.MeshPhongMaterial({ map: crateTexture });

  crateTexture.colorSpace = THREE.SRGBColorSpace; // Definir o colorSpace da textura

  const wall = new THREE.Mesh(geometry, material);

  let bbMovableWall = new THREE.Box3().setFromObject(wall); // Inicializa o bounding box
  let bbHelperMovableWall = createBBHelper(bbMovableWall, "white"); // Cria o helper visual

  bbMovingWalls.push(bbMovableWall);

  wall.position.set(position.x, position.y, position.z);
  wall.rotation.x = Math.PI / 2;
  scene.add(wall);

  movingWalls.push(wall);

  movingWalls2.push({
    wall: wall,
    bbHelper: bbHelperMovableWall, // Salva o helper junto com a parede
    bbMovableWall: bbMovableWall, // Salva o bounding box junto com a parede
    direction: 1,
    speed: Math.random() * 0.1 + 0.01,
  });

  console.log("Moving wall created:", wall);
}

function updateWalls() {
  console.log("Updating walls...");
  movingWalls2.forEach((entry) => {
    let wall = entry.wall;
    wall.position.z += entry.direction * entry.speed;

    // Verificar os limites e inverter a direção
    if (wall.position.z > planeHeight / 4.7 || wall.position.z < -planeHeight / 4.7) {
      entry.direction *= -1;
    }

    // Atualizar o bounding box e o helper
    let bbMovableWall = new THREE.Box3().setFromObject(wall); // Atualiza o Box3 com a nova posição da parede
    let bbHelperMovableWall = entry.bbHelper; // O helper associado à parede

    bbMovingWalls.push(bbMovableWall);

    // Atualiza a posição do helper para o novo bounding box
    bbHelperMovableWall.box.setFromObject(wall);
  });
}

// Função para obter os detalhes de uma parede específica
function getWallDetails(index) {
  if (index >= 0 && index < movingWalls2.length) {
    return movingWalls2[index];
  }
  return null;
}

// Exporte as funções
export { createMovingWall, updateWalls, getWallDetails };
