import * as THREE from "three";

// Função para criar um helper para a bounding box
function createBBHelper(bb, color) {
  let helper = new THREE.Box3Helper(bb, color);
  return helper;
}

export { createBBHelper };
