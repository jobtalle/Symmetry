/**
 * Orbit controls
 * @param {HTMLElement} element An element to capture mouse events on
 * @constructor
 */
const OrbitControls = function(element) {
    this.element = element;
    this.from = new Vector();
    this.to = new Vector();
    this.mouseX = this.mouseY = 0;
    this.mousePressed = false;
    this.rotationX = this.rotationXPrevious = Math.PI * .25;
    this.rotationY = this.rotationYPrevious = 0;
    this.velocityX = 0;
    this.velocityY = 0;
    this.zoom = 2;

    element.addEventListener("mousedown", this.mouseDown.bind(this));
    element.addEventListener("mouseup", this.mouseUp.bind(this));
    element.addEventListener("mousemove", event => this.mouseMove(event.clientX, event.clientY));
};

OrbitControls.prototype.ROTATION_X_LIMITS = new Range(-Math.PI * .4, Math.PI * .4);
OrbitControls.prototype.SENSITIVITY = 6;
OrbitControls.prototype.DAMPING = .8;

/**
 * Update the source and target vectors according to rotation values
 */
OrbitControls.prototype.updateVectors = function() {
    this.from.x = Math.cos(this.rotationY) * Math.cos(this.rotationX) * this.zoom;
    this.from.z = Math.sin(this.rotationY) * Math.cos(this.rotationX) * this.zoom;
    this.from.y = Math.sin(this.rotationX) * this.zoom;
};

/**
 * Press the mouse down
 */
OrbitControls.prototype.mouseDown = function() {
    this.mousePressed = true;
};

/**
 * Move the mouse
 * @param {number} x The X coordinate in pixels
 * @param {number} y The Y coordinate in pixels
 */
OrbitControls.prototype.mouseMove = function(x, y) {
    if (this.mousePressed) {
        const radius = Math.sqrt(
            this.element.clientWidth * this.element.clientWidth +
            this.element.clientHeight * this.element.clientHeight) * .5;
        const dx = (x - this.mouseX) / radius;
        const dy = (y - this.mouseY) / radius;

        this.rotationX = this.ROTATION_X_LIMITS.clamp(this.rotationX) + dy * this.SENSITIVITY;
        this.rotationY = this.rotationY - dx * this.SENSITIVITY;
    }

    this.mouseX = x;
    this.mouseY = y;
};

/**
 * Release the mouse
 */
OrbitControls.prototype.mouseUp = function() {
    this.mousePressed = false;
};

/**
 * Update the orbit controls
 * @param {number} deltaTime Passed time in seconds
 */
OrbitControls.prototype.update = function(deltaTime) {
    if (this.mousePressed) {
        this.velocityX = (this.rotationX - this.rotationXPrevious) / deltaTime;
        this.velocityY = (this.rotationY - this.rotationYPrevious) / deltaTime;
    }

    this.rotationXPrevious = this.rotationX;
    this.rotationYPrevious = this.rotationY;

    if (!this.mousePressed) {
        this.velocityX *= this.DAMPING;
        this.velocityY *= this.DAMPING;

        this.rotationX = this.ROTATION_X_LIMITS.clamp(this.rotationX + this.velocityX * deltaTime);
        this.rotationY += this.velocityY * deltaTime;
    }
};

/**
 * Set the matrix
 * @param {Matrix} matrix A matrix to set
 */
OrbitControls.prototype.setMatrix = function(matrix) {
    this.updateVectors();

    matrix.lookAt(this.from, this.to, Vector.UP);
};