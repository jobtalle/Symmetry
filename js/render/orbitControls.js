/**
 * Orbit controls
 * @param {HTMLElement} element An element to capture mouse events on
 * @constructor
 */
const OrbitControls = function(element) {
    this.from = new Vector();
    this.to = new Vector();
    this.mouseX = this.mouseY = 0;
    this.mousePressed = false;
    this.rotationY = Math.PI * 1.5;
    this.rotationX = Math.PI * .25;
    this.zoom = .5;

    this.updateVectors();

    element.addEventListener("mousedown", this.mouseDown.bind(this));
    element.addEventListener("mouseup", this.mouseUp.bind(this));
    element.addEventListener("mousemove", event => this.mouseMove(event.clientX, event.clientY));
};

OrbitControls.prototype.updateVectors = function() {
    this.from.x = Math.cos(this.rotationY) * Math.cos(this.rotationX) * this.zoom;
    this.from.z = Math.sin(this.rotationY) * Math.cos(this.rotationX) * this.zoom;
    this.from.y = Math.sin(this.rotationX) * this.zoom;
};

OrbitControls.prototype.mouseDown = function() {
    this.mousePressed = true;
};

OrbitControls.prototype.mouseMove = function(x, y) {
    if (this.mousePressed) {
        const dx = x - this.mouseX;
        const dy = y - this.mouseY;

        this.rotationX += dy * .01;
        this.rotationY -= dx * .01;

        this.updateVectors();
    }

    this.mouseX = x;
    this.mouseY = y;
};

OrbitControls.prototype.mouseUp = function() {
    this.mousePressed = false;
};

/**
 * Update the orbit controls
 */
OrbitControls.prototype.update = function() {

};

/**
 * Set the matrix
 * @param {Matrix} matrix A matrix to set
 * @param {number} time The time interpolation factor in the range [0, 1]
 */
OrbitControls.prototype.setMatrix = function(matrix, time) {
    matrix.lookAt(this.from, this.to, Vector.UP);
};