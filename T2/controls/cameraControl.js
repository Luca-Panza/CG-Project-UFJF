import * as THREE from "three";

// Função para atualizar a posição da câmera
function updateCameraPosition(camera, tank1, orbitControlsEnabled) {
  if (!orbitControlsEnabled) {
    const offsetX = 0; // Deslocamento lateral da câmera em relação ao tanque
    const offsetY = 50; // Altura da câmera em relação ao tanque
    const offsetZ = 30; // Distância da câmera atrás do tanque

    // Pega a posição atual do tanque 1
    const tankPosition = tank1.position;

    // Define a nova posição da câmera relativa ao tanque
    camera.position.set(
      tankPosition.x + offsetX,
      tankPosition.y + offsetY,
      tankPosition.z + offsetZ
    );

    // Faz a câmera olhar diretamente para o tanque 1
    camera.lookAt(tankPosition);
  }
}

export { updateCameraPosition };
