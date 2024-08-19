import * as THREE from "three";
import KeyboardState from "../../libs/util/KeyboardState.js";
import { moveDistance, rotateAngle } from "../constants/constants.js";
import { Ball } from "../components/createBall.js";

// Instância do KeyboardState
const keyboard = new KeyboardState();

// Gerenciador de bolas
const ballsTank1 = [];

function keyboardUpdateTank1(
  index,
  tank1,
  bbTank1,
  tankInimigo2,
  bbTankInimigo2,
  tankInimigo3,
  bbTankInimigo3
) {
  keyboard.update();
  tank1.object.previousPosition = tank1.object.position.clone();

  if (keyboard.pressed("W")) tank1.object.translateZ(moveDistance);
  if (keyboard.pressed("S")) tank1.object.translateZ(-moveDistance);
  if (keyboard.pressed("A")) tank1.object.rotateY(rotateAngle);
  if (keyboard.pressed("D")) tank1.object.rotateY(-rotateAngle);
  if (keyboard.pressed("up")) tank1.object.translateZ(moveDistance);
  if (keyboard.pressed("down")) tank1.object.translateZ(-moveDistance);
  if (keyboard.pressed("left")) tank1.object.rotateY(rotateAngle);
  if (keyboard.pressed("right")) tank1.object.rotateY(-rotateAngle);

  bbTank1.setFromObject(tank1.object);

  if (keyboard.down("space")) {
    const direction = new THREE.Vector3();
    tank1.object.getWorldDirection(direction);

    // Ajuste para a direção do tiro baseado na rotação do tanque
    const axisY = new THREE.Vector3(0, 0, 0);
    direction.applyAxisAngle(axisY, Math.PI / 2);

    // Escolher o inimigo com base no valor de index
    let targetTank, targetBoundingBox;
    if (index === 0) {
      targetTank = tankInimigo2;
      targetBoundingBox = bbTankInimigo2;
    } else if (index === 1) {
      // Adicionar lógica para considerar todos os inimigos
      targetTank = [tankInimigo2, tankInimigo3];
      targetBoundingBox = [bbTankInimigo2, bbTankInimigo3];
    }

    if (Array.isArray(targetTank)) {
      // Se houver vários inimigos, dispare para cada um
      targetTank.forEach((tank, idx) => {
        const bb = targetBoundingBox[idx];
        const ball = new Ball(direction, tank, bb);
        ball.object.position.set(
          tank1.object.position.x,
          3,
          tank1.object.position.z
        );
        ball.startMoving(true);
        ballsTank1.push(ball);
      });
    } else {
      // Apenas um inimigo
      const ball = new Ball(direction, targetTank, targetBoundingBox);
      ball.object.position.set(
        tank1.object.position.x,
        3,
        tank1.object.position.z
      );
      ball.startMoving(true);
      ballsTank1.push(ball);
    }
  }

  ballsTank1.forEach((ball) => ball.move());
}

export { keyboardUpdateTank1 };
