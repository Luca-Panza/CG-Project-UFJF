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
            
            // Definição de cores
            vec3 color;
            if (normalizedProgress > 0.7) {
              color = mix(vec3(1, 1, 0), vec3(0, 1, 0), (normalizedProgress - 0.7) / 0.3); // Verde a Amarelo
            } else if (normalizedProgress > 0.4) {
              color = mix(vec3(1, 0, 0), vec3(1, 1, 0), (normalizedProgress - 0.4) / 0.3); // Amarelo a Vermelho
            } else {
              color = vec3(1, 0, 0); // Vermelho
            }

            float pb = step(normalizedProgress, vUv.x);
            gl_FragColor = vec4(mix(color, vec3(0), pb), 1.0);
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
