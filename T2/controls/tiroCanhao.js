import * as THREE from "three";
import { Ball } from "../components/createBall.js";

// Gerenciador de bolas
const ballsCannon = [];

let lastShootTime = 0;
const shootInterval = 3000; // Intervalo de tempo em milissegundos (3 segundos)

function shoot(canhao, targetTank, targetBoundingBox, index) {
  // Ajuste as variáveis abaixo conforme necessário
  const direction = new THREE.Vector3(1, 0, 0); // Direção do disparo
  //   const direction = new THREE.Vector3();
  //   canhao.getWorldDirection(direction);

  if (!direction || !targetTank || !targetBoundingBox) {
    console.error("Variáveis necessárias não estão definidas");
    return;
  }

  const ball = new Ball(direction, targetTank, targetBoundingBox, index);
  ball.object.position.set(0, 3, 0); // Ajuste a posição inicial da bola
  ball.startMoving(true); // Inicia o movimento da bola
  ballsCannon.push(ball);
}

function shootCannon(canhao, targetTank, targetBoundingBox, index) {
  // Dispara o canhão a cada 3 segundos
  const currentTime = performance.now();
  if (currentTime - lastShootTime >= shootInterval) {
    shoot(canhao, targetTank, targetBoundingBox);
    lastShootTime = currentTime; // Atualizar o tempo do último disparo
  }
  //   if (Date.now() % 3000 < 50) {
  //     // Aproximação simples para intervalo
  //     shoot(canhao, targetTank, targetBoundingBox);
  //   }
  // Mover as bolas disparadas
  ballsCannon.forEach((ball) => ball.move());
}
export { shootCannon };
