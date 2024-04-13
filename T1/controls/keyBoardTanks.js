import KeyboardState from "../../libs/util/KeyboardState.js";
import { moveDistance, rotateAngle } from "../constants/constants.js";

// Instância do KeyboardState
var keyboard = new KeyboardState();

function keyboardUpdateTank1(tank1, bbTank1) {
  keyboard.update();
  
  // salvando a posição anterior do tanque para restaurar em caso de colisão
  tank1.previousPosition = tank1.position.clone();

  if (keyboard.pressed("W")) tank1.translateX(moveDistance);
  if (keyboard.pressed("S")) tank1.translateX(-moveDistance);
  if (keyboard.pressed("A")) tank1.rotateY(rotateAngle);
  if (keyboard.pressed("D")) tank1.rotateY(-rotateAngle);

  bbTank1.setFromObject(tank1);
}

function keyboardUpdateTank2(tank2, bbTank2) {
  keyboard.update();

  // salvando a posição anterior do tanque para restaurar em caso de colisão
  tank2.previousPosition = tank2.position.clone();

  if (keyboard.pressed("up")) tank2.translateX(moveDistance);
  if (keyboard.pressed("down")) tank2.translateX(-moveDistance);
  if (keyboard.pressed("left")) tank2.rotateY(rotateAngle);
  if (keyboard.pressed("right")) tank2.rotateY(-rotateAngle);

  // toda vez que anda com o tanque também tem que fazer com que o bound box ande com ele
  bbTank2.setFromObject(tank2); 
}

export { keyboardUpdateTank1, keyboardUpdateTank2 };
