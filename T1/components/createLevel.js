import * as THREE from "three"; 
import { walls , bbWalls } from "../constants/constants.js"
 
function createLevel(levelData, planeWidth, planeHeight, scene) {
  const wallGeometry = new THREE.BoxGeometry(5, 5, 5);
  const wallMaterial = new THREE.MeshBasicMaterial({ color: "grey" });

  const blockSize = 5;
  const offsetX = -(planeWidth / 2 - blockSize / 2);
  const offsetZ = planeHeight / 2 - blockSize / 2;

  for (let i = 0; i < levelData.length; i++) {
    for (let j = 0; j < levelData[i].length; j++) {
      if (levelData[i][j] === 1) {
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        const posX = j * 5 + offsetX;
        const posY = 2.5;
        const posZ = -i * 5 + offsetZ;
        wall.position.set(posX, posY, posZ);
        let bbWall = new THREE.Box3().setFromObject(wall);
        walls.push(wall);
        bbWalls.push(bbWall);
        scene.add(wall);
      }
    }
  }
}

export { createLevel };
