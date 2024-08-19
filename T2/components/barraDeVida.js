import * as THREE from "three";

export class ProgressBar extends THREE.Sprite {
  constructor(_progress, min = 0, max = 10) {
    super();
    this.min = min;
    this.max = max;
    this.scale.set(7, 0.7);
    this.progress = _progress;
    this.material = new THREE.SpriteMaterial({
      onBeforeCompile: (shader) => {
        // Adiciona os uniformes para progress, min e max
        shader.uniforms.progress = { value: this.progress };
        shader.uniforms.min = { value: min };
        shader.uniforms.max = { value: max };

        // Armazena o shader para acesso posterior
        this.shader = shader;

        // Modifica o fragmentShader
        shader.fragmentShader = `
          uniform float progress;
          uniform float min;
          uniform float max;
          varying vec2 vUv;

          void main() {
            float normalizedProgress = (progress - min) / (max - min);
            vec3 backColor = mix(vec3(0), vec3(0, 0.5, 0), normalizedProgress);
            float pb = step(normalizedProgress, vUv.x);
            gl_FragColor = vec4(mix(vec3(0, 1, 0), backColor, pb), 1.0);
          }
        `;
      },
    });
    this.material.defines = { USE_UV: "" };
    this.center.set(0.5, 0);
  }

  // Método para atualizar o progresso
  updateProgress(newProgress) {
    this.progress = newProgress;
    if (this.shader) {
      this.shader.uniforms.progress.value = this.progress;
    }
  }
}
