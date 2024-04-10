import * as THREE from "three";

// Function to add a tire to the tank
function addTire(tank, posX, posY, posZ) {
  // Geometry and material for the outer tire
  const tireOuterGeometry = new THREE.TorusGeometry(0.45, 0.35, 30, 200);
  const tireOuterMaterial = new THREE.MeshPhongMaterial({ color: 0x111111 }); // Black
  const tireOuter = new THREE.Mesh(tireOuterGeometry, tireOuterMaterial);
  tireOuter.position.set(posX, posY, posZ);
  tank.add(tireOuter);

  // Geometry and material for the wheel/inner part of the tire
  const tireInnerGeometry = new THREE.CylinderGeometry(0.45, 0.45, 0.35, 32);
  const tireInnerMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 }); // Grey
  const tireInner = new THREE.Mesh(tireInnerGeometry, tireInnerMaterial);
  tireInner.position.set(posX, posY, posZ);
  tireInner.rotateX(Math.PI / 2); // Rotate to align with the outer tire

  tank.add(tireInner);
}

// Complete function to create a tank
function createTank(bodyColor, cannonColor, position) {
  const tankMaterial = new THREE.MeshPhongMaterial({ color: bodyColor });
  const tank = new THREE.Group();

  // Tank body
  const bodyGeometry = new THREE.BoxGeometry(3.25, 1.5, 2.5);
  const body = new THREE.Mesh(bodyGeometry, tankMaterial);
  body.position.set(0.0, 1.4, 0.0);
  tank.add(body);

  // Tires
  addTire(tank, 0.9, 0.7, 1.2); // Front right tire
  addTire(tank, -0.9, 0.7, 1.2); // Front left tire
  addTire(tank, -0.9, 0.7, -1.2); // Rear left tire
  addTire(tank, 0.9, 0.7, -1.2); // Rear right tire

  // Upper part of the body
  const upperBodyGeometry = new THREE.BoxGeometry(2.8, 0.5, 2.2);
  const upperBody = new THREE.Mesh(upperBodyGeometry, tankMaterial);
  upperBody.position.set(0.0, 1.0, 0.0);
  body.add(upperBody);

  // Dome
  const domeGeometry = new THREE.SphereGeometry(1, 20, 20);
  const dome = new THREE.Mesh(domeGeometry, tankMaterial);
  dome.position.set(0.0, 1.5, 0);
  body.add(dome);

  // Cannon creation
  const cannonGeometry = new THREE.CylinderGeometry(0.25, 0.25, 2);
  const cannonMaterial = new THREE.MeshBasicMaterial({ color: cannonColor });
  const cannon = new THREE.Mesh(cannonGeometry, cannonMaterial);
  cannon.position.set(1.5, 3, 0.0);
  cannon.rotateZ(Math.PI / 2); // Rotation to align the cannon
  tank.add(cannon);

  // Creation of the smaller cylinder for the tip of the cannon
  const cannonTipGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.75); // Geometry with smaller diameter and height
  const cannonTipMaterial = new THREE.MeshBasicMaterial({ color: "gray" }); // Can use the same color or a different color
  const cannonTip = new THREE.Mesh(cannonTipGeometry, cannonTipMaterial);
  // Positioning at the tip of the cannon. Considering the cannon is 2 in length, adjust as necessary
  cannonTip.position.set(2.75, 3, 0.0);
  cannonTip.rotateZ(Math.PI / 2); // Same rotation as the cannon
  tank.add(cannonTip);

  // Position the tank in the scene
  tank.rotation.y = Math.PI / 2;
  tank.position.copy(position);

  return tank;
}

export default createTank;
