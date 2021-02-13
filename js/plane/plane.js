/**
 * A plane
 * @param {Vector} anchor The plane anchor
 * @param {Vector} normal The plane normal
 * @constructor
 */
const Plane = function(anchor, normal) {
    this.anchor = anchor;
    this.normal = normal;
};