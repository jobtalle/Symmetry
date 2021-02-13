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
    const planes = document.createElement("div");
    const add = document.createElement("button");
    const randomize = document.createElement("button");

    const makeInterface = plane => {
        const planeInterface = new InterfacePlane(
            symmetry,
            plane,
            () => {
                planes.removeChild(planeInterface);
            },
            () => {
                planeInterface.parentNode.insertBefore(planeInterface, planeInterface.previousElementSibling);
            },
            () => {
                planeInterface.parentNode.insertBefore(planeInterface.nextElementSibling, planeInterface);
            });

        return planeInterface;
    };

    for (const plane of symmetry.planes)
        planes.appendChild(makeInterface(plane));

    add.appendChild(document.createTextNode("Add plane"));
    add.onclick = () => {
        const plane = symmetry.addPlane();

        if (plane)
            planes.appendChild(makeInterface(plane));
    };

    randomize.appendChild(document.createTextNode("Randomize"));
    randomize.onclick = () => {
        symmetry.randomize();

        this.clearElement(planes);

        for (const plane of symmetry.planes)
            planes.appendChild(makeInterface(plane));
    };

    element.appendChild(randomize);
    element.appendChild(planes);
    element.appendChild(add);

    return element;
};