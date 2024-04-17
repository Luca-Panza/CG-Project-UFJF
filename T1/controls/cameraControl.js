import * as THREE from "three";

// Função para atualizar a posição da câmera
function updateCameraPosition(camera, tank1, tank2, orbitControlsEnabled) {
  const minDistance = 15; // Distância mínima entre os tanques

  const midpoint = new THREE.Vector3().addVectors(tank1.position, tank2.position).multiplyScalar(0.5); // Ponto médio entre os tanques
  const distance = tank1.position.distanceTo(tank2.position); // Distância entre os tanques

  const adjustedDistance = Math.max(distance, minDistance); // Distância ajustada
  const angle = Math.PI / 2; // Ângulo de rotação

  // Atualiza a posição da câmera
  if (!orbitControlsEnabled) {
    const offsetX = Math.cos(angle) * adjustedDistance;
    const offsetY = adjustedDistance;
    const offsetZ = Math.sin(angle) * adjustedDistance;

    // Define a posição da câmera
    camera.position.set(midpoint.x + offsetX, midpoint.y + offsetY, midpoint.z + offsetZ);
    camera.lookAt(midpoint);
  }
}

export { updateCameraPosition };
