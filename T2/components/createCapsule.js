import * as THREE from "three";
import { levels } from "../constants/constants.js"; // Importa a matriz de níveis

let capsule = null;
let capsuleBoundingBox = null; // Variável para armazenar o bounding box da cápsula

// Função que cria a cápsula de power-up no ambiente
function createCapsule(scene, index) {
  const geometry = new THREE.CapsuleGeometry(0.5, 1, 10, 20);
  const material = new THREE.MeshPhongMaterial({
    color: 0x00ff00, // Cor verde
    emissive: 0x00ff00, // Cor emissiva (brilho verde)
    emissiveIntensity: 0.5, // Intensidade do brilho
    shininess: 100, // Brilho especular
  });

  capsule = new THREE.Mesh(geometry, material);

  // Inclina a cápsula para evidenciar a rotação
  capsule.rotation.z = Math.PI / 4;

  // Posiciona a cápsula em uma posição válida
  const position = getRandomValidPosition(index); // Passa o nível atual
  capsule.position.copy(position);

  // Cria o BoundingBox da cápsula
  capsuleBoundingBox = new THREE.Box3().setFromObject(capsule);

  // Adiciona a cápsula à cena
  scene.add(capsule);

  return capsule;
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

// Função para rotacionar a cápsula lentamente
function rotateCapsule() {
  if (capsule) {
    capsule.rotation.y += 0.01; // Animação de rotação
    capsuleBoundingBox.setFromObject(capsule); // Atualiza o bounding box conforme a cápsula rotaciona
  }
}

// Função para remover a cápsula da cena
function removeCapsule(scene) {
  if (capsule) {
    scene.remove(capsule);
    capsule = null;
    capsuleBoundingBox = null; // Remove o bounding box junto com a cápsula
  }
}

export { createCapsule, rotateCapsule, removeCapsule, capsuleBoundingBox };
