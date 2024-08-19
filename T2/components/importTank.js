import * as THREE from "three";
import { GLTFLoader } from "../../build/jsm/loaders/GLTFLoader.js";

export class TankImport {
  constructor(bodyColor, position, rotationY) {
    this.bodyColor = bodyColor;
    this.position = position;
    this.rotationY = rotationY;
    this.object = null;
    this.vida = 10;

    this.loadTank()
      .then((tank) => {
        this.object = tank;
        this.initializeTank();
      })
      .catch((error) => {
        console.error("Erro ao carregar o tanque:", error);
      });
  }

  // Método para carregar o modelo GLB do tanque
  loadTank() {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(
        "./components/uploads_files_2449357_toon_tank.glb",
        (gltf) => {
          const obj = gltf.scene;

          // Habilita sombras para todos os filhos do objeto
          obj.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          resolve(obj); // Resolve a Promise com o objeto carregado
        },
        undefined,
        (error) => {
          console.error("Erro ao carregar o modelo:", error);
          reject(error); // Rejeita a Promise em caso de erro
        }
      );
    });
  }

  // Inicializa o tanque após o carregamento
  initializeTank() {
    if (this.object) {
      // Configura a cor do tanque
      this.object.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshPhongMaterial({
            color: this.bodyColor,
          });
        }
      });

      // Define a posição do tanque
      this.object.position.copy(this.position);
      this.object.rotation.y = this.rotationY;
      console.log(`Tanque carregado:`, this.object);
    }
  }

  setPosition(position) {
    if (this.object) {
      this.position = position;
      this.object.position.copy(this.position);
    }
  }
}