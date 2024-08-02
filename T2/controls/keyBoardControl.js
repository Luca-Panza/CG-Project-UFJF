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

// Função para atualizar o tanque 1 com base nas teclas pressionadas
function keyboardUpdateTank1(tank1, bbTank1, tankInimigo, bbTankInimigo) {
  keyboard.update();

  // Salvando a posição anterior do tanque para restaurar em caso de colisão
  tank1.object.previousPosition = tank1.object.position.clone();

  // Movimentação do tanque
  if (keyboard.pressed("W")) tank1.object.translateX(moveDistance);
  if (keyboard.pressed("S")) tank1.object.translateX(-moveDistance);
  if (keyboard.pressed("A")) tank1.object.rotateY(rotateAngle);
  if (keyboard.pressed("D")) tank1.object.rotateY(-rotateAngle);

  // Atualizando a bounding box do tanque
  bbTank1.setFromObject(tank1.object);

  // Verifica o tempo para permitir atirar novamente com as teclas espaço ou Q
  if ((keyboard.pressed("space") || keyboard.pressed("Q")) && Date.now() - lastShotTimeTank1 >= shotCoolDown) {
    lastShotTimeTank1 = Date.now(); // Atualiza o tempo do último tiro
    const direction = new THREE.Vector3(); // Vetor para armazenar a direção do tanque
    tank1.object.getWorldDirection(direction); // Obtém a direção do tanque

    // Código para arrumar e rotacionar a posição da bola de acordo com a rotação que foi feita ao criar o canhão
    const axisY = new THREE.Vector3(0, 1, 0);
    direction.applyAxisAngle(axisY, Math.PI / 2);

    let ball = new Ball(direction, tankInimigo, bbTankInimigo); // Cria uma nova bola
    ball.object.position.set(tank1.object.position.x, 3, tank1.object.position.z); // Define a posição da bola
    ball.startMoving(true); // Inicia o movimento da bola
    ballsTank1.push(ball); // Adiciona a bola ao array de bolas
  }
  ballsTank1.forEach((ball) => ball.move()); // Move todas as bolas
}

// Função para atualizar o tanque 2 com base nas teclas pressionadas
function keyboardUpdateTank2(tank2, bbTank2, tankInimigo, bbTankInimigo) {
  keyboard.update();

  // Salvando a posição anterior do tanque para restaurar em caso de colisão
  tank2.object.previousPosition = tank2.object.position.clone();

  // Movimentação do tanque
  if (keyboard.pressed("up")) tank2.object.translateX(moveDistance);
  if (keyboard.pressed("down")) tank2.object.translateX(-moveDistance);
  if (keyboard.pressed("left")) tank2.object.rotateY(rotateAngle);
  if (keyboard.pressed("right")) tank2.object.rotateY(-rotateAngle);

  // Atualizando a bounding box do tanque
  bbTank2.setFromObject(tank2.object);

  // Verifica o tempo para permitir atirar novamente com as teclas / ou ,
  if ((keyboard.pressed(",") || keyboard.pressed("/")) && Date.now() - lastShotTimeTank2 >= shotCoolDown) {
    lastShotTimeTank2 = Date.now(); // Atualiza o tempo do último tiro
    const direction = new THREE.Vector3(); // Vetor para armazenar a direção do tanque
    tank2.object.getWorldDirection(direction); // Obtém a direção do tanque

    // Código para arrumar e rotacionar a posição da bola de acordo com a rotação que foi feita ao criar o canhão
    const axisY = new THREE.Vector3(0, 1, 0);
    direction.applyAxisAngle(axisY, Math.PI / 2);

    let ball = new Ball(direction, tankInimigo, bbTankInimigo); // Cria uma nova bola
    ball.object.position.set(tank2.object.position.x, 3, tank2.object.position.z); // Define a posição da bola
    ball.startMoving(true); // Inicia o movimento da bola
    ballsTank2.push(ball); // Adiciona a bola ao array de bolas
  }
  ballsTank2.forEach((ball) => ball.move()); // Move todas as bolas
}

export { keyboardUpdateTank1, keyboardUpdateTank2 };
