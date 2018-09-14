declare global {
  namespace JSX {
    interface Element extends VNode<any> { }
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}

export interface VNode<Attributes extends object = {}> {
  type: string
  attributes: Attributes
  children: (ChildNode | undefined)[]
}

export type VText = string & { [P in keyof VNode]?: undefined }

export type ChildNode<Attributes extends object = {}> = VNode<Attributes> | VText

export interface Component<P extends object = {}> {
  (props: P, children: (ChildNode | undefined)[]): VNode<P>
}

const ARR = [] as ReadonlyArray<unknown>

const flat = <T>(array: (T | T[])[]) =>
  ARR.concat(...array) as T[]

const normalizeChild = (child: ChildNode) =>
  child != null && child !== '' && typeof child !== 'boolean' ? child : undefined

const emptyObject = {}

export const h = <Attributes extends object = {}>(
  type: string | Component<Attributes>,
  attributes: Attributes | null,
  ...childNodes: (ChildNode | ChildNode[])[]
): VNode<Attributes> => {
  attributes = attributes || emptyObject as Attributes
  const children = flat(childNodes).map(normalizeChild)

  return typeof type === 'function'
    ? type(attributes, children)
    : { type, attributes, children }
}

export default h
