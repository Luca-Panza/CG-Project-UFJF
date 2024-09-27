import {
  createCapsule,
  rotateCapsule,
  removeCapsule,
} from "../components/createCapsule.js";
import {
  createIcosahedronPowerUp,
  rotateIcosahedronPowerUp,
  removeIcosahedronPowerUp,
} from "../components/createIcosahedronPowerUp.js";
import { checkPowerUpCollision } from "./checkPowerUpCollision.js";
import { checkIcosahedronPowerUpCollision } from "./checkIcosahedronPowerUpCollision.js";

let powerUpCooldown = 10000; // Tempo de 10 segundos
let lastPowerUpTime = 0;
let capsule = null;
let icosahedronPowerUp = null;
let currentPowerUp = null; // Controla qual power-up está ativo

function updatePowerUpSystem(scene, bbTank) {
  const currentTime = Date.now();

  // Verifica colisão com o power-up atual
  if (currentPowerUp === "capsule" && checkPowerUpCollision(bbTank)) {
    removeCapsule(scene);
    capsule = null;
    lastPowerUpTime = currentTime;
  } else if (
    currentPowerUp === "icosahedron" &&
    checkIcosahedronPowerUpCollision(bbTank)
  ) {
    removeIcosahedronPowerUp(scene);
    icosahedronPowerUp = null;
    lastPowerUpTime = currentTime;
  }

  // Gera um novo power-up após o tempo limite
  if (
    !capsule &&
    !icosahedronPowerUp &&
    currentTime - lastPowerUpTime > powerUpCooldown
  ) {
    const randomPowerUp = Math.random() > 0.5 ? "capsule" : "icosahedron"; // Escolhe um power-up aleatório

    if (randomPowerUp === "capsule") {
      capsule = createCapsule(scene);
      currentPowerUp = "capsule";
    } else {
      icosahedronPowerUp = createIcosahedronPowerUp(scene);
      currentPowerUp = "icosahedron";
    }
    lastPowerUpTime = currentTime;
  }

  // Rotaciona o power-up atual para animá-lo
  if (currentPowerUp === "capsule") {
    rotateCapsule();
  } else if (currentPowerUp === "icosahedron") {
    rotateIcosahedronPowerUp();
  }
}

export { updatePowerUpSystem };
