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

function clearAllPowerUps(scene) {
  // Remove a cápsula, se existir
  if (capsule) {
    removeCapsule(scene);
    capsule = null;
  }

  // Remove o icosaedro, se existir
  if (icosahedronPowerUp) {
    removeIcosahedronPowerUp(scene);
    icosahedronPowerUp = null;
  }

  // Zera a referência ao power-up atual
  currentPowerUp = null;
  console.log("Power-ups removidos e reinicializados");
}

function updatePowerUpSystem(scene, tank, bbTank, index) {
  const currentTime = Date.now();

  // Verifica colisão com o power-up atual
  if (currentPowerUp === "capsule" && checkPowerUpCollision(bbTank)) {
    tank.vida = tank.vida * 1.2;
    if (tank.vida > 10) {
      tank.vida = 10;
    }
    removeCapsule(scene);
    capsule = null;
    lastPowerUpTime = currentTime;
  } else if (
    currentPowerUp === "icosahedron" &&
    checkIcosahedronPowerUpCollision(bbTank)
  ) {
    tank.danoTiro = 2;
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
    // retorna com o dano = 1 depois de 10 segundos
    tank.danoTiro = 1;
    const randomPowerUp = Math.random() > 0.5 ? "capsule" : "icosahedron"; // Escolhe um power-up aleatório

    if (randomPowerUp === "capsule") {
      capsule = createCapsule(scene, index); // Passa o nível atual
      currentPowerUp = "capsule";
    } else {
      icosahedronPowerUp = createIcosahedronPowerUp(scene, index); // Passa o nível atual
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

export { updatePowerUpSystem, clearAllPowerUps };
