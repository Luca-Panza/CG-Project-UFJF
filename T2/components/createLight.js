import * as THREE from "three";

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

    spotLight.shadow.mapSize.width = 120; // Aumenta a resolução do mapa de sombras
    spotLight.shadow.mapSize.height = 120;

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

export { createLightsForLevel1 };
