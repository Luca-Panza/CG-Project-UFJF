import * as THREE from 'three'; 

let movingWalls = [];
const planeWidth = 110; // Largura do plano
const planeHeight = 60; // Altura do plano

function createMovingWall(scene, position, height, color) {
    const geometry = new THREE.BoxGeometry(5, 10, 5);
    const material = new THREE.MeshPhongMaterial({ color: color });
    const wall = new THREE.Mesh(geometry, material);
    wall.position.set(position.x, position.y, position.z);
    wall.rotation.x = Math.PI /2; 
    scene.add(wall);
    movingWalls.push({
        wall: wall, 
        direction: 1, 
        speed: (Math.random() * 0.1) + 0.01, 
    });

    console.log("Moving wall created:", wall);
}

function updateWalls() {
    console.log("Updating walls...");
    movingWalls.forEach((entry) => {
        let wall = entry.wall;
        wall.position.z += entry.direction * entry.speed; 
        if (wall.position.z > planeHeight / 12 || wall.position.z < -planeHeight /12) {
            entry.direction *= -1; 
        }
    });
}

// Exporte as funções
export { createMovingWall, updateWalls };
