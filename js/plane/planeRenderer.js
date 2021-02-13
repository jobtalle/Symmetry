/**
 * A plane renderer
 * @param {WebGL2RenderingContext} gl A WebGL rendering context
 * @constructor
 */
const PlaneRenderer = function(gl) {
    this.gl = gl;
    this.vaoPlane = gl.createVertexArray();
    this.vaoLines = gl.createVertexArray();
    this.bufferVertices = gl.createBuffer();
    this.bufferLines = gl.createBuffer();
    this.shaderPlane = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT_PLANE,
        ["mvp", "radius", "anchor", "x", "y"],
        ["position"]);
    this.shaderLines = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT_LINES,
        ["mvp", "radius", "anchor", "x", "y"],
        ["position"]);
    this.plane = null;

    gl.bindVertexArray(this.vaoPlane);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.shaderPlane["aPosition"]);
    gl.vertexAttribPointer(this.shaderPlane["aPosition"],
        2, gl.FLOAT, false, 8, 0);

    this.shaderPlane.use();

    gl.uniform1f(this.shaderPlane["uRadius"], this.RADIUS);

    gl.bindVertexArray(this.vaoLines);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferLines);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.createLines()), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.shaderLines["aPosition"]);
    gl.vertexAttribPointer(this.shaderLines["aPosition"],
        2, gl.FLOAT, false, 8, 0);

    this.shaderLines.use();

    gl.uniform1f(this.shaderLines["uRadius"], this.RADIUS);

    gl.bindVertexArray(null);
};

PlaneRenderer.prototype.RADIUS = 3;
PlaneRenderer.prototype.GRID_RESOLUTION = 9;

PlaneRenderer.prototype.SHADER_VERTEX = `#version 300 es
uniform float radius;
uniform vec3 anchor;
uniform vec3 x;
uniform vec3 y;
uniform mat4 mvp;

in vec2 position;

void main() {
  gl_Position = mvp * vec4(anchor + (x * position.x + y * position.y) * radius, 1.0);
}
`;

PlaneRenderer.prototype.SHADER_FRAGMENT_PLANE = `#version 300 es
out lowp vec4 color;

void main() {
  color = vec4(vec3(1.0), 0.1);
}
`;

PlaneRenderer.prototype.SHADER_FRAGMENT_LINES = `#version 300 es
out lowp vec4 color;

void main() {
  color = vec4(1.0);
}
`;

/**
 * Create the line grid mesh data
 * @returns {number[]} The line grid mesh data
 */
PlaneRenderer.prototype.createLines = function() {
    const data = [];

    for (let line = 0; line < this.GRID_RESOLUTION; ++line) {
        const f = 2 * line / (this.GRID_RESOLUTION - 1) - 1;

        data.push(
            f, -1,
            f, 1,
            -1, f,
            1, f);
    }

    return data;
};

/**
 * Set the plane to render
 * @param {Plane|null} plane A plane, or null if no plane should be rendered
 */
PlaneRenderer.prototype.setPlane = function(plane) {
    this.plane = plane;

    if (plane) {
        const normal = plane.getNormal();
        const x = normal.cross(Vector.UP).normalize();
        const y = normal.cross(x);

        this.shaderPlane.use();

        this.gl.uniform3f(this.shaderPlane["uAnchor"], plane.anchor.x, plane.anchor.y, plane.anchor.z);
        this.gl.uniform3f(this.shaderPlane["uX"], x.x, x.y, x.z);
        this.gl.uniform3f(this.shaderPlane["uY"], y.x, y.y, y.z);

        this.shaderLines.use();

        this.gl.uniform3f(this.shaderLines["uAnchor"], plane.anchor.x, plane.anchor.y, plane.anchor.z);
        this.gl.uniform3f(this.shaderLines["uX"], x.x, x.y, x.z);
        this.gl.uniform3f(this.shaderLines["uY"], y.x, y.y, y.z);
    }
};

/**
 * Draw the selected plane, if any plane is selected
 * @param {number[]} mvp The model view projection matrix
 */
PlaneRenderer.prototype.draw = function(mvp) {
    if (this.plane) {
        this.shaderPlane.use();

        this.gl.depthMask(false);

        this.gl.bindVertexArray(this.vaoPlane);
        this.gl.uniformMatrix4fv(this.shaderPlane["uMvp"], false, mvp);
        this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);

        this.gl.depthMask(true);

        this.shaderLines.use();

        this.gl.bindVertexArray(this.vaoLines);
        this.gl.uniformMatrix4fv(this.shaderLines["uMvp"], false, mvp);
        this.gl.drawArrays(this.gl.LINES, 0, this.GRID_RESOLUTION << 2);
    }
};

/**
 * Free all resources
 */
PlaneRenderer.prototype.free = function() {
    this.gl.deleteBuffer(this.bufferVertices);
    this.gl.deleteBuffer(this.bufferLines);
    this.gl.deleteVertexArray(this.vaoPlane);
    this.gl.deleteVertexArray(this.vaoLines);
    this.shaderPlane.free();
    this.shaderLines.free();
};