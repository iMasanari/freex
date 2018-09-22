const isVText = (node) => node.type == null;
const setEvent = ($target, name, value, eventProxy) => {
    const eventName = name.slice(2).toLowerCase();
    let oldValue;
    if ($target._events) {
        oldValue = $target._events[eventName];
    }
    else {
        $target._events = {};
    }
    $target._events[eventName] = value;
    if (value) {
        if (!oldValue) {
            $target.addEventListener(eventName, eventProxy);
        }
    }
    else {
        $target.removeEventListener(eventName, eventProxy);
    }
};
const setAttribute = ($target, name, value, eventProxy) => {
    if (name[0] === 'o' || name[1] === 'n') {
        setEvent($target, name, value, eventProxy);
        return;
    }
    const isEmpty = value == null || value === false;
    if (name in $target && name !== 'list') {
        $target[name] = value;
    }
    else if (!isEmpty) {
        $target.setAttribute(name, value);
    }
    if (isEmpty) {
        $target.removeAttribute(name);
    }
};
const updateAttributes = ($target, attributes, oldAttributes, eventProxy) => {
    if (attributes === oldAttributes)
        return;
    for (const name in Object.assign({}, attributes, oldAttributes)) {
        const oldValue = name === 'value' || name === 'checked'
            ? $target[name]
            : oldAttributes[name];
        if (attributes[name] !== oldValue) {
            setAttribute($target, name, attributes[name], eventProxy);
        }
    }
};
const createElement = (node, eventProxy) => {
    if (isVText(node)) {
        return document.createTextNode(node);
    }
    const $element = document.createElement(node.type);
    for (const name in node.attributes) {
        setAttribute($element, name, node.attributes[name], eventProxy);
    }
    node.children.forEach((child) => {
        if (child != null) {
            $element.appendChild(createElement(child, eventProxy));
        }
    });
    return $element;
};
const updateElement = ($parent, $element, node, oldNode, eventProxy) => {
    if (node === oldNode)
        return;
    if (oldNode == null) {
        $parent.insertBefore(createElement(node, eventProxy), $element);
    }
    else if (node == null) {
        $parent.removeChild($element);
    }
    else if (node.type !== oldNode.type) {
        $parent.replaceChild(createElement(node, eventProxy), $element);
    }
    else if (isVText(node)) {
        $element.nodeValue = node;
    }
    else {
        updateAttributes($element, node.attributes, oldNode.attributes, eventProxy);
        const len = Math.max(node.children.length, oldNode.children.length);
        let domIndex = 0;
        for (let i = 0; i < len; i++) {
            const child = node.children[i];
            const oldChild = oldNode.children[i];
            const $childNode = $element.childNodes[domIndex];
            updateElement($element, $childNode, child, oldChild, eventProxy);
            if (child != null) {
                ++domIndex;
            }
        }
    }
};
export const app = (store, view, container) => {
    let node;
    let rootState;
    const getState = () => rootState;
    const render = (state) => {
        const prevNode = node;
        rootState = state;
        node = view(state);
        updateElement(container, container.firstChild, node, prevNode, eventProxy);
    };
    const eventProxy = (event) => {
        const action = event.currentTarget._events[event.type](event);
        dispatch(action);
    };
    const dispatch = store(render, getState);
};
export default app;
