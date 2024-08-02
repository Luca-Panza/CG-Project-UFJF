import { InfoBox, InfoBox2 } from "../util/util.js";

// Função para criar a caixa de informações do tutorial
function buildTutorial() {
  let controls = new InfoBox();
  controls.add("Tanque 1");
  controls.addParagraph();
  controls.add("Mover");
  controls.add("Esquerda/ Direita : A / D");
  controls.add("Frente/ Trás : W / S");
  controls.addParagraph();
  controls.add("Atirar");
  controls.add("Espaço ou Q");
  controls.show();

  let controls2 = new InfoBox2();
  controls2.add("Tanque 2");
  controls2.addParagraph();
  controls2.add("Mover");
  controls2.add("Esquerda/ Direita : Seta Esquerda / Seta Direita");
  controls2.add("Frente/ Trás : Seta cima / Seta baixo");
  controls2.addParagraph();
  controls2.add("Atirar");
  controls2.add("/ ou ,");
  controls2.show();
}

export { buildTutorial };
