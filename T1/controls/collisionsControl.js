// Função que verifica colisões entre tanques
function checkCollisionsTankTank(tank1, bbTank1, tank2, bbTank2) {
  let collision = bbTank1.intersectsBox(bbTank2); // Verifica se houve colisão
  if (collision) {
    // Em caso de colisão restaura a posição antiga
    tank1.position.copy(tank1.previousPosition); // Restaura a posição do tanque 1
    bbTank1.setFromObject(tank1); // Atualiza o bounding box do tanque 1
    tank2.position.copy(tank2.previousPosition); // Restaura a posição do tanque 2
    bbTank2.setFromObject(tank2); // Atualiza o bounding box do tanque 2
  }
}

// Função que verifica colisões entre tanque e paredes
function checkCollisionsTankWall(tank, bbTank, bbWalls) {
  for (let i = 0; i < bbWalls.length; i++) {
    // Itera sobre todas as bounding boxes das paredes
    const bbWall = bbWalls[i]; // Bounding box da parede atual
    let collision = bbWall.intersectsBox(bbTank); // Verifica se houve colisão
    if (collision) {
      tank.position.copy(tank.previousPosition); // Restaura a posição do tanque
      bbTank.setFromObject(tank); // Atualiza o bounding box do tanque
    }
  }
}

function checkCollisions(tank1, bbTank1, tank2, bbTank2, bbWalls) {
  checkCollisionsTankTank(tank1, bbTank1, tank2, bbTank2);
  checkCollisionsTankWall(tank1, bbTank1, bbWalls);
  checkCollisionsTankWall(tank2, bbTank2, bbWalls);
}

export { checkCollisions };
