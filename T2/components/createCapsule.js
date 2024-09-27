import * as THREE from "three";
import { levels } from "../constants/constants.js"; // Importa a matriz de níveis

let capsule = null;
let capsuleBoundingBox = null; // Variável para armazenar o bounding box da cápsula

// Função que cria a cápsula de power-up no ambiente
function createCapsule(scene) {
  const geometry = new THREE.CapsuleGeometry(1, 2, 10, 20);
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
  const position = getRandomValidPosition();
  capsule.position.copy(position);

  // Cria o BoundingBox da cápsula
  capsuleBoundingBox = new THREE.Box3().setFromObject(capsule);

  // Adiciona a cápsula à cena
  scene.add(capsule);

  return capsule;
}

// Função que retorna uma posição válida e randômica com base no último nível
function getRandomValidPosition() {
  const levelMap = levels[levels.length - 1]; // Obtém a matriz do último nível
  const validPositions = [];

  // Percorre a matriz do mapa e coleta posições válidas (onde o valor é 0)
  for (let z = 0; z < levelMap.length; z++) {
    for (let x = 0; x < levelMap[z].length; x++) {
      if (levelMap[z][x] === 0) {
        // Adiciona a posição válida à lista de possíveis posições
        validPositions.push(
          new THREE.Vector3(
            x - levelMap[z].length / 2,
            1,
            z - levelMap.length / 2
          )
        );
      }
    }
  }

  // Escolhe uma posição aleatória da lista de posições válidas
  const randomIndex = Math.floor(Math.random() * validPositions.length);
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
