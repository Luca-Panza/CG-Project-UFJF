import * as THREE from "three";
import { Ball } from "../components/createBall.js";

// Gerenciador de bolas
const ballsCannon = [];

let lastShootTime = 0;
const shootInterval = 3000; // Intervalo de tempo em milissegundos (3 segundos)

function shoot(canhao, targetTank, targetBoundingBox, index) {
  // Direção do disparo baseada na orientação do canhão
  const direction = new THREE.Vector3(0, 0, -1); // O eixo Z negativo geralmente representa a direção "para frente"

  // Transforma a direção local do canhão em direção global
  direction.applyQuaternion(canhao.quaternion);
  direction.normalize(); // Normaliza a direção

  if (!targetTank || !targetBoundingBox) {
    console.error("Variáveis necessárias não estão definidas");
    return;
  }

  // Criação da bola
  const ball = new Ball(direction, targetTank, targetBoundingBox, index);

  // Ajuste a posição inicial da bola para sair da boca do canhão
  ball.object.position.copy(canhao.position);
  ball.object.position.y += 1; // Eleva a posição inicial da bola um pouco acima da posição do canhão

  ball.startMoving(true); // Inicia o movimento da bola
  ballsCannon.push(ball);
}

function shootCannon(canhao, targetTank, targetBoundingBox, index) {
  // Dispara o canhão a cada 3 segundos
  const currentTime = performance.now();
  if (currentTime - lastShootTime >= shootInterval) {
    shoot(canhao, targetTank, targetBoundingBox, index);
    lastShootTime = currentTime; // Atualiza o tempo do último disparo
  }

  // Mover as bolas disparadas
  ballsCannon.forEach((ball) => ball.move());
}

export { shootCannon };
