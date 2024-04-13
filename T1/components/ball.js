class Ball {
    constructor(tank, posx, posy, posz) {
        this.speed = 0.1;
        this.moveOn = false;
        this.direction = new THREE.Vector3(0.7, 0.0, 0.4).normalize(); // descobrir como pegar a direção na qual o canhão está aprontando e colocar aqui tbm
        this.object = this.buildGeometry()
        this.posx = posx;
        this.posy = posy;
        this.posz = posz;
        this.tank = tank;
        scene.add(this.object);
    }
    getSpeed() {
        return this.speed;
    }
    setSpeed(speed) {
        this.speed = speed;
    }
    startMoving(move) {
        this.moveOn = move;
    }
    move() {
        if (!this.moveOn) return;
        let step = this.direction.clone().multiplyScalar(this.speed);
        this.object.position.add(step);

        this.checkCollisions();
    }
    checkCollisions() {
        // Aqui pode-se incluir critérios de colisão mais sofisticados. 
        // Neste exemplo mais simples o controle é feito analisando as fronteiras do plano
        let size = 4.5;
        if (this.object.position.x > size) this.changeDirection(new THREE.Vector3(-1.0, 0.0, 0.0));
        if (this.object.position.x < -size) this.changeDirection(new THREE.Vector3(1.0, 0.0, 0.0));
        if (this.object.position.z > size) this.changeDirection(new THREE.Vector3(0.0, 0.0, -1.0));
        if (this.object.position.z < -size) this.changeDirection(new THREE.Vector3(0.0, 0.0, 1.0));
    }
    changeDirection(normal) {
        this.direction.reflect(normal).normalize();
    }
    setDirection(direction) {
        this.direction = direction.normalize();
    }
    buildGeometry() {
        let obj = new THREE.Mesh(new THREE.SphereGeometry(0.5, 2, 2),
            new THREE.MeshPhongMaterial({ color: "red", shininess: "200" }));
        obj.position.set(this.posx, this.posy, this.posz);
        obj.castShadow = true;
        return obj;
    }
}