import * as THREE from "three";

import { bbWalls, walls } from "../constants/constants.js";

function createLevel(levelData, planeWidth, planeHeight, scene) {
  const wallGeometry = new THREE.BoxGeometry(5, 5, 5);
  const wallMaterial = new THREE.MeshBasicMaterial({ color: "grey" });
  const edgeMaterial = new THREE.LineBasicMaterial({ color: "white", linewidth: 3 });

  const blockSize = 5;
  const offsetX = -(planeWidth / 2 - blockSize / 2);
  const offsetZ = planeHeight / 2 - blockSize / 2;

  for (let i = 0; i < levelData.length; i++) {
    for (let j = 0; j < levelData[i].length; j++) {
      if (levelData[i][j] === 1) {
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        const posX = j * blockSize + offsetX;
        const posY = 2.5;
        const posZ = -i * blockSize + offsetZ;
        wall.position.set(posX, posY, posZ);

        // Adicionando arestas
        const edges = new THREE.EdgesGeometry(wallGeometry);
        const line = new THREE.LineSegments(edges, edgeMaterial);
        line.position.set(posX, posY, posZ);
        scene.add(line);

        let bbWall = new THREE.Box3().setFromObject(wall);
        // Definir normal padrão para as paredes do centro
        let normal = new THREE.Vector3(1, 0, 0); // Escolha uma normal padrão para paredes centrais
        // Verificar e alterar a normal para paredes de borda
        if (i === 0) {
          normal = new THREE.Vector3(0, 0, 1);
        } else if (i === levelData.length - 1) {
          normal = new THREE.Vector3(0, 0, -1);
        } else if (j === 0) {
          normal = new THREE.Vector3(1, 0, 0);
        } else if (j === levelData[i].length - 1) {
          normal = new THREE.Vector3(-1, 0, 0);
        }
        // Armazenar a normal calculada com a bbWall
        bbWall.normal = normal;

        walls.push(wall);
        bbWalls.push(bbWall);
        scene.add(wall);
      }
    }
  }
}

export { createLevel };
