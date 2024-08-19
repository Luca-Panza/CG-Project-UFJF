import { InfoBox, InfoBox2 } from "../util/util.js";

// Função para criar a caixa de informações do tutorial
function buildTutorial() {
  let controls = new InfoBox();
  controls.add("Tanque 1");
  controls.addParagraph();
  controls.add("MOVER");
  controls.add("Esquerda: A / Seta Esquerda");
  controls.add("Direita : D / Seta Direita");
  controls.add("Frente: W / Seta cima");
  controls.add("Trás : S / Seta baixo");
  controls.addParagraph();
  controls.add("ATIRAR");
  controls.add("Espaço");
  controls.show();
}

export { buildTutorial };
