import * as THREE from "three";
import { bbWalls, walls } from "../constants/constants.js";

let wallMaterial;

function createLevel(levelData, planeWidth, planeHeight, scene, index) {
  const wallGeometry = new THREE.BoxGeometry(5, 5, 5);

  // Carregar a textura da caixa (crate) com base no nível
  const textureLoader = new THREE.TextureLoader();
  const texturePath = `./assets/crateTextures/crateTextureLevel${index + 1}.jpg`;
  const crateTexture = textureLoader.load(texturePath);

  // Aplicar a textura ao material de Lambert
  wallMaterial = new THREE.MeshLambertMaterial({ map: crateTexture });

  crateTexture.colorSpace = THREE.SRGBColorSpace;

  const blockSize = 5;
  const offsetX = -(planeWidth / 2 - blockSize / 2);
  const offsetZ = planeHeight / 2 - blockSize / 2;

  for (let i = 0; i < levelData.length; i++) {
    for (let j = 0; j < levelData[i].length; j++) {
      if (levelData[i][j] !== 0) {
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);

        const posY = levelData[i][j] === 2 ? 0 : 2.5;
        const posX = j * blockSize + offsetX;
        const posZ = -i * blockSize + offsetZ;
        wall.position.set(posX, posY, posZ);

        let bbWall = new THREE.Box3().setFromObject(wall);
        let normals = [];

        // Verificar células adjacentes e adicionar normais ao array
        // Célula acima (parede superior)
        if (i > 0 && levelData[i - 1][j] === 0) {
          normals.push(new THREE.Vector3(0, 0, 1)); // Inverter para (0, 0, 1)
        }
        // Célula abaixo (parede inferior)
        if (i < levelData.length - 1 && levelData[i + 1][j] === 0) {
          normals.push(new THREE.Vector3(0, 0, -1)); // Inverter para (0, 0, -1)
        }
        // Célula à esquerda
        if (j > 0 && levelData[i][j - 1] === 0) {
          normals.push(new THREE.Vector3(-1, 0, 0)); // Mantém como está
        }
        // Célula à direita
        if (j < levelData[i].length - 1 && levelData[i][j + 1] === 0) {
          normals.push(new THREE.Vector3(1, 0, 0)); // Mantém como está
        }

        // Normalizar as normais
        normals.forEach((normal) => normal.normalize());

        // Se nenhuma normal foi adicionada, definir uma normal padrão (opcional)
        if (normals.length === 0) {
          normals.push(new THREE.Vector3(0, 1, 0)); // Por exemplo, apontando para cima
        }

        bbWall.normals = normals;

        walls.push(wall);
        bbWalls.push(bbWall);
        scene.add(wall);
      }
    }
  }
}

export { createLevel };
