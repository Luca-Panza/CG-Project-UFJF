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