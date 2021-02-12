/**
 * The geometry
 * @param {WebGL2RenderingContext} gl A WebGL rendering context
 * @constructor
 */
const Geometry = function(gl) {
    this.gl = gl;
    this.shader = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["mvp"],
        ["position", "normal"]);
    this.mesh = new ModelCube(gl);
    this.vao = gl.createVertexArray();

    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.bufferVertices);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.bufferIndices);
    gl.enableVertexAttribArray(this.shader["aPosition"]);
    gl.vertexAttribPointer(this.shader["aPosition"], 3, gl.FLOAT, false, 24, 0);
    gl.enableVertexAttribArray(this.shader["aNormal"]);
    gl.vertexAttribPointer(this.shader["aNormal"], 3, gl.FLOAT, false, 24, 12);
};

Geometry.prototype.SHADER_VERTEX = `#version 300 es
uniform mat4 mvp;

in vec3 position;
in vec3 normal;

out vec3 vNormal;

void main() {
  vNormal = normal;

  gl_Position = mvp * vec4(position, 1.0);
}
`;

Geometry.prototype.SHADER_FRAGMENT = `#version 300 es
in mediump vec3 vNormal;

out lowp vec4 color;

void main() {
  color = vec4(vNormal * 0.5 + 0.5, 1.0);
}
`;

/**
 * Draw the geometry
 * @param {number[]} mvp The model view projection matrix
 */
Geometry.prototype.draw = function(mvp) {
    this.shader.use();

    this.gl.uniformMatrix4fv(this.shader["uMvp"], false, mvp);

    this.gl.bindVertexArray(this.vao);
    this.gl.drawElements(this.gl.TRIANGLES, this.mesh.indexCount, this.gl.UNSIGNED_SHORT, 0);
};

/**
 * Free the geometry
 */
Geometry.prototype.free = function() {
    this.gl.deleteVertexArray(this.vao);
    this.shader.free();
    this.mesh.free();
};