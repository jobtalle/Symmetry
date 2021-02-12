/**
 * The renderer
 * @param {HTMLCanvasElement} canvas A WebGL 1 capable canvas element
 * @constructor
 */
const Symmetry = function(canvas) {
    this.gl = canvas.getContext("webgl2");
    this.width = this.height = 0;
    this.orbitControls = new OrbitControls(canvas);
    this.geometry = new Geometry(this.gl);
    this.matrixBuffer = new Array(16);
    this.matrixProjection = new Matrix();
    this.matrixModelView = new Matrix();
    this.matrixMVP = new Matrix();
    this.time = this.UPDATE_RATE;

    this.resize(canvas.width, canvas.height);
    this.setup();
};

Symmetry.prototype.ZNEAR = .1;
Symmetry.prototype.ZFAR = 100;
Symmetry.prototype.ANGLE = Math.PI * .35;
Symmetry.prototype.UPDATE_RATE = 1 / 30;
Symmetry.prototype.FRAME_TIME_MAX = .1;

/**
 * Calculate the current MVP matrix
 */
Symmetry.prototype.updateMatrices = function() {
    this.matrixMVP.set(this.matrixProjection);
    this.matrixMVP.multiply(this.matrixModelView);
    this.matrixMVP.toArray(this.matrixBuffer);
};

/**
 * Update the renderer
 */
Symmetry.prototype.update = function() {
    this.orbitControls.update();
};

/**
 * Draw the scene in this renderer
 * @param {number} deltaTime Passed time in seconds
 */
Symmetry.prototype.draw = function(deltaTime) {
    this.time += Math.min(this.FRAME_TIME_MAX, deltaTime);

    while (this.time > this.UPDATE_RATE) {
        this.time -= this.UPDATE_RATE;

        this.update();
    }

    const time = this.time / this.UPDATE_RATE;

    this.orbitControls.setMatrix(this.matrixModelView, time);

    this.updateMatrices();

    this.gl.viewport(0, 0, this.width, this.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.geometry.draw(this.matrixBuffer);
};

/**
 * Setup the renderer
 */
Symmetry.prototype.setup = function() {
    this.gl.clearColor(.3, .3, .35, 1);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);
};

/**
 * Resize the renderer
 * @param {Number} width The canvas width in pixels
 * @param {Number} height The canvas height in pixels
 */
Symmetry.prototype.resize = function(width, height) {
    this.width = width;
    this.height = height;
    this.matrixProjection.perspective(this.ANGLE, width / height, this.ZNEAR, this.ZFAR);
};