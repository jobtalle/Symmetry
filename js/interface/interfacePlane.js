/**
 * A plane interface
 * @param {Symmetry} symmetry The symmetry object
 * @param {Plane} plane The plane to edit
 * @param {Function} removeMe A function that removes this interface from the GUI
 * @constructor
 */
const InterfacePlane = function(symmetry, plane, removeMe) {
    return this.createCategory(this.TITLE, this.createElement(symmetry, plane, removeMe), true);
};

InterfacePlane.prototype = Object.create(InterfaceElement.prototype);
InterfacePlane.prototype.TITLE = "Symmetry plane";

/**
 * Create the element
 * @param {Symmetry} symmetry The symmetry object
 * @param {Plane} plane The plane to edit
 * @param {Function} removeMe A function that removes this interface from the GUI
 * @returns {HTMLElement} The HTML element
 */
InterfacePlane.prototype.createElement = function(symmetry, plane, removeMe) {
    const element = document.createElement("div");
    const buttonDelete = document.createElement("button");

    buttonDelete.onclick = () => {
        symmetry.planes.splice(symmetry.planes.indexOf(plane), 1);
        symmetry.updatePlanes();

        removeMe();
    };

    buttonDelete.appendChild(document.createTextNode("Delete"));

    element.appendChild(buttonDelete);

    return element;
};