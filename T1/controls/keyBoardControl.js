import * as THREE from "three";

import KeyboardState from "../../libs/util/KeyboardState.js";
import { moveDistance, rotateAngle } from "../constants/constants.js";
import { Ball } from "../components/createBall.js";

// Instância do KeyboardState
var keyboard = new KeyboardState();

// Gerenciador de bolas
var ballsTank1 = [];
var ballsTank2 = [];

// Controles de temporização para atirar
var lastShotTimeTank1 = 0;
var lastShotTimeTank2 = 0;
const shotCoolDown = 500;

function keyboardUpdateTank1(tank1, bbTank1, tankInimigo, bbTankInimigo) {
  keyboard.update();

  tank1.object.previousPosition = tank1.object.position.clone();

  if (keyboard.pressed("W")) tank1.object.translateX(moveDistance);
  if (keyboard.pressed("S")) tank1.object.translateX(-moveDistance);
  if (keyboard.pressed("A")) tank1.object.rotateY(rotateAngle);
  if (keyboard.pressed("D")) tank1.object.rotateY(-rotateAngle);

  bbTank1.setFromObject(tank1.object);

  if ((keyboard.pressed("space") || keyboard.pressed("Q")) && Date.now() - lastShotTimeTank1 >= shotCoolDown) {
    lastShotTimeTank1 = Date.now();
    // let direction = new THREE.Vector3(0, 0, 1); // Direção frente em relação ao tanque
    // direction.applyQuaternion(tank1.object.quaternion); // Aplica a rotação do tanque ao vetor
    const direction = new THREE.Vector3();
    tank1.object.getWorldDirection(direction);

    // codigo para arrumar e rotacionar a posição da bola de acordo com a rotação que foi feita ao criar o canhão
    const axisY = new THREE.Vector3(0, 1, 0);
    direction.applyAxisAngle(axisY, Math.PI / 2);
    
    let ball = new Ball(direction, tankInimigo,  bbTankInimigo);
    // ball.object.position.copy(tank1.object.position);
    ball.object.position.set(tank1.object.position.x, 3, tank1.object.position.z);
    ball.startMoving(true);
    ballsTank1.push(ball);
  }
  ballsTank1.forEach((ball) => ball.move());
}

function keyboardUpdateTank2(tank2, bbTank2, tankInimigo, bbTankInimigo) {
  keyboard.update();

  // salvando a posição anterior do tanque para restaurar em caso de colisão
  tank2.object.previousPosition = tank2.object.position.clone();

  // movimentação do tanque
  if (keyboard.pressed("up")) tank2.object.translateX(moveDistance);
  if (keyboard.pressed("down")) tank2.object.translateX(-moveDistance);
  if (keyboard.pressed("left")) tank2.object.rotateY(rotateAngle);
  if (keyboard.pressed("right")) tank2.object.rotateY(-rotateAngle);

  bbTank2.setFromObject(tank2.object);

  // Verifica o tempo para permitir atirar novamente
  if ((keyboard.pressed(",") || keyboard.pressed("/")) && Date.now() - lastShotTimeTank2 >= shotCoolDown) {
    lastShotTimeTank2 = Date.now();
    const direction = new THREE.Vector3();
    tank2.object.getWorldDirection(direction);

    // codigo para arrumar e rotacionar a posição da bola de acordo com a rotação que foi feita ao criar o canhão
    const axisY = new THREE.Vector3(0, 1, 0);
    direction.applyAxisAngle(axisY, Math.PI / 2);
    
    let ball = new Ball(direction, tankInimigo , bbTankInimigo);
    // ball.object.position.copy(tank2.object.position);
    ball.object.position.set(tank2.object.position.x, 3, tank2.object.position.z);
    ball.startMoving(true);
    ballsTank2.push(ball);
  }
  ballsTank2.forEach((ball) => ball.move());
}

export { keyboardUpdateTank1, keyboardUpdateTank2 };
