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
    this.rotationX = this.rotationXPrevious = this.ROTATION_X_DEFAULT;
    this.rotationY = this.rotationYPrevious = 0;
    this.velocityX = 0;
    this.velocityY = 0;
    this.zoom = this.zoomTarget = this.ZOOM_INITIAL;
    this.updated = true;

    element.addEventListener("mousedown", this.mouseDown.bind(this));
    element.addEventListener("touchstart", event => {
        this.mouseMove(event.touches[0].clientX, event.touches[0].clientY);
        this.mouseDown();
    });
    element.addEventListener("touchmove", event => this.mouseMove(event.touches[0].clientX, event.touches[0].clientY));
    element.addEventListener("mouseup", this.mouseUp.bind(this));
    element.addEventListener("touchend", this.mouseUp.bind(this));
    element.addEventListener("mousemove", event => this.mouseMove(event.clientX, event.clientY));
    element.addEventListener("wheel", event => this.moveZoom(Math.sign(event.deltaY)));
};

OrbitControls.prototype.ZOOM_INITIAL = 2;
OrbitControls.prototype.ZOOM_SPEED = .1;
OrbitControls.prototype.ZOOM_LIMITS = new Range(.5, 10);
OrbitControls.prototype.ROTATION_X_LIMITS = new Range(-Math.PI * .45, Math.PI * .45);
OrbitControls.prototype.ROTATION_X_DEFAULT = Math.PI * .2;
OrbitControls.prototype.SENSITIVITY = 6;
OrbitControls.prototype.DAMPING = .8;
OrbitControls.prototype.THRESHOLD = .0001;

/**
 * Change the zoom
 * @param {number} sign The direction to change the zoom with, -1 or 1
 */
OrbitControls.prototype.moveZoom = function(sign) {
    this.zoomTarget = this.ZOOM_LIMITS.clamp(this.zoomTarget * (1 + this.ZOOM_SPEED * sign));
};

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

        this.rotationX = this.ROTATION_X_LIMITS.clamp(this.rotationX + dy * this.SENSITIVITY);
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
    this.updated = this.mousePressed;

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

    if (Math.abs(this.rotationX - this.rotationXPrevious) < this.THRESHOLD)
        this.rotationX = this.rotationXPrevious;

    if (Math.abs(this.rotationY - this.rotationYPrevious) < this.THRESHOLD)
        this.rotationY = this.rotationYPrevious;

    this.zoom += (this.zoomTarget - this.zoom) * (1 - this.DAMPING);

    if (Math.abs(this.zoom - this.zoomTarget) < this.THRESHOLD)
        this.zoom = this.zoomTarget;

    if (this.zoom !== this.zoomTarget ||
        this.rotationXPrevious !== this.rotationX ||
        this.rotationYPrevious !== this.rotationY)
        this.updated = true;
};

/**
 * Set the matrix
 * @param {Matrix} matrix A matrix to set
 */
OrbitControls.prototype.setMatrix = function(matrix) {
    this.updateVectors();

    matrix.lookAt(this.from, this.to, Vector.UP);
};