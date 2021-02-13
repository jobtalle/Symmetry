const InterfaceElement = function() {

};

InterfaceElement.prototype.CLASS_CATEGORY = "category";
InterfaceElement.prototype.CLASS_SUBCATEGORY = "subcategory";
InterfaceElement.prototype.CLASS_CATEGORY_CONTENT = "content";
InterfaceElement.prototype.CLASS_HEADER = "header";
InterfaceElement.prototype.CLASS_COLLAPSED = "collapsed";

/**
 * Clear an element
 * @param {HTMLElement} element The element to clear
 */
InterfaceElement.prototype.clearElement = function(element) {
    while (element.firstChild)
        element.removeChild(element.firstChild);
};

/**
 * Create a category that can be collapsed
 * @param {string} title The category title
 * @param {HTMLElement} content The HTML content for this category
 * @param {boolean} [subcategory] True if this is a subcategory
 * @returns {HTMLElement} The category element
 */
InterfaceElement.prototype.createCategory = function(title, content, subcategory = false) {
    const element = document.createElement("div");
    const header = document.createElement("div");
    const toggle = document.createElement("button");

    content.className = this.CLASS_CATEGORY_CONTENT;

    toggle.onclick = () => element.classList.toggle(this.CLASS_COLLAPSED);

    header.className = this.CLASS_HEADER;

    header.appendChild(subcategory ? this.createSubTitle(title) : this.createTitle(title));
    header.appendChild(toggle);

    element.className = this.CLASS_CATEGORY;

    if (subcategory)
        element.classList.add(this.CLASS_SUBCATEGORY);

    element.appendChild(header);
    element.appendChild(content);

    return element;
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
 * Create a sub title element
 * @param {string} text The title text
 * @returns {HTMLHeadingElement} The element
 */
InterfaceElement.prototype.createSubTitle = function(text) {
    const element = document.createElement("h3");

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
    slider.step = step.toString();
    slider.value = initial.toString();
    slider.oninput = () => onUpdate(slider.valueAsNumber);

    element.appendChild(document.createTextNode(name));
    element.appendChild(slider);

    return element;
};

/**
 * Create a checkbox
 * @param {string} name The checkbox name
 * @param {boolean} initial The initial value
 * @param {Function} onUpdate A function to execute when the state has changed
 * @returns {HTMLLabelElement} The checkbox
 */
InterfaceElement.prototype.createCheckBox = function(name, initial, onUpdate) {
    const element = document.createElement("label");
    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.checked = initial;
    checkbox.onchange = () => onUpdate(checkbox.checked);

    element.appendChild(document.createTextNode(name));
    element.appendChild(checkbox);

    return element;
};