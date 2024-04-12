import KeyboardState from "../../libs/util/KeyboardState.js";
import { moveDistance, rotateAngle } from "../constants/constants.js";

// Instância do KeyboardState
var keyboard = new KeyboardState();

function keyboardUpdateTank1(tank1) {
  keyboard.update();
  
  if (keyboard.pressed("W")) tank1.translateX(moveDistance);
  if (keyboard.pressed("S")) tank1.translateX(-moveDistance);
  if (keyboard.pressed("A")) tank1.rotateY(rotateAngle);
  if (keyboard.pressed("D")) tank1.rotateY(-rotateAngle);
}

function keyboardUpdateTank2(tank2) {
  keyboard.update();

  if (keyboard.pressed("up")) tank2.translateX(moveDistance);
  if (keyboard.pressed("down")) tank2.translateX(-moveDistance);
  if (keyboard.pressed("left")) tank2.rotateY(rotateAngle);
  if (keyboard.pressed("right")) tank2.rotateY(-rotateAngle);
}

export { keyboardUpdateTank1, keyboardUpdateTank2 };
