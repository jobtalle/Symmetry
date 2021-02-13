/**
 * The plane list interface
 * @param {Symmetry} symmetry The symmetry object
 * @constructor
 */
const InterfacePlanes = function(symmetry) {
    return this.createCategory(this.TITLE, this.createElement(symmetry));
};

InterfacePlanes.prototype = Object.create(InterfaceElement.prototype);
InterfacePlanes.prototype.TITLE = "Planes";

/**
 * Create the element
 * @param {Symmetry} symmetry The symmetry object
 * @returns {HTMLElement} The HTML element
 */
InterfacePlanes.prototype.createElement = function(symmetry) {
    const element = document.createElement("div");

    for (const plane of symmetry.planes) {
        const planeInterface = new InterfacePlane(
            symmetry,
            plane,
            () => {
                element.removeChild(planeInterface);
            },
            () => {
                planeInterface.parentNode.insertBefore(planeInterface, planeInterface.previousElementSibling);
            },
            () => {
                planeInterface.parentNode.insertBefore(planeInterface.nextElementSibling, planeInterface);
            });

        element.appendChild(planeInterface);
    }

    return element;
};