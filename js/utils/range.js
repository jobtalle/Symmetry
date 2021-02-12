/**
 * A range
 * @param {number} min The lower bound
 * @param {number} max The upper bound
 * @constructor
 */
const Range = function(min, max) {
    this.min = min;
    this.max = max;
};

/**
 * Clamp a number to this range
 * @param {number} n The number to clamp
 * @returns {number} The clamped number
 */
Range.prototype.clamp = function(n) {
    return Math.max(this.min, Math.min(this.max, n));
};