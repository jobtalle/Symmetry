/**
 * The renderer
 * @param {HTMLCanvasElement} canvas A WebGL 2 capable canvas element
 * @constructor
 */
const Symmetry = function(canvas) {
    this.gl = canvas.getContext("webgl2", {antialias: false});
    this.width = this.height = 0;
    this.orbitControls = new OrbitControls(canvas);
    this.geometry = new Geometry(this.gl, this.MAX_PLANES);
    this.matrixBuffer = new Array(16);
    this.matrixProjection = new Matrix();
    this.matrixModelView = new Matrix();
    this.matrixMVP = new Matrix();
    this.planeRenderer = new PlaneRenderer(this.gl);
    this.planes = [];

    this.planeRenderer.setPlane(this.planes[this.planes.length - 1]);

    this.resize(canvas.width, canvas.height);
    this.setup();
};

Symmetry.prototype.ZNEAR = .1;
Symmetry.prototype.ZFAR = 100;
Symmetry.prototype.ANGLE = Math.PI * .4;
Symmetry.prototype.MAX_PLANES = 10;

/**
 * Randomize the planes
 */
Symmetry.prototype.randomize = function() {
    const planeCount = Math.floor(2 + (this.MAX_PLANES - 2) * Math.random());

    this.planes = [];

    for (let plane = 0; plane < planeCount; ++plane)
        this.planes.push(new Plane(
            new Vector(
                Math.random() * .3 - .15,
                Math.random() * .3 - .15,
                Math.random() * .3 - .15),
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2));

    this.updatePlanes();
};

/**
 * Add a new plane
 * @returns {Plane|null} The new plane, or null if the capacity has been reached
 */
Symmetry.prototype.addPlane = function() {
    if (this.planes.length < this.MAX_PLANES) {
        const plane = new Plane();

        this.planes.push(plane);
        this.updatePlanes();

        return plane;
    }

    return null;
};

/**
 * Update the planes list
 */
Symmetry.prototype.updatePlanes = function() {
    this.geometry.setPlanes(this.planes);

    if (this.planes.length > 0)
        this.planeRenderer.setPlane(this.planes[this.planes.length - 1]);
    else
        this.planeRenderer.setPlane(null);
};

/**
 * Calculate the current MVP matrix
 */
Symmetry.prototype.updateMatrices = function() {
    this.matrixMVP.set(this.matrixProjection);
    this.matrixMVP.multiply(this.matrixModelView);
    this.matrixMVP.toArray(this.matrixBuffer);
};

/**
 * Draw the scene in this renderer
 * @param {number} deltaTime Passed time in seconds
 */
Symmetry.prototype.draw = function(deltaTime) {
    this.orbitControls.update(deltaTime);

    if (this.orbitControls.updated || this.geometry.updated) {
        this.orbitControls.setMatrix(this.matrixModelView);

        this.updateMatrices();

        this.gl.viewport(0, 0, this.width, this.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.geometry.draw(this.matrixBuffer);

        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);

        this.planeRenderer.draw(this.matrixBuffer);

        this.gl.disable(this.gl.BLEND);
    }
};

/**
 * Setup the renderer
 */
Symmetry.prototype.setup = function() {
    this.gl.clearColor(.1, .2, .3, 1);
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

/**
 * Free all resources
 */
Symmetry.prototype.free = function() {
    this.planeRenderer.free();
    this.geometry.free();
};