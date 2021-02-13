/**
 * A plane renderer
 * @param {WebGL2RenderingContext} gl A WebGL rendering context
 * @constructor
 */
const PlaneRenderer = function(gl) {
    this.gl = gl;
    this.plane = null;
    this.vao = gl.createVertexArray();
    this.vertices = gl.createBuffer();
    this.shader = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["mvp", "radius", "anchor", "x", "y"],
        ["position"]);

    gl.bindVertexArray(this.vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.shader["aPosition"]);
    gl.vertexAttribPointer(this.shader["aPosition"],
        2, gl.FLOAT, false, 8, 0);

    gl.bindVertexArray(null);

    this.shader.use();

    gl.uniform1f(this.shader["uRadius"], this.RADIUS);
};

PlaneRenderer.prototype.RADIUS = 3;

PlaneRenderer.prototype.SHADER_VERTEX = `#version 300 es
uniform float radius;
uniform vec3 anchor;
uniform vec3 x;
uniform vec3 y;
uniform mat4 mvp;

in vec2 position;

out vec3 vColor;

void main() {
  vColor = vec3(position, 1.0);
  gl_Position = mvp * vec4(anchor + (x * position.x + y * position.y) * radius, 1.0);
}
`;

PlaneRenderer.prototype.SHADER_FRAGMENT = `#version 300 es
in lowp vec3 vColor;

out lowp vec4 color;

void main() {
  color = vec4(vColor * 0.5 + 0.5, 0.3);
}
`;

/**
 * Set the plane to render
 * @param {Plane|null} plane A plane, or null if no plane should be rendered
 */
PlaneRenderer.prototype.setPlane = function(plane) {
    this.plane = plane;

    const x = plane.normal.cross(Vector.UP).normalize();
    const y = plane.normal.cross(x);

    this.shader.use();

    this.gl.uniform3f(this.shader["uAnchor"], plane.anchor.x, plane.anchor.y, plane.anchor.z);
    this.gl.uniform3f(this.shader["uX"], x.x, x.y, x.z);
    this.gl.uniform3f(this.shader["uY"], y.x, y.y, y.z);
};

/**
 * Draw the selected plane, if any plane is selected
 * @param {number[]} mvp The model view projection matrix
 */
PlaneRenderer.prototype.draw = function(mvp) {
    this.shader.use();

    this.gl.bindVertexArray(this.vao);

    this.gl.uniformMatrix4fv(this.shader["uMvp"], false, mvp);

    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);
};

/**
 * Free all resources
 */
PlaneRenderer.prototype.free = function() {
    this.gl.deleteBuffer(this.vertices);
    this.gl.deleteVertexArray(this.vao);
    this.shader.free();
};