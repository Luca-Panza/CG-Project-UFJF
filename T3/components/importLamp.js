import * as THREE from "three";
import { GLTFLoader } from "../../build/jsm/loaders/GLTFLoader.js";

function createLampposts(scene) {
  // Define as posições e rotações dos postes
  const lamppostsConfig = [
    { position: new THREE.Vector3(-40, 5, -30), rotationY: -Math.PI / 4 },
    { position: new THREE.Vector3(-2.5, 0, -30), rotationY: -Math.PI / 2 },
    { position: new THREE.Vector3(40, 0, 30), rotationY: (3 * Math.PI) / 4 },
    { position: new THREE.Vector3(-2.5, 0, 30), rotationY: Math.PI / 2 },
  ];

  // Carrega os postes e adiciona-os à cena
  Promise.all(
    lamppostsConfig.map((config, index) =>
      loadLamppost(config.position, config.rotationY)
        .then((lamppostObject) => {
          const positions = [
            new THREE.Vector3(-43, 5, -30),
            new THREE.Vector3(-2.5, 5, -30),
            new THREE.Vector3(42, 5, 30),
            new THREE.Vector3(-2.5, 5, 30),
          ];
          lamppostObject.position.copy(positions[index]);
          scene.add(lamppostObject);
          // console.log("Poste adicionado à cena:", lamppostObject);
        })
        .catch((error) => {
          console.error("Erro ao adicionar o poste à cena:", error);
        })
    )
  );
}

// Função para carregar o modelo GLB do poste
function loadLamppost(position, rotationY) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "./components/lamppost.glb",
      (gltf) => {
        const obj = gltf.scene;

        // Habilita sombras para todos os filhos do objeto
        obj.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        // Configura a posição e rotação após o carregamento
        obj.position.copy(position);
        obj.rotation.y = rotationY;

        resolve(obj);
      },
      undefined,
      (error) => {
        console.error("Erro ao carregar o modelo:", error);
        reject(error);
      }
    );
  });
}

export { createLampposts };
