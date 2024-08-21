import * as THREE from "three";

function enemyTankBehavior(
  index,
  tank,
  bbTank,
  tankUsuario,
  bbTankUsuario,
  bbWalls
) {
  const speed = 0.1;
  const backwardSpeed = speed; // Velocidade de movimentação para trás
  const safeDistance = 20; // Distância mínima segura entre tanques
  const distance = tank.object.position.distanceTo(tankUsuario.object.position);

  if (distance > safeDistance) {
    // Se a distância for maior que a distância segura, perseguir o usuário
    tank.object.lookAt(tankUsuario.object.position);
    tank.object.previousPosition = tank.object.position.clone();
    tank.object.translateZ(speed);
  } else if (distance == safeDistance) {
    // Se a distância for exatamente a distância segura, apenas olhar para o usuário
    tank.object.lookAt(tankUsuario.object.position);
  } else {
    // Se a distância for menor que a distância segura, fugir do usuário
    const direction = new THREE.Vector3();
    direction
      .subVectors(tank.object.position, tankUsuario.object.position)
      .normalize();
    tank.object.lookAt(
      tankUsuario.object.position.clone().add(direction.multiplyScalar(-1))
    );
    tank.object.previousPosition = tank.object.position.clone();
    tank.object.translateZ(-backwardSpeed); // Mover para trás
  }

  // Atualizar o bounding box após mover o tanque
  bbTank.setFromObject(tank.object);

  // comentando essa lógica porque não funcionou e ficou com muitos bugs da colisão com a parede
  // Verificar colisão com as paredes
  // for (let i = 0; i < bbWalls.length; i++) {
  //   const bbWall = bbWalls[i]; // Bounding box da parede atual
  //   if (bbWall.intersectsBox(bbTank)) {
  //     tank.object.rotateY(-(Math.PI / 4)); // Rotaciona para evitar a parede
  //     bbTank.setFromObject(tank.object);
  //   }
  //   while (bbWall.intersectsBox(bbTank)) {
  //     tank.object.previousPosition = tank.object.position.clone();
  //     tank.object.translateZ(speed / 4); // Move devagar para corrigir a colisão
  //     bbTank.setFromObject(tank.object);
  //   }
  // }
}

export { enemyTankBehavior };
