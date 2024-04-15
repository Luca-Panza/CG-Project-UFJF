import * as THREE from "three";

function updateCameraPosition(camera, tank1, tank2, orbitControlsEnabled) {
  const minDistance = 15;

  const midpoint = new THREE.Vector3().addVectors(tank1.position, tank2.position).multiplyScalar(0.5);
  const distance = tank1.position.distanceTo(tank2.position);

  const adjustedDistance = Math.max(distance, minDistance);
  const angle = Math.PI / 2;

  if (!orbitControlsEnabled) {
    const offsetX = Math.cos(angle) * adjustedDistance;
    const offsetY = adjustedDistance;
    const offsetZ = Math.sin(angle) * adjustedDistance;

    camera.position.set(midpoint.x + offsetX, midpoint.y + offsetY, midpoint.z + offsetZ);
    camera.lookAt(midpoint);
  }
}

/*

function toggleOrbitControls(camera, orbit, prevCameraPosition, orbitControlsEnabled) {
  const minDistance = 35;

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
}

*/

export { updateCameraPosition /*toggleOrbitControls*/ };
