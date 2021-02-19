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
    this.edges = false;
    this.updated = true;
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
out float vDistances[PLANES];

void main() {  
  vec3 transformedPosition = position;
  vec3 transformedNormal = normal;
  
  for (int plane = 0; plane < PLANES; plane += 1) {
    float planeDistance = dot(planeNormals[plane], transformedPosition - planeAnchors[plane]);
    
    vDistances[plane] = planeDistance;
    
    if ((sides >> uint(plane)) % 2u == 1u) {    
      transformedPosition -= (planeDistance + planeDistance) * planeNormals[plane];
      transformedNormal = reflect(transformedNormal, planeNormals[plane]);
    }
  }
  
  vNormal = transformedNormal;

  gl_Position = mvp * vec4(transformedPosition, 1.0);
}
`;

Geometry.prototype.SHADER_FRAGMENT = `#version 300 es
uniform mediump float edgeThreshold;

in mediump vec3 vNormal;
in mediump float vDistances[PLANES];

out lowp vec4 color;

void main() {
  for (int plane = 0; plane < PLANES; plane += 1)
    if (vDistances[plane] < edgeThreshold)
      discard;

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
            ["mvp", "planeAnchors", "planeNormals", "sides", "edgeThreshold"],
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

    this.gl.bindVertexArray(null);
};

/**
 * Assign a new mesh
 * @param {Mesh} mesh The mesh
 */
Geometry.prototype.setMesh = function(mesh) {
    if (this.mesh)
        this.mesh.free();

    this.mesh = mesh;
    this.updated = true;

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
        const normal = plane.getNormal();

        anchors.push(plane.anchor.x, plane.anchor.y, plane.anchor.z);
        normals.push(normal.x, normal.y, normal.z);
    }

    if (planes.length !== 0) {
        this.shaders[planes.length - 1].use();

        this.gl.uniform3fv(this.shaders[planes.length - 1]["uPlaneAnchors"], anchors);
        this.gl.uniform3fv(this.shaders[planes.length - 1]["uPlaneNormals"], normals);
    }
    else {
        this.shaders[0].use();

        this.gl.uniform3f(this.shaders[0]["uPlaneAnchors"], 0, 0, 0);
        this.gl.uniform3f(this.shaders[0]["uPlaneNormals"], 0, 1, 0);
    }

    this.planeCount = planes.length;
    this.updated = true;
};

/**
 * Draw the geometry
 * @param {number[]} mvp The model view projection matrix
 */
Geometry.prototype.draw = function(mvp) {
    if (this.mesh === null)
        return;

    const shader = this.shaders[Math.max(0, this.planeCount - 1)];

    shader.use();

    this.gl.bindVertexArray(this.vaos[Math.max(0, this.planeCount - 1)]);

    this.gl.uniformMatrix4fv(shader["uMvp"], false, mvp);
    this.gl.uniform1f(shader["uEdgeThreshold"], this.edges && this.planeCount > 0 ? .01 : 0);

    for (let sides = 0, sideCount = Math.max(2, 1 << this.planeCount); sides < sideCount; ++sides) {
        this.gl.uniform1ui(shader["uSides"], sides);

        this.gl.drawElements(this.gl.TRIANGLES, this.mesh.indexCount, this.gl.UNSIGNED_SHORT, 0);
    }

    this.updated = false;
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