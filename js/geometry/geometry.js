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
        ["mvp", "planeAnchors", "planeNormals", "sides"],
        ["position", "normal"]);
    this.mesh = new ModelCube(gl);
    this.vao = gl.createVertexArray();
    this.planeCount = 0;

    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.bufferVertices);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.bufferIndices);
    gl.enableVertexAttribArray(this.shader["aPosition"]);
    gl.vertexAttribPointer(this.shader["aPosition"], 3, gl.FLOAT, false, 24, 0);
    gl.enableVertexAttribArray(this.shader["aNormal"]);
    gl.vertexAttribPointer(this.shader["aNormal"], 3, gl.FLOAT, false, 24, 12);
};

Geometry.prototype.SHADER_VERTEX = `#version 300 es
#define PLANES 4

uniform mat4 mvp;
uniform mediump vec3 planeAnchors[PLANES];
uniform mediump vec3 planeNormals[PLANES];
uniform mediump uint sides;
uniform uint planes;

in vec3 position;
in vec3 normal;

out vec3 vNormal;
out vec3 vPosition;

void main() {  
  vec3 transformedPosition = position;
  vec3 transformedNormal = normal;
  
  for (int plane = 0; plane < PLANES; plane += 1) {
    float planeDistance = dot(planeNormals[plane], transformedPosition - planeAnchors[plane]);
    
    if ((sides >> uint(plane)) % 2u == 1u) {    
      transformedPosition -= (planeDistance + planeDistance) * planeNormals[plane];
      transformedNormal = reflect(transformedNormal, planeNormals[plane]);
    }
  }
  
  vNormal = transformedNormal;
  vPosition = position;

  gl_Position = mvp * vec4(transformedPosition, 1.0);
}
`;

Geometry.prototype.SHADER_FRAGMENT = `#version 300 es
#define PLANES 4

uniform mediump vec3 planeAnchors[PLANES];
uniform mediump vec3 planeNormals[PLANES];
uniform mediump uint sides;

in mediump vec3 vNormal;
in mediump vec3 vPosition;

out lowp vec4 color;

void main() {
  mediump vec3 transformedPosition = vPosition;
  
  for (int plane = 0; plane < PLANES; plane += 1) {
    mediump float planeDistance = dot(planeNormals[plane], transformedPosition - planeAnchors[plane]);
    
    if ((sides >> uint(plane)) % 2u == 1u)
      transformedPosition -= (planeDistance + planeDistance) * planeNormals[plane];
    
    if (planeDistance < 0.0)
      discard;
  }

  color = vec4(vNormal * 0.5 + 0.5, 1.0);
}
`;

/**
 * Set the cutting planes
 * @param {Plane[]} planes All separating planes
 */
Geometry.prototype.setPlanes = function(planes) {
    const anchors = [];
    const normals = [];

    for (const plane of planes) {
        anchors.push(plane.anchor.x, plane.anchor.y, plane.anchor.z);
        normals.push(plane.normal.x, plane.normal.y, plane.normal.z);
    }

    this.shader.use();

    this.gl.uniform3fv(this.shader["uPlaneAnchors"], anchors);
    this.gl.uniform3fv(this.shader["uPlaneNormals"], normals);

    this.planeCount = planes.length;
};

/**
 * Draw the geometry
 * @param {number[]} mvp The model view projection matrix
 */
Geometry.prototype.draw = function(mvp) {
    this.shader.use();

    this.gl.bindVertexArray(this.vao);

    this.gl.uniformMatrix4fv(this.shader["uMvp"], false, mvp);

    for (let sides = 0, sideCount = 1 << this.planeCount; sides < sideCount; ++sides) {
        this.gl.uniform1ui(this.shader["uSides"], sides);

        this.gl.drawElements(this.gl.TRIANGLES, this.mesh.indexCount, this.gl.UNSIGNED_SHORT, 0);
    }
};

/**
 * Free the geometry
 */
Geometry.prototype.free = function() {
    this.gl.deleteVertexArray(this.vao);
    this.shader.free();
    this.mesh.free();
};