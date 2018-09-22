export declare type Store<State, ActionObject> = (render: (state: State) => void, getState: () => State) => (action?: ActionObject) => void;
export declare const createDefaultStore: <State>(initState: State) => Store<State, ((state: State) => Partial<State>) | Partial<State>>;
export default createDefaultStore;
