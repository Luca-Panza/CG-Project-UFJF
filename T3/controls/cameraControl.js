import * as THREE from "three";

let zoomLevel = 30; // Valor inicial da distância (zoom)

function handleMouseWheel(event) {
  const zoomSpeed = 1.2;
  // Aumenta ou diminui o zoom com base no movimento do scroll
  zoomLevel += event.deltaY * 0.05; // Multiplicador ajustável para sensibilidade
  zoomLevel = Math.max(10, Math.min(100, zoomLevel)); // Limita o zoom entre 10 e 100
}

// Função para atualizar a posição da câmera
function updateCameraPosition(camera, tank1, orbitControlsEnabled) {
  if (!orbitControlsEnabled) {
    const offsetX = 0; // Deslocamento lateral da câmera em relação ao tanque
    const offsetY = 50; // Altura da câmera em relação ao tanque

    // Pega a posição atual do tanque 1
    const tankPosition = tank1.position;

    // Define a nova posição da câmera relativa ao tanque com base no zoomLevel
    camera.position.set(
      tankPosition.x + offsetX,
      tankPosition.y + zoomLevel,
      tankPosition.z + zoomLevel
    );

    // Faz a câmera olhar diretamente para o tanque 1
    camera.lookAt(tankPosition);
  }
}

// Adiciona o event listener para o scroll do mouse
window.addEventListener('wheel', handleMouseWheel);

export { updateCameraPosition };
