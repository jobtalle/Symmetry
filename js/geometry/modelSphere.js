/**
 * A sphere model
 * @param {WebGL2RenderingContext} gl A WebGL rendering context
 * @param {number} radius The sphere radius
 * @param {number} subdivisions The number of subdivisions
 * @constructor
 */
const ModelSphere = function(
    gl,
    radius = this.DEFAULT_RADIUS,
    subdivisions = this.DEFAULT_SUBDIVISIONS) {
    const points = [];
    const vertices = [];
    const indices = [];
    
    let w = (1 + Math.sqrt(5)) * 0.5;
    const h = 1.0 / Math.sqrt(1 + w * w);

    w *= h;

    points.push(new Vector(-h, w, 0));
    points.push(new Vector(h, w, 0));
    points.push(new Vector(-h, -w, 0));
    points.push(new Vector(h, -w, 0));

    points.push(new Vector(0, -h, w));
    points.push(new Vector(0, h, w));
    points.push(new Vector(0, -h, -w));
    points.push(new Vector(0, h, -w));

    points.push(new Vector(w, 0, -h));
    points.push(new Vector(w, 0, h));
    points.push(new Vector(-w, 0, -h));
    points.push(new Vector(-w, 0, h));

    indices.push(0, 11, 5);
    indices.push(0, 5, 1);
    indices.push(0, 1, 7);
    indices.push(0, 7, 10);
    indices.push(0, 10, 11);

    indices.push(1, 5, 9);
    indices.push(5, 11, 4);
    indices.push(11, 10, 2);
    indices.push(10, 7, 6);
    indices.push(7, 1, 8);

    indices.push(3, 9, 4);
    indices.push(3, 4, 2);
    indices.push(3, 2, 6);
    indices.push(3, 6, 8);
    indices.push(3, 8, 9);

    indices.push(4, 9, 5);
    indices.push(2, 4, 11);
    indices.push(6, 2, 10);
    indices.push(8, 6, 7);
    indices.push(9, 8, 1);

    for (let subdivision = 0; subdivision < subdivisions; ++subdivision)
        this.subdivide(points, indices);

    for (const point of points)
        vertices.push(
            point.x * radius, point.y * radius, point.z * radius,
            point.x, point.y, point.z);

    Mesh.call(this, gl, vertices, indices);
};

ModelSphere.prototype = Object.create(Mesh.prototype);
ModelSphere.prototype.DEFAULT_RADIUS = .5;
ModelSphere.prototype.DEFAULT_SUBDIVISIONS = 2;

/**
 * Subdivide a sphere
 * @param {Vector[]} points Normalized sphere points
 * @param {number[]} indices Triangle indices
 */
ModelSphere.prototype.subdivide = function(points, indices) {
    const indexCount = indices.length / 3;
    const sourceIndices = indices.slice();

    // points.length = 0;
    indices.length = 0;

    for (let index = 0; index < indexCount; index++) {
        const offset = index * 3;

        const ia = sourceIndices[offset];
        const ib = sourceIndices[offset + 1];
        const ic = sourceIndices[offset + 2];
        const iab = points.length;
        const ibc = points.length + 1;
        const ica = points.length + 2;

        points.push(points[ia].copy().add(points[ib].copy()).normalize());
        points.push(points[ib].copy().add(points[ic].copy()).normalize());
        points.push(points[ic].copy().add(points[ia].copy()).normalize());

        indices.push(ia, iab, ica);
        indices.push(ib, ibc, iab);
        indices.push(ic, ica, ibc);
        indices.push(iab, ibc, ica);
    }
};