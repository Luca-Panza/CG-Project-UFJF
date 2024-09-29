import * as THREE from "three";

let audioLoader = new THREE.AudioLoader(); // Global audio loader
let listener;
let backgroundMusic;
let soundEffect;
let cannonShot;
let damageSound;
let isMutedGlobal = typeof isMuted !== "undefined" ? isMuted : false;

function toggleMute(isMuted) {
  isMutedGlobal = isMuted;

  if (backgroundMusic) {
    backgroundMusic.setVolume(isMuted ? 0 : 0.05);
  }

  if (soundEffect) {
    soundEffect.setVolume(isMuted ? 0 : 0.05);
  }

  if (cannonShot) {
    cannonShot.setVolume(isMuted ? 0 : 0.025);
  }

  if (damageSound) {
    damageSound.setVolume(isMuted ? 0 : 0.025);
  }
}

function playRandomSound() {
  if (isMutedGlobal) return;

  const sounds = [
    { src: "./assets/sounds/sfx-herewego.mp3", chance: 0.495 }, // 49,5% de chance
    { src: "./assets/sounds/sfx-letsgo.mp3", chance: 0.495 }, // 49,5% de chance
    { src: "./assets/sounds/sfx-yeeha.mp3", chance: 0.01 }, // 1% de chance
  ];

  const random = Math.random();
  let cumulativeChance = 0;

  let selectedSound;
  for (let i = 0; i < sounds.length; i++) {
    cumulativeChance += sounds[i].chance;
    if (random <= cumulativeChance) {
      selectedSound = sounds[i].src;
      break;
    }
  }

  soundEffect = new THREE.Audio(listener);
  audioLoader.load(selectedSound, function (buffer) {
    soundEffect.setBuffer(buffer);
    soundEffect.setVolume(0.05); // Respeita o estado de mudo global
    soundEffect.play();
  });
}

function playBackgroundMusic(camera) {
  if (isMutedGlobal) return;

  if (!camera) {
    console.error("A câmera não foi passada para playBackgroundMusic.");
    return;
  }

  listener = new THREE.AudioListener();
  camera.add(listener);

  // Create an audio source for background music
  backgroundMusic = new THREE.Audio(listener);
  audioLoader.load("./assets/sounds/sfx-theme.mp3", function (buffer) {
    backgroundMusic.setBuffer(buffer);
    backgroundMusic.setLoop(true);
    backgroundMusic.setVolume(0.05);
    backgroundMusic.play();
  });

  playRandomSound();
}

function playCannonShot() {
  if (isMutedGlobal) return;

  // Cria uma nova fonte de áudio para o som do tiro de canhão
  cannonShot = new THREE.Audio(listener);

  // Carrega o som do tiro de canhão
  audioLoader.load("./assets/sounds/sfx-cannon-shot.mp3", function (buffer) {
    cannonShot.setBuffer(buffer);
    cannonShot.setVolume(0.025); // Respeita o estado de mudo global
    cannonShot.play();
  });
}

function playDamageSound(playerExists) {
  if (isMutedGlobal) return;

  // Cria uma nova fonte de áudio para o som de dano
  let damageSound = new THREE.Audio(listener);

  // Carrega o som de dano
  audioLoader.load("./assets/sounds/sfx-damage.mp3", function (buffer) {
    damageSound.setBuffer(buffer);

    // Se o jogador existir, aumenta o volume para 0.05, caso contrário, deixa 0.025
    let volume = playerExists ? 0.025 : 0.05;
    damageSound.setVolume(volume); // Respeita o estado de mudo global

    damageSound.play();
  });
}

export { toggleMute, playBackgroundMusic, playCannonShot, playDamageSound };
