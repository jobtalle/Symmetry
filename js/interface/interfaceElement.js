const InterfaceElement = function() {

};

/**
 * Clear an element
 * @param {HTMLElement} element The element to clear
 */
InterfaceElement.prototype.clearElement = function(element) {
    while (element.firstChild)
        element.removeEventListener(element.firstChild);
};

/**
 * Create a title element
 * @param {string} text The title text
 * @returns {HTMLHeadingElement} The element
 */
InterfaceElement.prototype.createTitle = function(text) {
    const element = document.createElement("h2");

    element.appendChild(document.createTextNode(text));

    return element;
};

/**
 * Create a slider
 * @param {string} name The slider name
 * @param {Range} range The range
 * @param {number} initial The initial value
 * @param {number} step The resolution
 * @param {Function} onUpdate A function to execute when the slider has moved
 * @returns {HTMLLabelElement} The slider
 */
InterfaceElement.prototype.createSlider = function(name, range, initial, step, onUpdate) {
    const element = document.createElement("label");
    const slider = document.createElement("input");

    slider.type = "range";
    slider.min = range.min.toString();
    slider.max = range.max.toString();
    slider.value = initial.toString();
    slider.step = step.toString();
    slider.oninput = () => onUpdate(slider.valueAsNumber);

    element.appendChild(document.createTextNode(name));
    element.appendChild(slider);

    return element;
};