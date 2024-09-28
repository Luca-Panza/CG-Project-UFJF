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
        let normal = new THREE.Vector3(1, 0, 0); // Normal padrão

        if (i === 0) {
          normal = new THREE.Vector3(0, 0, 1);
        } else if (i === levelData.length - 1) {
          normal = new THREE.Vector3(0, 0, -1);
        } else if (j === 0) {
          normal = new THREE.Vector3(1, 0, 0);
        } else if (j === levelData[i].length - 1) {
          normal = new THREE.Vector3(-1, 0, 0);
        }

        bbWall.normal = normal;

        walls.push(wall);
        bbWalls.push(bbWall);
        scene.add(wall);
      }
    }
  }
}

export { createLevel };
