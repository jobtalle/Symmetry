/**
 * A cylinder model
 * @param {WebGL2RenderingContext} gl A WebGL rendering context
 * @param {number} radius The cylinder radius
 * @param {number} height The cylinder height
 * @param {number} steps The number of steps
 * @constructor
 */
const ModelCylinder = function(
    gl,
    radius = this.DEFAULT_RADIUS,
    height= this.DEFAULT_HEIGHT,
    steps= this.DEFAULT_SUBDIVISIONS) {
    const halfHeight = height * .5;
    const vertices = [];
    const indices = [];

    for (let step = 0; step < steps; ++step) {
        const next = (step + 1) % steps;
        const nextNext = (next + 1) % steps;
        const angle = Math.PI * 2 * step / steps;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        vertices.push(
            x, -halfHeight, z, 0, -1, 0,
            x, -halfHeight, z, x / radius, 0, z / radius,
            x, halfHeight, z, x / radius, 0, z / radius,
            x, halfHeight, z, 0, 1, 0);

        indices.push(
            (step << 2) + 1,
            (step << 2) + 2,
            (next << 2) + 2,
            (next << 2) + 2,
            (next << 2) + 1,
            (step << 2) + 1);

        if (step < steps - 2)
            indices.push(
                0,
                (next << 2),
                (nextNext << 2),
                3,
                (next << 2) + 3,
                (nextNext << 2) + 3);
    }

    Mesh.call(this, gl, vertices, indices);
};

ModelCylinder.prototype = Object.create(Mesh.prototype);
ModelCylinder.prototype.DEFAULT_RADIUS = .5;
ModelCylinder.prototype.DEFAULT_HEIGHT = 1;
ModelCylinder.prototype.DEFAULT_SUBDIVISIONS = 12;