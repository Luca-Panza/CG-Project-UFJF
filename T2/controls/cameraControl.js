import * as THREE from "three";

// Função para atualizar a posição da câmera
function updateCameraPosition(camera, index, tank1, tank2, tank3, orbitControlsEnabled) {
  if (index === 0) {
    const minDistance = 15; // Distância mínima entre os tanques

    const midpoint = new THREE.Vector3()
      .addVectors(tank1.position, tank2.position)
      .multiplyScalar(0.5); // Ponto médio entre os dois tanques
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
  else if (index === 1) {
    const minDistance = 40; // Distância mínima entre os tanques

    // Calcula o ponto médio entre os três tanques
    const midpoint = new THREE.Vector3()
      .addVectors(tank1.position, tank3.position, tank2.position)
      .divideScalar(3); // Ponto médio entre os três tanques

    // Calcula a distância média entre os tanques
    const distance1 = tank1.position.distanceTo(tank2.position);
    const distance2 = tank2.position.distanceTo(tank3.position);
    const distance3 = tank3.position.distanceTo(tank1.position);
    const averageDistance = (distance1 + distance2 + distance3) / 3;

    const adjustedDistance = Math.max(averageDistance, minDistance); // Distância ajustada
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
}

export { updateCameraPosition };
