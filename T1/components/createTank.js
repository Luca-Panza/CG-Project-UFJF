import * as THREE from "three";

// Classe que representa um tanque
export class Tank {
  constructor(bodyColor, position) {
    this.bodyColor = bodyColor;
    this.position = position;
    this.object = this.createTank(this.bodyColor, this.position);
    this.dano = 0;
    // this.bbBall = new THREE.Box3();
    // this.bbBall.setFromObject(this.object);
    // this.object.previousPosition = this.object.position.clone();
    // this.collisionCount = 0; // Contador de colisões
    // //this.bbHelper1 = new THREE.Box3Helper(this.bbBall, "white");
    // this.tanqueInimigo = tanqueInimigo;
    // this.bbTankInimigo = bbTankInimigo;
    // scene.add(this.bbHelper1);
    // scene.add(this.object);
  }

  setPosition(position) {
    this.position = position;
  }

  // Função para adicionar um pneu ao tanque
  addTire(tank, posX, posY, posZ) {
    // Geometria e material para o pneu/roda externa
    const tireOuterGeometry = new THREE.TorusGeometry(0.45, 0.35, 30, 200);
    const tireOuterMaterial = new THREE.MeshPhongMaterial({ color: 0x111111 });
    const tireOuter = new THREE.Mesh(tireOuterGeometry, tireOuterMaterial);
    tireOuter.position.set(posX, posY, posZ);
    tank.add(tireOuter);

    // Geometria e material para o pneu/roda interna
    const tireInnerGeometry = new THREE.CylinderGeometry(0.45, 0.45, 0.35, 32);
    const tireInnerMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
    const tireInner = new THREE.Mesh(tireInnerGeometry, tireInnerMaterial);
    tireInner.position.set(posX, posY, posZ);
    tireInner.rotateX(Math.PI / 2);

    tank.add(tireInner);
  }

  // Função para criar um tanque
  createTank(bodyColor, position) {
    const tankMaterial = new THREE.MeshPhongMaterial({ color: bodyColor });
    const tank = new THREE.Group();

    // Corpo do tanque
    const bodyGeometry = new THREE.BoxGeometry(3.25, 1.5, 2.5);
    const body = new THREE.Mesh(bodyGeometry, tankMaterial);
    body.position.set(0.0, 1.4, 0.0);
    tank.add(body);

    // Rodas
    this.addTire(tank, 0.9, 0.7, 1.2); // Roda dianteira direita
    this.addTire(tank, -0.9, 0.7, 1.2); // Roda dianteira esquerda
    this.addTire(tank, -0.9, 0.7, -1.2); // Roda traseira esquerda
    this.addTire(tank, 0.9, 0.7, -1.2); // Roda traseira direita

    // Parte superior do corpo
    const upperBodyGeometry = new THREE.BoxGeometry(2.8, 0.5, 2.2);
    const upperBody = new THREE.Mesh(upperBodyGeometry, tankMaterial);
    upperBody.position.set(0.0, 1.0, 0.0);
    body.add(upperBody);

    // Cúpula
    const domeGeometry = new THREE.SphereGeometry(1, 20, 20);
    const dome = new THREE.Mesh(domeGeometry, tankMaterial);
    dome.position.set(0.0, 1.5, 0);
    body.add(dome);

    // Canhão
    const cannonGeometry = new THREE.CylinderGeometry(0.25, 0.25, 2);
    const cannonMaterial = new THREE.MeshBasicMaterial({ color: 0x505050 });
    this.cannon = new THREE.Mesh(cannonGeometry, cannonMaterial);
    this.cannon.position.set(1.5, 3, 0.0);
    this.cannon.rotateZ(Math.PI / 2); // Rotação para que o canhão fique na vertical
    tank.add(this.cannon);

    // Ponta do canhão
    const cannonTipGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.75);
    const cannonTipMaterial = new THREE.MeshBasicMaterial({ color: "gray" });
    const cannonTip = new THREE.Mesh(cannonTipGeometry, cannonTipMaterial);
    // Posição da ponta do canhão
    cannonTip.position.set(2.75, 3, 0.0);
    cannonTip.rotateZ(Math.PI / 2); // Rotação para que a ponta do canhão fique na vertical
    tank.add(cannonTip);

    // Posicionando o tanque na cena
    tank.rotation.y = Math.PI / 2;
    tank.position.copy(position);

    return tank;
  }
}
