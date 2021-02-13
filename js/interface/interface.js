/**
 * The interface
 * @param {Symmetry} symmetry The symmetry object
 * @param {HTMLElement} root The element containing the root model interface
 * @param {HTMLElement} planes The element containing the symmetry plane interfaces
 * @constructor
 */
const Interface = function(symmetry, root, planes) {
    this.root = root;
    this.planes = planes;

    this.root.appendChild(new InterfaceRoot(symmetry.geometry));
};