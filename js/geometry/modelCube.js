/**
 * A cube model
 * @param {WebGL2RenderingContext} gl A WebGL rendering context
 * @param {number} size The length of the edges
 * @constructor
 */
const ModelCube = function(gl, size = .2) {
    const halfSize = size * .5;
    const vertices = [
        // Front
        -halfSize, -halfSize, -halfSize,
        0, 0, -1,
        halfSize, -halfSize, -halfSize,
        0, 0, -1,
        halfSize, halfSize, -halfSize,
        0, 0, -1,
        -halfSize, halfSize, -halfSize,
        0, 0, -1,

        // Right
        halfSize, -halfSize, -halfSize,
        1, 0, 0,
        halfSize, -halfSize, halfSize,
        1, 0, 0,
        halfSize, halfSize, halfSize,
        1, 0, 0,
        halfSize, halfSize, -halfSize,
        1, 0, 0,

        // Back
        halfSize, -halfSize, halfSize,
        0, 0, 1,
        -halfSize, -halfSize, halfSize,
        0, 0, 1,
        -halfSize, halfSize, halfSize,
        0, 0, 1,
        halfSize, halfSize, halfSize,
        0, 0, 1,

        // Left
        -halfSize, -halfSize, halfSize,
        -1, 0, 0,
        -halfSize, -halfSize, -halfSize,
        -1, 0, 0,
        -halfSize, halfSize, -halfSize,
        -1, 0, 0,
        -halfSize, halfSize, halfSize,
        -1, 0, 0,

        // Top
        -halfSize, halfSize, -halfSize,
        0, 1, 0,
        halfSize, halfSize, -halfSize,
        0, 1, 0,
        halfSize, halfSize, halfSize,
        0, 1, 0,
        -halfSize, halfSize, halfSize,
        0, 1, 0,

        // Bottom
        -halfSize, -halfSize, halfSize,
        0, -1, 0,
        halfSize, -halfSize, halfSize,
        0, -1, 0,
        halfSize, -halfSize, -halfSize,
        0, -1, 0,
        -halfSize, -halfSize, -halfSize,
        0, -1, 0
    ];

    const indices = [
        0, 1, 2,
        2, 3, 0,

        4, 5, 6,
        6, 7, 4,

        8, 9, 10,
        10, 11, 8,

        12, 13, 14,
        14, 15, 12,

        16, 17, 18,
        18, 19, 16,

        20, 21, 22,
        22, 23, 20
    ];

    Mesh.call(this, gl, vertices, indices);
};

ModelCube.prototype = Object.create(Mesh.prototype);