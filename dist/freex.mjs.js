var ARR = [];
var flat = function (array) {
    return ARR.concat.apply(ARR, array);
};
var normalizeChild = function (child) {
    return child != null && child !== '' && typeof child !== 'boolean' ? child : undefined;
};
var emptyObject = {};
var h = function (type, attributes) {
    var childNodes = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        childNodes[_i - 2] = arguments[_i];
    }
    attributes = attributes || emptyObject;
    var children = flat(childNodes).map(normalizeChild);
    return typeof type === 'function'
        ? type(attributes, children)
        : { type: type, attributes: attributes, children: children };
};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var isVText = function (node) {
    return node.type == null;
};
var setEvent = function ($target, name, value, eventProxy) {
    var eventName = name.slice(2).toLowerCase();
    var oldValue;
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
var setAttribute = function ($target, name, value, eventProxy) {
    if (name[0] === 'o' || name[1] === 'n') {
        setEvent($target, name, value, eventProxy);
        return;
    }
    var isEmpty = value == null || value === false;
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
var updateAttributes = function ($target, attributes, oldAttributes, eventProxy) {
    if (attributes === oldAttributes)
        return;
    for (var name_1 in __assign({}, attributes, oldAttributes)) {
        var oldValue = name_1 === 'value' || name_1 === 'checked'
            ? $target[name_1]
            : oldAttributes[name_1];
        if (attributes[name_1] !== oldValue) {
            setAttribute($target, name_1, attributes[name_1], eventProxy);
        }
    }
};
var createElement = function (node, eventProxy) {
    if (isVText(node)) {
        return document.createTextNode(node);
    }
    var $element = document.createElement(node.type);
    for (var name_2 in node.attributes) {
        setAttribute($element, name_2, node.attributes[name_2], eventProxy);
    }
    node.children.forEach(function (child) {
        if (child != null) {
            $element.appendChild(createElement(child, eventProxy));
        }
    });
    return $element;
};
var updateElement = function ($parent, $element, node, oldNode, eventProxy) {
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
        var len = Math.max(node.children.length, oldNode.children.length);
        var domIndex = 0;
        for (var i = 0; i < len; i++) {
            var child = node.children[i];
            var oldChild = oldNode.children[i];
            var $childNode = $element.childNodes[domIndex];
            updateElement($element, $childNode, child, oldChild, eventProxy);
            if (child != null) {
                ++domIndex;
            }
        }
    }
};
var app = function (store, view, container) {
    var node;
    var rootState;
    var getState = function () {
        return rootState;
    };
    var render = function (state) {
        var prevNode = node;
        rootState = state;
        node = view(state);
        updateElement(container, container.firstChild, node, prevNode, eventProxy);
    };
    var eventProxy = function (event) {
        var action = event.currentTarget._events[event.type](event);
        dispatch(action);
    };
    var dispatch = store(render, getState);
};

var createDefaultStore = function (initState) {
    return function (render, getState) {
        render(initState);
        return function (action) {
            if (action === undefined)
                return;
            var state = getState();
            var newState = typeof action === 'function' ? action(state) : action;
            var isObject = newState === Object(newState);
            render(isObject ? __assign({}, state, newState) : newState);
        };
    };
};

export { h, app, createDefaultStore };
