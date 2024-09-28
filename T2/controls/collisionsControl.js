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
      const moveDirection = new THREE.Vector3().subVectors(
        tank.position,
        tank.previousPosition
      );
      const adjustment = moveDirection.projectOnPlane(normal); // Projetar o vetor de movimento na direção perpendicular à normal

      tank.position.copy(tank.previousPosition).add(adjustment); // Ajustar a posição com base na projeção
      bbTank.setFromObject(tank); // Atualiza o bounding box do tanque
    }
  }
}

// Função que verifica colisões entre tanques e paredes móveis
function checkCollisionsTankMovingWall(
  tank,
  bbTank,
  movingWalls,
  bbMovingWalls
) {
  for (let i = 0; i < movingWalls.length; i++) {
    const movingWall = movingWalls[i]; // Parede móvel atual
    const bbMovingWall = bbMovingWalls[i]; // Bounding box da parede móvel atual

    if (bbMovingWall.intersectsBox(bbTank)) {
      const moveDirection = new THREE.Vector3().subVectors(
        tank.position,
        tank.previousPosition
      );

      // Se a parede móvel tiver uma normal definida, podemos ajustar a posição como nas paredes estáticas
      if (movingWall.normal) {
        const adjustment = moveDirection.projectOnPlane(movingWall.normal); // Projeta o movimento na direção perpendicular à normal
        tank.position.copy(tank.previousPosition).add(adjustment); // Ajusta a posição com base na projeção
      } else {
        // Se não houver normal, apenas restauramos a posição anterior
        tank.position.copy(tank.previousPosition); // Restaura a posição do tanque
      }

      bbTank.setFromObject(tank); // Atualiza o bounding box do tanque
    }
  }
}

function checkCollisions(
  index,
  tank1,
  bbTank1,
  tank2,
  bbTank2,
  tank3,
  bbTank3,
  tank4,
  bbTank4,
  bbWalls,
  movingWalls,
  bbMovingWalls
) {
  if (index === 0) {
    // Verificar colisões entre tanque 1 e tanque 2
    checkCollisionsTankTank(tank1, bbTank1, tank2, bbTank2);

    // Verificar colisões entre tanque 1 e as paredes
    checkCollisionsTankWall(tank1, bbTank1, bbWalls);

    // Verificar colisões entre tanque 2 e as paredes
    checkCollisionsTankWall(tank2, bbTank2, bbWalls);
  } else if (index === 1) {
    // Verificar colisões entre tanque 1, tanque 2 e tanque 3
    if (tank2.visible == true)
      checkCollisionsTankTank(tank1, bbTank1, tank2, bbTank2);

    if (tank3.visible == true)
      checkCollisionsTankTank(tank1, bbTank1, tank3, bbTank3);

    if (tank2.visible == true && tank3.visible == true)
      checkCollisionsTankTank(tank2, bbTank2, tank3, bbTank3);

    // Verificar colisões entre tanque 1, tanque 2 e tanque 3 com as paredes
    checkCollisionsTankWall(tank1, bbTank1, bbWalls);
    if (tank2.visible == true) checkCollisionsTankWall(tank2, bbTank2, bbWalls);
    if (tank3.visible == true) checkCollisionsTankWall(tank3, bbTank3, bbWalls);
  } else if (index === 2) {
    // Verificar colisões entre tanque 1, tanque 2, tanque 3 e tanque 4
    if (tank2.visible) checkCollisionsTankTank(tank1, bbTank1, tank2, bbTank2);
    if (tank3.visible) checkCollisionsTankTank(tank1, bbTank1, tank3, bbTank3);
    if (tank4.visible) checkCollisionsTankTank(tank1, bbTank1, tank4, bbTank4);

    if (tank2.visible && tank3.visible)
      checkCollisionsTankTank(tank2, bbTank2, tank3, bbTank3);
    if (tank2.visible && tank4.visible)
      checkCollisionsTankTank(tank2, bbTank2, tank4, bbTank4);
    if (tank3.visible && tank4.visible)
      checkCollisionsTankTank(tank3, bbTank3, tank4, bbTank4);

    // Verificar colisões entre tanques e paredes
    checkCollisionsTankWall(tank1, bbTank1, bbWalls);
    checkCollisionsTankMovingWall(tank1, bbTank1, movingWalls, bbMovingWalls);

    if (tank2.visible) {
      checkCollisionsTankWall(tank2, bbTank2, bbWalls);
      checkCollisionsTankMovingWall(tank2, bbTank2, movingWalls, bbMovingWalls);
    }

    if (tank3.visible) {
      checkCollisionsTankWall(tank3, bbTank3, bbWalls);
      checkCollisionsTankMovingWall(tank3, bbTank3, movingWalls, bbMovingWalls);
    }

    if (tank4.visible) {
      checkCollisionsTankWall(tank4, bbTank4, bbWalls);
      checkCollisionsTankMovingWall(tank4, bbTank4, movingWalls, bbMovingWalls);
    }
  }
}

export { checkCollisions };
