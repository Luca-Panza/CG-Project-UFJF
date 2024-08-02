import * as THREE from "three";
import { scene, bbWalls } from "../constants/constants.js";
//-- Ball Class -----------------------------------------------------------
export class Ball {
  constructor(direction, tankInimigo, bbTankInimigo) {
    this.speed = 0.5;
    this.moveOn = true;
    this.direction = direction;
    this.object = this.buildGeometry();
    this.ballHasBeenHit = false; // usado para verificar se a bola atingiu o tank
    this.bbBall = new THREE.Box3();
    this.bbBall.setFromObject(this.object);
    this.object.previousPosition = this.object.position.clone();
    this.collisionCount = 0; // Contador de colisões
    //this.bbHelper1 = new THREE.Box3Helper(this.bbBall, "white");
    this.tankInimigo = tankInimigo;
    this.bbTankInimigo = bbTankInimigo;
    scene.add(this.bbHelper1);
    scene.add(this.object);
  }
  destroy() {
    scene.remove(this.object);
    this.object.material.dispose();
  }
  getSpeed() {
    return this.speed;
  }
  setSpeed(speed) {
    this.speed = speed;
  }
  startMoving(move) {
    this.moveOn = move;
  }
  move() {
    if (!this.moveOn) return;
    this.object.previousPosition = this.object.position.clone();
    let step = this.direction.clone().multiplyScalar(this.speed);
    this.object.position.add(step);
    this.bbBall.setFromObject(this.object);

    this.checkCollisions();
    this.checkCollisionsTankInimigo();
  }
  checkCollisionsTankInimigo() {
    if (this.bbTankInimigo.intersectsBox(this.bbBall)) {
      if (!this.ballHasBeenHit) {
        this.tankInimigo.dano += 1;
        this.ballHasBeenHit = true; // Variável de controle para deixar cada instancia de uma bola contabilizar somente um tiro no canhão inimigo
      }
      this.destroy();
    }
  }
  checkCollisions() {
    for (let i = 0; i < bbWalls.length; i++) {
      const bbWall = bbWalls[i];
      if (bbWall.intersectsBox(this.bbBall)) {
        this.collisionCount += 1; // Incrementa o contador de colisões
        if (this.collisionCount >= 3) {
          this.destroy(); // Remova a bola se ela colidiu duas vezes
          break;
        }
        this.object.position.copy(this.object.previousPosition);
        if (bbWall.normal) {
          this.changeDirection(bbWall.normal);
        } else {
          console.error("Normal da parede não definida");
        }
        this.bbBall.setFromObject(this.object);
        break; // Pare de verificar outras paredes uma vez que a colisão foi encontrada
      }
    }
  }

  changeDirection(normal) {
    if (!normal) {
      console.error("Normal não é definida.");
      return;
    }
    this.direction.reflect(normal).normalize();
  }
  setDirection(direction) {
    this.direction = direction.normalize();
  }
  buildGeometry() {
    let obj = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), new THREE.MeshPhongMaterial({ color: "white", shininess: "200" }));
    obj.castShadow = true;
    return obj;
  }
}
