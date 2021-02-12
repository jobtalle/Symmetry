/**
 * A 3D mesh
 * @param {WebGL2RenderingContext} gl A WebGL rendering context
 * @param {number[]} vertices The vertices
 * @param {number[]} indices The indices
 * @constructor
 */
const Mesh = function(gl, vertices, indices) {
    this.gl = gl;
    this.indexCount = indices.length;
    this.bufferVertices = gl.createBuffer();
    this.bufferIndices = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferIndices);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
};

/**
 * Free mesh data
 */
Mesh.prototype.free = function() {
    this.gl.deleteBuffer(this.bufferVertices);
    this.gl.deleteBuffer(this.bufferIndices);
};