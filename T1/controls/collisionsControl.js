function checkCollisionsTankTank(tank1, bbTank1, tank2, bbTank2) {
  let collision = bbTank1.intersectsBox(bbTank2);
  if (collision) {
    // em caso de colisão restaura a posição antiga
    tank1.position.copy(tank1.previousPosition);
    //atualiza os limites
    bbTank1.setFromObject(tank1);
    // em caso de colisão restaura a posição antiga
    tank2.position.copy(tank2.previousPosition);
    //atualiza os limites
    bbTank2.setFromObject(tank2);
  }
}

function checkCollisionsTankWall(tank, bbTank, bbWalls) {
  for (let i = 0; i < bbWalls.length; i++) {
    const bbWall = bbWalls[i]; // Access the current bounding box object
    let collision = bbWall.intersectsBox(bbTank);
    if (collision) {
      // em caso de colisão restaura a posição antiga
      tank.position.copy(tank.previousPosition);
      //atualiza os limites
      bbTank.setFromObject(tank);
    }
  }
}

function checkCollisions(tank1, bbTank1, tank2, bbTank2, bbWalls) {
  checkCollisionsTankTank(tank1, bbTank1, tank2, bbTank2);
  checkCollisionsTankWall(tank1, bbTank1, bbWalls);
  checkCollisionsTankWall(tank2, bbTank2, bbWalls);
}
export { checkCollisions };
