import * as THREE from "three";

function createLightsForLevel0(scene, renderer) {
  // Criação da luz direcional
  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.set(-40, 25, -28); // Posição da luz
  directionalLight.castShadow = true; // Habilita a projeção de sombras
  scene.add(directionalLight); // Adiciona a luz à cena

  // Configuração do shadow map para aumentar a área de projeção de sombras
  directionalLight.shadow.camera.near = 0.1;
  directionalLight.shadow.camera.far = 100;
  directionalLight.shadow.camera.left = -50;
  directionalLight.shadow.camera.right = 50;
  directionalLight.shadow.camera.top = 50;
  directionalLight.shadow.camera.bottom = -50;

  // Aumentando a resolução do shadow map para sombras mais detalhadas
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;

  //const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
  //scene.add(lightHelper);
}

function createLightsForLevel1(scene, renderer) {
  // Criação da luz ambiente
  const ambientColor = "rgb(50,50,50)";
  const ambientLight = new THREE.AmbientLight(ambientColor);
  scene.add(ambientLight);

  // Criação da luz direcional
  const directionalLight = new THREE.DirectionalLight("white", 0.1); // Ajuste a intensidade da luz conforme necessário
  directionalLight.position.set(0, 10, 0); // Posição da luz
  directionalLight.castShadow = true; // Habilita a projeção de sombras
  scene.add(directionalLight); // Adiciona a luz à cena

  // Função para criar luzes spot
  function createSpotLight(position, targetPosition) {
    const spotLight = new THREE.SpotLight("white", 1000); // Ajuste a intensidade da luz conforme necessário
    spotLight.position.copy(position);

    spotLight.angle = THREE.MathUtils.degToRad(20); // Ângulo maior para luz mais ampla
    spotLight.penumbra = 0.5; // Suaviza as bordas da luz
    spotLight.decay = 2; // Taxa de decaimento para atenuação realista da luz
    spotLight.distance = 100; // Distância máxima de alcance da luz
    spotLight.castShadow = true; // Habilita a projeção de sombras

    spotLight.shadow.mapSize.width = 2048; // Aumenta a resolução do mapa de sombras
    spotLight.shadow.mapSize.height = 2048;

    spotLight.target.position.copy(targetPosition); // Define o alvo da luz
    scene.add(spotLight); // Adiciona a luz à cena
    scene.add(spotLight.target); // Adiciona o alvo da luz à cena

    //const spotHelper = new THREE.SpotLightHelper(spotLight, 0xff8c00);
    //scene.add(spotHelper);

    //const shadowHelper = new THREE.CameraHelper(spotLight.shadow.camera);
    //scene.add(shadowHelper);
  }

  // Criação das luzes spot nos quatro cantos do mapa
  createSpotLight(new THREE.Vector3(-40, 10, -30), new THREE.Vector3(-25, 0, -10)); // Luz 1
  createSpotLight(new THREE.Vector3(-2.5, 10, -30), new THREE.Vector3(-2.5, 0, -17)); // Luz 2
  createSpotLight(new THREE.Vector3(40, 10, 30), new THREE.Vector3(25, 0, 10)); // Luz 3
  createSpotLight(new THREE.Vector3(-2.5, 10, 30), new THREE.Vector3(-2.5, 0, 17)); // Luz 4

  // Habilitação do mapeamento de sombras no renderizador
  renderer.shadowMap.enabled = true; // Habilita sombras
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Define o tipo de sombras
}

function createLightsForLevel2(scene, renderer) {
  // Criação da luz direcional
  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.set(-40, 25, -28); // Posição da luz
  directionalLight.castShadow = true; // Habilita a projeção de sombras
  scene.add(directionalLight); // Adiciona a luz à cena

  // Configuração do shadow map para aumentar a área de projeção de sombras
  directionalLight.shadow.camera.near = 0.1;
  directionalLight.shadow.camera.far = 120;
  directionalLight.shadow.camera.left = -60;
  directionalLight.shadow.camera.right = 60;
  directionalLight.shadow.camera.top = 60;
  directionalLight.shadow.camera.bottom = -60;

  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;

  //const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
  //scene.add(lightHelper);
}

export { createLightsForLevel0, createLightsForLevel1, createLightsForLevel2 };
