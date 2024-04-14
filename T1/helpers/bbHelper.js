import * as THREE from "three";

function createBBHelper(bb, color) {
  // Create a bounding box helper
  let helper = new THREE.Box3Helper(bb, color);
  return helper;
}

export { createBBHelper };
