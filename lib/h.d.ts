declare global {
    namespace JSX {
        interface Element extends VNode<any> {
        }
        interface IntrinsicElements {
            [elemName: string]: any;
        }
    }
}
export interface VNode<Attributes extends object = {}> {
    type: string;
    attributes: Attributes;
    children: (ChildNode | undefined)[];
}
export declare type VText = string & {
    [P in keyof VNode]?: undefined;
};
export declare type ChildNode<Attributes extends object = {}> = VNode<Attributes> | VText;
export interface Component<P extends object = {}> {
    (props: P, children: (ChildNode | undefined)[]): VNode<P>;
}
export declare const h: <Attributes extends object = {}>(type: string | Component<Attributes>, attributes: Attributes | null, ...childNodes: (VNode<{}> | VText | ChildNode<{}>[])[]) => VNode<Attributes>;
export default h;
