/**
 * The geometry
 * @param {WebGL2RenderingContext} gl A WebGL rendering context
 * @param {number} maxPlanes The maximum number of planes
 * @constructor
 */
const Geometry = function(gl, maxPlanes) {
    this.gl = gl;
    this.shaders = this.makeShaders(gl, maxPlanes);
    this.vaos = new Array(maxPlanes).fill(null);
    this.mesh = null;
    this.planeCount = 0;
};

Geometry.prototype.SHADER_VERTEX = `#version 300 es
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
 * Make the shaders
 * @param {WebGL2RenderingContext} gl A WebGL rendering context
 * @param {number} maxPlanes The maximum number of planes
 * @return {Shader[]} The shaders
 */
Geometry.prototype.makeShaders = function(gl, maxPlanes) {
    const shaders = new Array(maxPlanes);

    for (let planes = 1; planes <= maxPlanes; ++planes)
        shaders[planes - 1] = new Shader(
            gl,
            this.SHADER_VERTEX.replaceAll("PLANES", planes.toString()),
            this.SHADER_FRAGMENT.replaceAll("PLANES", planes.toString()),
            ["mvp", "planeAnchors", "planeNormals", "sides"],
            ["position", "normal"]);

    return shaders;
};

/**
 * Update the vertex array objects
 */
Geometry.prototype.updateVAOs = function() {
    for (const vao of this.vaos) if (vao)
        this.gl.deleteVertexArray(vao);

    for (let shader = 0; shader < this.shaders.length; ++shader) {
        this.vaos[shader] = this.gl.createVertexArray();

        this.gl.bindVertexArray(this.vaos[shader]);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mesh.bufferVertices);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.mesh.bufferIndices);
        this.gl.enableVertexAttribArray(this.shaders[shader]["aPosition"]);
        this.gl.vertexAttribPointer(this.shaders[shader]["aPosition"],
            3, this.gl.FLOAT, false, 24, 0);
        this.gl.enableVertexAttribArray(this.shaders[shader]["aNormal"]);
        this.gl.vertexAttribPointer(this.shaders[shader]["aNormal"],
            3, this.gl.FLOAT, false, 24, 12);
    }
};

/**
 * Assign a new mesh
 * @param {Mesh} mesh The mesh
 */
Geometry.prototype.setMesh = function(mesh) {
    if (this.mesh)
        this.mesh.free();

    this.mesh = mesh;

    this.updateVAOs();
};

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

    this.shaders[planes.length - 1].use();

    this.gl.uniform3fv(this.shaders[planes.length - 1]["uPlaneAnchors"], anchors);
    this.gl.uniform3fv(this.shaders[planes.length - 1]["uPlaneNormals"], normals);

    this.planeCount = planes.length;
};

/**
 * Draw the geometry
 * @param {number[]} mvp The model view projection matrix
 */
Geometry.prototype.draw = function(mvp) {
    if (this.mesh === null)
        return;

    const shader = this.shaders[this.planeCount - 1];

    shader.use();

    this.gl.bindVertexArray(this.vaos[this.planeCount - 1]);

    this.gl.uniformMatrix4fv(shader["uMvp"], false, mvp);

    for (let sides = 0, sideCount = 1 << this.planeCount; sides < sideCount; ++sides) {
        this.gl.uniform1ui(shader["uSides"], sides);

        this.gl.drawElements(this.gl.TRIANGLES, this.mesh.indexCount, this.gl.UNSIGNED_SHORT, 0);
    }
};

/**
 * Free the geometry
 */
Geometry.prototype.free = function() {
    for (const vao of this.vaos) if (vao)
        this.gl.deleteVertexArray(vao);

    for (const shader of this.shaders)
        shader.free();

    if (this.mesh)
        this.mesh.free();
};