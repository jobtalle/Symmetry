/**
 * The root model interface
 * @param {Geometry} geometry The geometry object
 * @constructor
 */
const InterfaceRoot = function(geometry) {
    return this.createElement(geometry);
};

InterfaceRoot.prototype = Object.create(InterfaceElement.prototype);
InterfaceRoot.prototype.TITLE = "Primitive";

/**
 * Create the cube option
 * @param {HTMLDivElement} parameters The div to put parameters in
 * @param {Geometry} geometry The geometry object
 * @returns {HTMLOptionElement} The cube option
 */
InterfaceRoot.prototype.createOptionCube = function(parameters, geometry) {
    const element = document.createElement("option");
    let size = ModelCube.prototype.DEFAULT_SIZE;

    const update = () => {
        geometry.setMesh(new ModelCube(geometry.gl, size));
    };

    element.appendChild(document.createTextNode("Cube"));
    element.onselect = () => {
        this.clearElement(parameters);

        parameters.appendChild(this.createSlider(
            "Size: ",
            new Range(.3, 3),
            size,
            .01,
            value => {
                size = value;
                update();
            }
        ));

        update();
    }

    return element;
};

/**
 * Create the dropdown menu of primitive options
 * @param {HTMLDivElement} parameters The div to put parameters in
 * @param {Geometry} geometry The geometry object
 * @returns {HTMLSelectElement} The dropdown
 */
InterfaceRoot.prototype.createDropdown = function(parameters, geometry) {
    const element = document.createElement("select");

    element.appendChild(this.createOptionCube(parameters, geometry));
    element.firstChild.onselect();

    return element;
};

/**
 * Create the element
 * @param {Geometry} geometry The geometry object
 * @returns {HTMLElement} The HTML element
 */
InterfaceRoot.prototype.createElement = function(geometry) {
    const element = document.createElement("div");
    const parameters = document.createElement("div");

    element.appendChild(this.createTitle(this.TITLE));
    element.appendChild(this.createDropdown(parameters, geometry));
    element.appendChild(parameters);

    return element;
};