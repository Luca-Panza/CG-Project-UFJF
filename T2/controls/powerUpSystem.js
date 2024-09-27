import {
  createCapsule,
  rotateCapsule,
  removeCapsule,
} from "../components/createCapsule.js";
import { checkPowerUpCollision } from "./checkPowerUpCollision.js";

let powerUpCooldown = 10000; // Tempo de 10 segundos
let lastPowerUpTime = 0;
let capsule = null;

function updatePowerUpSystem(scene, bbTank) {
  const currentTime = Date.now();

  // Verifica colisão com o power-up
  if (checkPowerUpCollision(bbTank)) {
    // Usando bounding box do tanque
    // Remove a cápsula da cena e reinicia o cooldown
    removeCapsule(scene);
    capsule = null;
    lastPowerUpTime = currentTime;
  }

  // Gera um novo power-up após o tempo limite
  if (!capsule && currentTime - lastPowerUpTime > powerUpCooldown) {
    capsule = createCapsule(scene); // Cria uma nova cápsula
    lastPowerUpTime = currentTime;
  }

  // Rotaciona a cápsula para animá-la
  rotateCapsule();
}

export { updatePowerUpSystem };
