/**
 * The root model interface
 * @param {Geometry} geometry The geometry object
 * @returns {HTMLElement} The interface
 * @constructor
 */
const InterfaceRoot = function(geometry) {
    return this.createCategory(this.TITLE, this.createElement(geometry));
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
    };

    return element;
};

/**
 * Create the sphere option
 * @param {HTMLDivElement} parameters The div to put parameters in
 * @param {Geometry} geometry The geometry object
 * @returns {HTMLOptionElement} The sphere option
 */
InterfaceRoot.prototype.createOptionSphere = function(parameters, geometry) {
    const element = document.createElement("option");
    let radius = ModelSphere.prototype.DEFAULT_RADIUS;
    let subdivisions = ModelSphere.prototype.DEFAULT_SUBDIVISIONS;

    const update = () => {
        geometry.setMesh(new ModelSphere(geometry.gl, radius, subdivisions));
    };

    element.appendChild(document.createTextNode("Sphere"));
    element.onselect = () => {
        this.clearElement(parameters);

        parameters.appendChild(this.createSlider(
            "Radius: ",
            new Range(.15, 1.5),
            radius,
            .01,
            value => {
                radius = value;

                update();
            }
        ));

        parameters.appendChild(this.createSlider(
            "Subdivisions: ",
            new Range(0, 2),
            subdivisions,
            1,
            value => {
                subdivisions = value;

                update();
            }
        ));

        update();
    };

    return element;
};

/**
 * Create the cylinder option
 * @param {HTMLDivElement} parameters The div to put parameters in
 * @param {Geometry} geometry The geometry object
 * @returns {HTMLOptionElement} The cylinder option
 */
InterfaceRoot.prototype.createOptionCylinder = function(parameters, geometry) {
    const element = document.createElement("option");
    let radius = ModelCylinder.prototype.DEFAULT_RADIUS;
    let height = ModelCylinder.prototype.DEFAULT_HEIGHT;
    let subdivisions = ModelCylinder.prototype.DEFAULT_SUBDIVISIONS;

    const update = () => {
        geometry.setMesh(new ModelCylinder(geometry.gl, radius, height, subdivisions));
    };

    element.appendChild(document.createTextNode("Cylinder"));
    element.onselect = () => {
        this.clearElement(parameters);

        parameters.appendChild(this.createSlider(
            "Radius: ",
            new Range(.15, 1.5),
            radius,
            .01,
            value => {
                radius = value;

                update();
            }
        ));

        parameters.appendChild(this.createSlider(
            "Height: ",
            new Range(.15, 2),
            height,
            .01,
            value => {
                height = value;

                update();
            }
        ));

        parameters.appendChild(this.createSlider(
            "Subdivisions: ",
            new Range(3, 24),
            subdivisions,
            1,
            value => {
                subdivisions = value;

                update();
            }
        ));

        update();
    };

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
    element.appendChild(this.createOptionSphere(parameters, geometry));
    element.appendChild(this.createOptionCylinder(parameters, geometry));

    element.firstChild.onselect();

    element.onchange = () => {
        element.children[element.selectedIndex].onselect();
    };

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

    element.appendChild(this.createDropdown(parameters, geometry));
    element.appendChild(parameters);

    return element;
};