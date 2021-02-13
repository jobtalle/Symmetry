/**
 * The rendering interface
 * @param {Geometry} geometry The geometry object
 * @returns {HTMLElement} The interface
 * @constructor
 */
const InterfaceRendering = function(geometry) {
    return this.createCategory(this.TITLE, this.createElement(geometry));
};

InterfaceRendering.prototype = Object.create(InterfaceElement.prototype);
InterfaceRendering.prototype.TITLE = "Rendering";

/**
 * Create the element
 * @param {Geometry} geometry The geometry object
 * @returns {HTMLElement} The HTML element
 */
InterfaceRendering.prototype.createElement = function(geometry) {
    const element = document.createElement("div");

    element.appendChild(this.createCheckBox(
        "Edges: ",
        false,
        checked => {
            geometry.edges = checked;
        }
    ));

    return element;
};