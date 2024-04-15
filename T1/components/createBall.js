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
    this.colisoesParede = 0; 
    //this.bbHelper1 = new THREE.Box3Helper(this.bbBall, "white");
    //scene.add(this.bbHelper1);
    scene.add(this.object);
  }
  destroy() {
    this.object.material.dispose();
    scene.remove(this.object);
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
      let collision = bbWall.intersectsBox(this.bbBall);
      // checa a colisão do tiro com a parede
      if (collision) {
        this.object.position.copy(this.object.previousPosition);
        // console.log(this.direction);
        this.changeDirection(new THREE.Vector3(-this.direction.x, this.direction.y, this.direction.z));
        // deixar isso por enquanto, e mudaar de acordo com o áudios
        // pegar para ver quantas vezes colidiu e destruir
        // tentar fazer a colisao do tiro com o tanque inimigo
        // console.log(this.direction);
        this.bbBall.setFromObject(this.object);
        this.colisoesParede = this.colisoesParede + 1;
        if (this.colisoesParede == 2) {
          this.destroy();
        }
      }
    }
  }
  NumColisoesParede(){
    this.colisoesParede++;
    if(this.colisoesParede == 2){
      this.destroy();
    }
  }
  changeDirection(normal) {
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
