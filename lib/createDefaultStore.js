export const createDefaultStore = (initState) => (render, getState) => {
    render(initState);
    return (action) => {
        if (action === undefined)
            return;
        const state = getState();
        const newState = typeof action === 'function' ? action(state) : action;
        const isObject = newState === Object(newState);
        render(isObject ? Object.assign({}, state, newState) : newState);
    };
};
export default createDefaultStore;
