import * as THREE from "three";
import { scene, bbWalls } from "../constants/constants.js";
import { playCannonShot, playDamageSound } from "../components/createSound.js";

//-- Ball Class -----------------------------------------------------------
export class Ball {
  constructor(direction, tankInimigo, bbTankInimigo, index, tankUsuario = null, canhao = null) {
    this.speed = 0.5;
    this.moveOn = true;
    this.direction = direction.normalize();
    this.object = this.buildGeometry();
    this.ballHasBeenHit = false;
    this.bbBall = new THREE.Box3();
    this.bbBall.setFromObject(this.object);
    this.object.previousPosition = this.object.position.clone();
    this.collisionCount = 0;
    this.tankInimigo = tankInimigo || null;
    this.bbTankInimigo = bbTankInimigo || null;
    this.tankUsuario = tankUsuario;
    this.index = index;
    scene.add(this.object);
    playCannonShot();
    // this.bbHelper1 = new THREE.Box3Helper(this.bbBall, "white");
    // scene.add(this.bbHelper1);
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

    // Verificar se há tanques inimigos antes de verificar colisões
    if (this.tankInimigo && this.bbTankInimigo) {
      if (this.index === 0) {
        this.checkCollisionsTankInimigo(this.tankInimigo, this.bbTankInimigo);
      } else {
        if (Array.isArray(this.tankInimigo)) {
          // Verificar colisão para cada tanque inimigo
          this.tankInimigo.forEach((tank, idx) => {
            const bb = this.bbTankInimigo[idx];
            if (bb) {
              this.checkCollisionsTankInimigo(tank, bb);
            }
          });
        } else {
          this.checkCollisionsTankInimigo(this.tankInimigo, this.bbTankInimigo);
        }
      }
    }
  }
  checkCollisionsTankInimigo(tankInimigo, bbTankInimigo) {
    if (bbTankInimigo && bbTankInimigo.intersectsBox(this.bbBall)) {
      if (!this.ballHasBeenHit) {
        if (!tankInimigo.godMode) {
          if (this.tankUsuario && this.tankUsuario.danoTiro === 2) {
            tankInimigo.vida -= 2;
            playDamageSound(true);
          } else {
            tankInimigo.vida -= 1;
            playDamageSound(this.tankUsuario != null);
          }
          this.ballHasBeenHit = true;
        }
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
          this.destroy(); // Remove a bola se ela colidiu três vezes
          break;
        }
        this.object.position.copy(this.object.previousPosition);
        const normals = bbWall.normals;
        if (normals && normals.length > 0) {
          let bestNormal = null;
          let minDot = Infinity;
          for (let j = 0; j < normals.length; j++) {
            const normal = normals[j];
            if (normal) {
              const dot = this.direction.dot(normal);
              console.log(`Normal ${j}:`, normal, "Dot:", dot);
              if (dot < minDot) {
                minDot = dot;
                bestNormal = normal;
              }
            } else {
              console.error("Normal da parede não definida em checkCollisions");
            }
          }
          if (bestNormal) {
            this.changeDirection(bestNormal);
          } else {
            console.warn("Nenhuma normal adequada encontrada em checkCollisions, usando normal padrão");
            bestNormal = normals[0]; // Usa a primeira normal disponível
            this.changeDirection(bestNormal);
          }
        } else {
          console.error("Normais da parede não definidas em checkCollisions");
          this.destroy(); // Opcional: destruir a bola se as normais não estiverem definidas
        }
        this.bbBall.setFromObject(this.object);
        break; // Pare de verificar outras paredes uma vez que a colisão foi encontrada
      }
    }
  }
  changeDirection(normal) {
    if (!normal) {
      console.error("Normal não é definida em changeDirection.");
      return;
    }
    this.direction.reflect(normal).normalize();
  }
  setDirection(direction) {
    this.direction = direction.normalize();
  }
  buildGeometry() {
    let obj = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 32, 32),
      new THREE.MeshPhongMaterial({
        color: "white",
        shininess: 200,
        emissive: new THREE.Color("white"), // Defina a cor emissiva aqui
      })
    );
    obj.castShadow = true;
    return obj;
  }
}
