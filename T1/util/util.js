/**
  * Class box - show information onscreen
  *
  */
export class InfoBox {
    constructor() {
        this.infoBox = document.createElement('div');
        this.infoBox.id = "InfoxBox";
        this.infoBox.style.padding = "6px 14px";
        this.infoBox.style.position = "fixed";
        this.infoBox.style.bottom = "0";
        this.infoBox.style.left = "0";
        this.infoBox.style.backgroundColor = "rgba(255,255,255,0.2)";
        this.infoBox.style.color = "white";
        this.infoBox.style.fontFamily = "sans-serif";
        this.infoBox.style.userSelect = "none";
        this.infoBox.style.textAlign = "left";
    }

    addParagraph() {
        const paragraph = document.createElement("br")
        this.infoBox.appendChild(paragraph);;
    }

    add(text) {
        var textnode = document.createTextNode(text);
        this.infoBox.appendChild(textnode);
        this.addParagraph();
    }

    show() {
        document.body.appendChild(this.infoBox);
    }
}

export class InfoBox2 {
    constructor() {
        this.infoBox = document.createElement('div');
        this.infoBox.id = "InfoxBox";
        this.infoBox.style.padding = "6px 14px";
        this.infoBox.style.position = "fixed";
        this.infoBox.style.bottom = "0";
        this.infoBox.style.right = "0";
        this.infoBox.style.backgroundColor = "rgba(255,255,255,0.2)";
        this.infoBox.style.color = "white";
        this.infoBox.style.fontFamily = "sans-serif";
        this.infoBox.style.userSelect = "none";
        this.infoBox.style.textAlign = "left";
    }

    addParagraph() {
        const paragraph = document.createElement("br")
        this.infoBox.appendChild(paragraph);;
    }

    add(text) {
        var textnode = document.createTextNode(text);
        this.infoBox.appendChild(textnode);
        this.addParagraph();
    }

    show() {
        document.body.appendChild(this.infoBox);
    }
}

export class InfoBoxTopEsquerda {
    constructor() {
        this.infoBox = document.createElement('div');
        this.infoBox.id = "InfoxBox";
        this.infoBox.style.padding = "6px 14px";
        this.infoBox.style.position = "fixed";
        this.infoBox.style.top = "0";
        this.infoBox.style.left = "0";
        this.infoBox.style.backgroundColor = "rgba(255,255,255,0.2)";
        this.infoBox.style.color = "white";
        this.infoBox.style.fontFamily = "sans-serif";
        this.infoBox.style.userSelect = "none";
        this.infoBox.style.textAlign = "left";
    }

    addParagraph() {
        const paragraph = document.createElement("br")
        this.infoBox.appendChild(paragraph);;
    }

    add(text) {
        var textnode = document.createTextNode(text);
        this.infoBox.appendChild(textnode);
        this.addParagraph();
    }

    show() {
        document.body.appendChild(this.infoBox);
    }
}

export class InfoBoxTopDireita {
    constructor() {
        this.infoBox = document.createElement('div');
        this.infoBox.id = "InfoxBox";
        this.infoBox.style.padding = "6px 14px";
        this.infoBox.style.position = "fixed";
        this.infoBox.style.top = "0";
        this.infoBox.style.right = "0";
        this.infoBox.style.backgroundColor = "rgba(255,255,255,0.2)";
        this.infoBox.style.color = "white";
        this.infoBox.style.fontFamily = "sans-serif";
        this.infoBox.style.userSelect = "none";
        this.infoBox.style.textAlign = "left";
    }

    addParagraph() {
        const paragraph = document.createElement("br")
        this.infoBox.appendChild(paragraph);;
    }

    add(text) {
        var textnode = document.createTextNode(text);
        this.infoBox.appendChild(textnode);
        this.addParagraph();
    }

    show() {
        document.body.appendChild(this.infoBox);
    }
}

export class SecondaryBoxTopDireita {
    constructor(defaultText) {
        this.box = document.createElement('div');
        this.box.id = "box";
        this.box.style.padding = "6px 14px";
        this.box.style.top = "0";
        this.box.style.right = "0";
        this.box.style.position = "fixed";
        this.box.style.backgroundColor = "rgba(100,100,255,0.3)";
        this.box.style.color = "white";
        this.box.style.fontFamily = "sans-serif";
        this.box.style.fontSize = "26px";

        this.textnode = document.createTextNode(defaultText);
        this.box.appendChild(this.textnode);
        document.body.appendChild(this.box);
    }

    changeMessage(newText) {
        this.textnode.nodeValue = newText;
    }
    hide() {
        this.textnode.nodeValue = "";
        this.box.style.backgroundColor = "rgba(0,0,0,0)";
    }
    changeStyle(backcolor, fontColor, size = "26px", font = "sans-serif") {
        this.box.style.backgroundColor = backcolor;
        this.box.style.color = fontColor;
        this.box.style.fontFamily = font;
        this.box.style.fontSize = size;
    }
}

export class SecondaryBoxTopEsquerda {
    constructor(defaultText) {
        this.box = document.createElement('div');
        this.box.id = "box";
        this.box.style.padding = "6px 14px";
        this.box.style.top = "0";
        this.box.style.left = "0";
        this.box.style.position = "fixed";
        this.box.style.backgroundColor = "rgba(100,100,255,0.3)";
        this.box.style.color = "white";
        this.box.style.fontFamily = "sans-serif";
        this.box.style.fontSize = "26px";

        this.textnode = document.createTextNode(defaultText);
        this.box.appendChild(this.textnode);
        document.body.appendChild(this.box);
    }

    changeMessage(newText) {
        this.textnode.nodeValue = newText;
    }
    hide() {
        this.textnode.nodeValue = "";
        this.box.style.backgroundColor = "rgba(0,0,0,0)";
    }
    changeStyle(backcolor, fontColor, size = "26px", font = "sans-serif") {
        this.box.style.backgroundColor = backcolor;
        this.box.style.color = fontColor;
        this.box.style.fontFamily = font;
        this.box.style.fontSize = size;
    }
}