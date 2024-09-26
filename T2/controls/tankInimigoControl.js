import * as THREE from "three";
import { Ball } from "../components/createBall.js";

// Gerenciador de bolas
const ballsTank = [];

// Variável para armazenar o tempo do último disparo
let lastShootTime2 = 0;
let lastShootTime3 = 0;
let lastShootTime4 = 0;
const shootInterval = 2000; // Intervalo de tempo em milissegundos (2 segundos)

// Função de disparo
function shoot(
  tank,
  index,
  tankUsuario,
  bbTankUsuario,
  tankInimigo2,
  bbtankInimigo2,
  tankInimigo3,
  bbtankInimigo3
) {
  // Lógica do Tiro
  const direction = new THREE.Vector3();
  tank.object.getWorldDirection(direction);

  // Ajuste para a direção do tiro baseado na rotação do tanque
  const axisY = new THREE.Vector3(0, 0, 0);
  direction.applyAxisAngle(axisY, Math.PI / 2);

  // Escolher o inimigo com base no valor de index
  let targetTank, targetBoundingBox;
  if (index === 0) {
    targetTank = tankUsuario;
    targetBoundingBox = bbTankUsuario;
  } else if (index === 1) {
    targetTank = [tankUsuario, tankInimigo2];
    targetBoundingBox = [bbTankUsuario, bbtankInimigo2, bbtankInimigo3];
  } else if (index === 2) {
    targetTank = [tankUsuario, tankInimigo2, tankInimigo3];
    targetBoundingBox = [bbTankUsuario, bbtankInimigo2, bbtankInimigo3];
  }

  const ball = new Ball(direction, targetTank, targetBoundingBox, index);
  ball.object.position.set(tank.object.position.x, 3, tank.object.position.z);
  ball.startMoving(true);
  ballsTank.push(ball);
}

// Função de comportamento do tanque inimigo

function enemyTankBehavior(
  index,
  numTank,
  tank,
  bbTank,
  tankUsuario,
  bbTankUsuario,
  tankInimigo2 = null,
  bbtankInimigo2 = null,
  tankInimigo3 = null,
  bbtankInimigo3 = null
) {
  const speed = 0.1;
  const backwardSpeed = speed; // Velocidade de movimentação para trás
  const safeDistance = 20; // Distância mínima segura entre tanques
  const distance = tank.object.position.distanceTo(tankUsuario.object.position);
  const tolerance = 1; // Tolerância para evitar o tremor

  if (distance > safeDistance + tolerance) {
    // Se a distância for maior que a distância segura + tolerância, perseguir o usuário
    tank.object.lookAt(tankUsuario.object.position);
    tank.object.previousPosition = tank.object.position.clone();
    tank.object.translateZ(speed);
  } else if (distance < safeDistance - tolerance) {
    // Se a distância for menor que a distância segura - tolerância, fugir do usuário
    const direction = new THREE.Vector3();
    direction
      .subVectors(tank.object.position, tankUsuario.object.position)
      .normalize();
    tank.object.lookAt(
      tankUsuario.object.position.clone().add(direction.multiplyScalar(-1))
    );
    tank.object.previousPosition = tank.object.position.clone();
    tank.object.translateZ(-backwardSpeed); // Mover para trás
  }

  // Atualizar o bounding box após mover o tanque
  bbTank.setFromObject(tank.object);

  // Verificar se o tempo definido se passou desde o último disparo
  if (numTank == 2) {
    const currentTime2 = performance.now();
    if (currentTime2 - lastShootTime2 >= shootInterval) {
      shoot(
        tank,
        index,
        tankUsuario,
        bbTankUsuario,
        tankInimigo2,
        bbtankInimigo2,
        tankInimigo3,
        bbtankInimigo3
      );
      lastShootTime2 = currentTime2; // Atualizar o tempo do último disparo
    }
  } else if (numTank == 3) {
    const currentTime3 = performance.now();
    if (currentTime3 - lastShootTime3 >= shootInterval) {
      shoot(
        tank,
        index,
        tankUsuario,
        bbTankUsuario,
        tankInimigo2,
        bbtankInimigo2,
        tankInimigo3,
        bbtankInimigo3
      );
      lastShootTime3 = currentTime3; // Atualizar o tempo do último disparo
    }
  } else {
    const currentTime4 = performance.now();
    if (currentTime4 - lastShootTime4 >= shootInterval) {
      shoot(
        tank,
        index,
        tankUsuario,
        bbTankUsuario,
        tankInimigo2,
        bbtankInimigo2,
        tankInimigo3,
        bbtankInimigo3
      );
      lastShootTime4 = currentTime4; // Atualizar o tempo do último disparo
    }
  }

  // Mover as bolas disparadas
  ballsTank.forEach((ball) => ball.move());
}

export { enemyTankBehavior };
