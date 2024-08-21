import * as THREE from "three";
import { Ball } from "../components/createBall.js";

// Gerenciador de bolas
const ballsTank = [];

// Variável para armazenar o tempo do último disparo
let lastShootTime = 0;
const shootInterval = 2000; // Intervalo de tempo em milissegundos (2 segundos)

// Função de disparo
function shoot(
  tank,
  index,
  tankUsuario,
  bbTankUsuario,
  tankInimigo2,
  bbtankInimigo2
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
    targetBoundingBox = [bbTankUsuario, bbtankInimigo2];
  }

  const ball = new Ball(direction, targetTank, targetBoundingBox, index);
  ball.object.position.set(tank.object.position.x, 3, tank.object.position.z);
  ball.startMoving(true);
  ballsTank.push(ball);
}

// Função de comportamento do tanque inimigo
function enemyTankBehavior(
  index,
  tank,
  bbTank,
  tankUsuario,
  bbTankUsuario,
  tankInimigo2 = null,
  bbtankInimigo2 = null
) {
  const speed = 0.1;
  const backwardSpeed = speed; // Velocidade de movimentação para trás
  const safeDistance = 20; // Distância mínima segura entre tanques
  const distance = tank.object.position.distanceTo(tankUsuario.object.position);

  if (distance > safeDistance) {
    // Se a distância for maior que a distância segura, perseguir o usuário
    tank.object.lookAt(tankUsuario.object.position);
    tank.object.previousPosition = tank.object.position.clone();
    tank.object.translateZ(speed);
  } else if (distance == safeDistance) {
    // Se a distância for exatamente a distância segura, apenas olhar para o usuário
    // tank.object.lookAt(tankUsuario.object.position);
  } else {
    // Se a distância for menor que a distância segura, fugir do usuário
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
  const currentTime = performance.now();
  if (currentTime - lastShootTime >= shootInterval) {
    shoot(
      tank,
      index,
      tankUsuario,
      bbTankUsuario,
      tankInimigo2,
      bbtankInimigo2
    );
    lastShootTime = currentTime; // Atualizar o tempo do último disparo
  }

  // Mover as bolas disparadas
  ballsTank.forEach((ball) => ball.move());
}

export { enemyTankBehavior };
