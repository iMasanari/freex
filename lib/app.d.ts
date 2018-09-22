import { VNode } from './h';
import { Store } from './createDefaultStore';
export declare type View<State> = (state: State) => VNode;
export declare const app: <State, ActionObject>(store: Store<State, ActionObject>, view: View<State>, container: Element) => void;
export default app;
