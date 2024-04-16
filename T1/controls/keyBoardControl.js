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

function keyboardUpdateTank1(tank1, bbTank1) {
  keyboard.update();

  tank1.previousPosition = tank1.position.clone();

  if (keyboard.pressed("W")) tank1.translateX(moveDistance);
  if (keyboard.pressed("S")) tank1.translateX(-moveDistance);
  if (keyboard.pressed("A")) tank1.rotateY(rotateAngle);
  if (keyboard.pressed("D")) tank1.rotateY(-rotateAngle);

  bbTank1.setFromObject(tank1);

  if ((keyboard.pressed("space") || keyboard.pressed("Q")) && Date.now() - lastShotTimeTank1 >= shotCoolDown) {
    lastShotTimeTank1 = Date.now();
    let direction = new THREE.Vector3(0, 0, 1); // Direção frente em relação ao tanque
    direction.applyQuaternion(tank1.quaternion); // Aplica a rotação do tanque ao vetor
    let ball = new Ball(direction);
    ball.object.position.copy(tank1.position);
    ball.startMoving(true);
    ballsTank1.push(ball);
  }
  ballsTank1.forEach((ball) => ball.move());
}

function keyboardUpdateTank2(tank2, bbTank2) {
  keyboard.update();

  // salvando a posição anterior do tanque para restaurar em caso de colisão
  tank2.previousPosition = tank2.position.clone();

  // movimentação do tanque
  if (keyboard.pressed("up")) tank2.translateX(moveDistance);
  if (keyboard.pressed("down")) tank2.translateX(-moveDistance);
  if (keyboard.pressed("left")) tank2.rotateY(rotateAngle);
  if (keyboard.pressed("right")) tank2.rotateY(-rotateAngle);

  bbTank2.setFromObject(tank2);

  // Verifica o tempo para permitir atirar novamente
  if ((keyboard.pressed(",") || keyboard.pressed("/")) && Date.now() - lastShotTimeTank2 >= shotCoolDown) {
    lastShotTimeTank2 = Date.now();
    let direction = new THREE.Vector3(0, 0, 1); // Direção frente em relação ao tanque
    direction.applyQuaternion(tank2.quaternion); // Aplica a rotação do tanque ao vetor
    let ball = new Ball(direction);
    ball.object.position.copy(tank2.position);
    ball.startMoving(true);
    ballsTank2.push(ball);
  }
}

export { keyboardUpdateTank1, keyboardUpdateTank2 };
