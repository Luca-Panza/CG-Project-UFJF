import KeyboardState from "../../libs/util/KeyboardState.js";

// Instância do KeyboardState
var keyboard = new KeyboardState();

function keyboardUpdateTank1(tank1) {
  keyboard.update();
  var moveDistance = 0.25;
  var rotateAngle = (Math.PI / 2) * 0.02;

  if (keyboard.pressed("up")) tank1.translateX(moveDistance);
  if (keyboard.pressed("down")) tank1.translateX(-moveDistance);
  if (keyboard.pressed("left")) tank1.rotateY(rotateAngle);
  if (keyboard.pressed("right")) tank1.rotateY(-rotateAngle);
}

function keyboardUpdateTank2(tank2) {
  keyboard.update();
  var moveDistance = 0.25;
  var rotateAngle = (Math.PI / 2) * 0.02;

  if (keyboard.pressed("W")) tank2.translateX(moveDistance);
  if (keyboard.pressed("S")) tank2.translateX(-moveDistance);
  if (keyboard.pressed("A")) tank2.rotateY(rotateAngle);
  if (keyboard.pressed("D")) tank2.rotateY(-rotateAngle);
}

export { keyboardUpdateTank1, keyboardUpdateTank2 };
