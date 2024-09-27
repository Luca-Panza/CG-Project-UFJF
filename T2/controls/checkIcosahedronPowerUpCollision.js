import { icosahedronBoundingBox } from "../components/createIcosahedronPowerUp.js";

function checkIcosahedronPowerUpCollision(tankBoundingBox) {
  if (icosahedronBoundingBox) {
    // Verifica se o bounding box do icosaedro e do tanque estão intersectando
    return icosahedronBoundingBox.intersectsBox(tankBoundingBox);
  }
  return false;
}

export { checkIcosahedronPowerUpCollision };
