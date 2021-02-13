/**
 * A plane
 * @param {Vector} [anchor] The plane anchor
 * @param {number} [rotationX] The X axis rotation
 * @param {number} [rotationY] The Y axis rotation
 * @constructor
 */
const Plane = function(anchor = new Vector(), rotationX = 0, rotationY = 0) {
    this.anchor = anchor;
    this.rotationX = rotationX;
    this.rotationY = rotationY;
};

/**
 * Get the normal for this plane
 * @returns {Vector} The surface normal for this plane
 */
Plane.prototype.getNormal = function() {
    return new Vector(
        Math.cos(this.rotationY) * Math.cos(this.rotationX),
        Math.sin(this.rotationX),
        Math.sin(this.rotationY) * Math.cos(this.rotationX));
};