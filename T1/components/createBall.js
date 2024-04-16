import * as THREE from "three";
import { scene, bbWalls } from "../constants/constants.js";
//-- Ball Class -----------------------------------------------------------
export class Ball {
  constructor(direction) {
    this.speed = 0.5;
    this.moveOn = true;
    this.direction = new THREE.Vector3(0.7, 0.0, 0.4).normalize();
    this.object = this.buildGeometry();
    this.bbBall = new THREE.Box3();
    this.bbBall.setFromObject(this.object);
    this.object.previousPosition = this.object.position.clone();
    this.collisionCount = 0; // Contador de colisões
    this.bbHelper1 = new THREE.Box3Helper(this.bbBall, "white");
    scene.add(this.bbHelper1);
    scene.add(this.object);
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
  }
  checkCollisions() {
    for (let i = 0; i < bbWalls.length; i++) {
      const bbWall = bbWalls[i];
      if (bbWall.intersectsBox(this.bbBall)) {
        this.collisionCount += 1; // Incrementa o contador de colisões
        if (this.collisionCount >= 3) {
          this.removeBall(); // Remova a bola se ela colidiu duas vezes
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
  removeBall() {
    scene.remove(this.object); // Remove a bola da cena
    this.moveOn = false; // Para o movimento da bola
  }
  changeDirection(normal) {
    if (!normal) {
      console.error("Normal is undefined, cannot change direction.");
      return;
    }
    this.direction.reflect(normal).normalize();
  }
  setDirection(direction) {
    this.direction = direction.normalize();
  }
  buildGeometry() {
    let obj = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshPhongMaterial({ color: "white", shininess: "200" }));
    obj.position.set(0, 1, 0);
    obj.castShadow = true;
    return obj;
  }
}
