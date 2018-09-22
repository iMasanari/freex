const ARR = [];
const flat = (array) => ARR.concat(...array);
const normalizeChild = (child) => child != null && child !== '' && typeof child !== 'boolean' ? child : undefined;
const emptyObject = {};
export const h = (type, attributes, ...childNodes) => {
    attributes = attributes || emptyObject;
    const children = flat(childNodes).map(normalizeChild);
    return typeof type === 'function'
        ? type(attributes, children)
        : { type, attributes, children };
};
export default h;
