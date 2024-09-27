import { capsuleBoundingBox } from "../components/createCapsule.js";

function checkPowerUpCollision(tankBoundingBox) {
  if (capsuleBoundingBox) {
    // Verifica se o bounding box da cápsula e do tanque estão intersectando
    return capsuleBoundingBox.intersectsBox(tankBoundingBox);
  }
  return false;
}

export { checkPowerUpCollision };
