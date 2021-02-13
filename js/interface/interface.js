/**
 * The interface
 * @param {Symmetry} symmetry The symmetry object
 * @param {HTMLElement} rendering The element containing the rendering interface
 * @param {HTMLElement} root The element containing the root model interface
 * @param {HTMLElement} planes The element containing the symmetry plane interfaces
 * @constructor
 */
const Interface = function(symmetry, rendering, root, planes) {
    rendering.appendChild(new InterfaceRendering(symmetry.geometry));
    root.appendChild(new InterfaceRoot(symmetry.geometry));
    planes.appendChild(new InterfacePlanes(symmetry));
};