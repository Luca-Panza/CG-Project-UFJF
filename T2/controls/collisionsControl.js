import * as THREE from "three";

// Função que verifica colisões entre dois tanques
function checkCollisionsTankTank(tank1, bbTank1, tank2, bbTank2) {
  let collision = bbTank1.intersectsBox(bbTank2); // Verifica se houve colisão
  if (collision) {
    // Em caso de colisão, restaura a posição antiga
    tank1.position.copy(tank1.previousPosition); // Restaura a posição do tanque 1
    bbTank1.setFromObject(tank1); // Atualiza o bounding box do tanque 1
    tank2.position.copy(tank2.previousPosition); // Restaura a posição do tanque 2
    bbTank2.setFromObject(tank2); // Atualiza o bounding box do tanque 2
  }
}

// Função que verifica colisões entre tanques e paredes
function checkCollisionsTankWall(tank, bbTank, bbWalls) {
  for (let i = 0; i < bbWalls.length; i++) {
    const bbWall = bbWalls[i]; // Bounding box da parede atual
    if (bbWall.intersectsBox(bbTank)) {
      const normal = bbWall.normal; // Normal da parede com a qual houve colisão
      const moveDirection = new THREE.Vector3().subVectors(tank.position, tank.previousPosition);
      const adjustment = moveDirection.projectOnPlane(normal); // Projetar o vetor de movimento na direção perpendicular à normal

      tank.position.copy(tank.previousPosition).add(adjustment); // Ajustar a posição com base na projeção
      bbTank.setFromObject(tank); // Atualiza o bounding box do tanque
    }
  }
}

function checkCollisions(index, tank1, bbTank1, tank2, bbTank2, tank3, bbTank3, bbWalls) {
  if (index === 0) {
    // Verificar colisões entre tanque 1 e tanque 2
    checkCollisionsTankTank(tank1, bbTank1, tank2, bbTank2);
    
    // Verificar colisões entre tanque 1 e as paredes
    checkCollisionsTankWall(tank1, bbTank1, bbWalls);
    
    // Verificar colisões entre tanque 2 e as paredes
    checkCollisionsTankWall(tank2, bbTank2, bbWalls);
  } else if (index === 1) {
    // Verificar colisões entre tanque 1, tanque 2 e tanque 3
    checkCollisionsTankTank(tank1, bbTank1, tank2, bbTank2);
    checkCollisionsTankTank(tank1, bbTank1, tank3, bbTank3);
    checkCollisionsTankTank(tank2, bbTank2, tank3, bbTank3);

    // Verificar colisões entre tanque 1, tanque 2 e tanque 3 com as paredes
    checkCollisionsTankWall(tank1, bbTank1, bbWalls);
    checkCollisionsTankWall(tank2, bbTank2, bbWalls);
    checkCollisionsTankWall(tank3, bbTank3, bbWalls);
  }
}

export { checkCollisions };
