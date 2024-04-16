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

export { updateCameraPosition };
