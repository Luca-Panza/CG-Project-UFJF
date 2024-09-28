import * as THREE from "three";
import { Ball } from "../components/createBall.js";
import { toggleMute } from "../components/createSound.js";

// Gerenciador de bolas
const ballsTank1 = [];

let fwdValue = 0;
let bkdValue = 0;
let rgtValue = 0;
let lftValue = 0;

export function addJoysticks(scene) {
  if (scene.plataforma == "pc") return;

  document.getElementById("buttons_mobile").style.display = "block";
  moverJoystick();
  configurarBotaoDeTiro(scene);
  configurarBotaoDeSom(scene);
}

function moverJoystick() {
  let joystickL = nipplejs.create({
    zone: document.getElementById("joystickWrapper1"),
    mode: "static",
    position: { top: "-80px", left: "80px" },
  });

  joystickL.on("move", function (evt, data) {
    const forward = data.vector.y;
    const turn = data.vector.x;
    fwdValue = bkdValue = lftValue = rgtValue = 0;
    if (forward > 0) fwdValue = Math.abs(forward);
    else if (forward < 0) bkdValue = Math.abs(forward);

    if (turn > 0) rgtValue = Math.abs(turn);
    else if (turn < 0) lftValue = Math.abs(turn);
  });

  joystickL.on("end", function (evt) {
    bkdValue = 0;
    fwdValue = 0;
    lftValue = 0;
    rgtValue = 0;
  });
}

export function moveTank(tank1, bbTank1) {
  // Define a velocidade de rotação e movimentação
  const rotationSpeed = 0.1; // Velocidade de rotação
  const movementSpeed = 0.15; // Velocidade de movimentação

  // Armazena a posição anterior do tanque
  tank1.object.previousPosition = tank1.object.position.clone();

  // Calcula a direção apontada pelo joystick
  const joystickDirection = new THREE.Vector2(
    rgtValue - lftValue,
    bkdValue - fwdValue
  );

  // Se o joystick não estiver neutro
  if (joystickDirection.length() > 0) {
    // Normaliza o vetor da direção do joystick
    joystickDirection.normalize();

    // Calcula o ângulo atual do tanque (em radianos)
    const tankDirection = new THREE.Vector3(0, 0, 1).applyQuaternion(
      tank1.object.quaternion
    ); // Vetor de direção do tanque
    const tankAngle = Math.atan2(tankDirection.x, tankDirection.z); // Ângulo atual do tanque no plano XZ

    // Calcula o ângulo desejado (em radianos) com base na direção do joystick
    const targetAngle = Math.atan2(joystickDirection.x, joystickDirection.y); // Ângulo desejado do joystick no plano XZ

    // Calcula a diferença de ângulo entre a direção atual e a desejada
    let angleDifference = targetAngle - tankAngle;

    // Normaliza a diferença de ângulo para garantir que ela esteja entre -PI e PI (giro mais curto)
    if (angleDifference > Math.PI) angleDifference -= 2 * Math.PI;
    if (angleDifference < -Math.PI) angleDifference += 2 * Math.PI;

    // Gira o tanque na direção mais curta (direita ou esquerda)
    if (Math.abs(angleDifference) > rotationSpeed) {
      // Gira na direção certa
      if (angleDifference > 0) {
        tank1.object.rotateY(rotationSpeed);
      } else {
        tank1.object.rotateY(-rotationSpeed);
      }
    }

    // Aplica a movimentação na direção em que o tanque está apontado
    tank1.object.translateZ(movementSpeed);
  }

  // Atualiza o bounding box do tanque
  bbTank1.setFromObject(tank1.object);

  ballsTank1.forEach((ball) => ball.move());
}

function configurarBotaoDeSom(scene) {
  const muteButton = document.getElementById("A");
  muteButton.addEventListener("touchstart", function () {
    // Inverte o valor da variável isMuted e chama a função de toggle
    scene.isMuted = !scene.isMuted;
    toggleMute(scene.isMuted);
  });
}

function configurarBotaoDeTiro(scene) {
  const shootButton = document.getElementById("shoot-button");
  shootButton.addEventListener("touchstart", function () {
    // Implementa o tiro ao pressionar o botão
    realizarDisparo(scene); // Aqui referenciamos o tanque 1, que é o do jogador
  });
}

function realizarDisparo(scene) {
  const direction = new THREE.Vector3();
  scene.tank1.object.getWorldDirection(direction);

  // Posição do tiro saindo da boca do canhão
  const offset = new THREE.Vector3(0, 1.5, 4); // Ajuste o offset conforme a posição da boca do canhão

  // Transformar a posição do offset para o sistema de coordenadas global
  const cannonPosition = scene.tank1.object.localToWorld(offset.clone());

  // Cria e dispara a bola a partir da boca do canhão
  const ball = new Ball(
    direction,
    scene.targetTank,
    scene.targetBoundingBox,
    scene.index,
    scene.tank1
  );

  // Definir a posição inicial do tiro na boca do canhão
  ball.object.position.set(
    cannonPosition.x,
    cannonPosition.y,
    cannonPosition.z
  );

  // Iniciar o movimento da bola
  ball.startMoving(true);

  ballsTank1.push(ball);
}
