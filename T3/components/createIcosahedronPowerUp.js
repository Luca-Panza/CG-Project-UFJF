import * as THREE from "three";
import { levels } from "../constants/constants.js"; // Importa a matriz de níveis

let icosahedronPowerUp = null;
let icosahedronBoundingBox = null; // Variável para armazenar o bounding box do icosaedro

// Função que cria o icosaedro de power-up no ambiente
function createIcosahedronPowerUp(scene, index) {
  const geometry = new THREE.IcosahedronGeometry(1, 0);
  const material = new THREE.MeshPhongMaterial({
    color: 0xff0000, // Cor vermelha
    emissive: 0xff0000, // Cor emissiva (brilho vermelho)
    emissiveIntensity: 0.5, // Intensidade do brilho
    shininess: 100, // Brilho especular
  });

  icosahedronPowerUp = new THREE.Mesh(geometry, material);

  // Posiciona o icosaedro em uma posição válida
  const position = getRandomValidPosition(index); // Passa o nível atual
  icosahedronPowerUp.position.copy(position);

  // Cria o BoundingBox do icosaedro
  icosahedronBoundingBox = new THREE.Box3().setFromObject(icosahedronPowerUp);

  // Adiciona o icosaedro à cena
  scene.add(icosahedronPowerUp);

  return icosahedronPowerUp;
}

let lastPosition = null; // Variável para armazenar a última posição utilizada

// Função que retorna uma posição válida e randômica com base no nível atual
function getRandomValidPosition(index) {
  const levelMap = levels[index]; // Obtém a matriz do nível atual
  const validPositions = [];
  const minDistance = 10; // Distância mínima para evitar repetição de posições muito próximas

  // Percorre a matriz do mapa e coleta posições válidas (onde o valor é 0)
  for (let z = 0; z < levelMap.length; z++) {
    for (let x = 0; x < levelMap[z].length; x++) {
      if (levelMap[z][x] === 0) {
        const potentialPosition = new THREE.Vector3(
          x - levelMap[z].length / 2,
          1,
          z - levelMap.length / 2
        );

        // Se não houver última posição, adicione todas as posições válidas
        if (!lastPosition) {
          validPositions.push(potentialPosition);
        } else {
          // Calcula a distância entre a posição anterior e a nova posição candidata
          const distance = potentialPosition.distanceTo(lastPosition);
          if (distance > minDistance) {
            // Somente adiciona a posição se estiver a uma distância maior que a mínima
            validPositions.push(potentialPosition);
          }
        }
      }
    }
  }

  // Escolhe uma posição aleatória da lista de posições válidas
  const randomIndex = Math.floor(Math.random() * validPositions.length);
  lastPosition = validPositions[randomIndex]; // Armazena a nova posição como a última utilizada
  return validPositions[randomIndex];
}

// Função para rotacionar o icosaedro lentamente
function rotateIcosahedronPowerUp() {
  if (icosahedronPowerUp) {
    icosahedronPowerUp.rotation.y += 0.01; // Animação de rotação
    icosahedronBoundingBox.setFromObject(icosahedronPowerUp); // Atualiza o bounding box conforme o icosaedro rotaciona
  }
}

// Função para remover o icosaedro da cena
function removeIcosahedronPowerUp(scene) {
  if (icosahedronPowerUp) {
    scene.remove(icosahedronPowerUp);
    icosahedronPowerUp = null;
    icosahedronBoundingBox = null; // Remove o bounding box junto com o icosaedro
  }
}

export {
  createIcosahedronPowerUp,
  rotateIcosahedronPowerUp,
  removeIcosahedronPowerUp,
  icosahedronBoundingBox,
};
