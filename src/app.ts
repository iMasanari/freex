import { VNode, VText, ChildNode } from './h'

type AnyObject = Record<string, any>

const isVText = (node: ChildNode): node is VText =>
  node.type == null

const setAttribute = ($target: Element, name: string, value: any) => {
  const isEmpty = value == null || value === false

  if (name in $target && name !== 'list') {
    ($target as any)[name] = value
  }
  else if (!isEmpty) {
    $target.setAttribute(name, value)
  }

  if (isEmpty) {
    $target.removeAttribute(name)
  }
}

const updateAttributes = ($target: Element, attributes: AnyObject, oldAttributes: AnyObject) => {
  if (attributes === oldAttributes) return

  for (const name in { ...attributes, ...oldAttributes }) {
    const oldValue = name === 'value' || name === 'checked'
      ? ($target as any)[name]
      : oldAttributes[name]

    if (attributes[name] !== oldValue) {
      setAttribute($target, name, attributes[name])
    }
  }
}

const createElement = (node: ChildNode<AnyObject>) => {
  if (isVText(node)) {
    return document.createTextNode(node)
  }

  const $element = document.createElement(node.type)

  for (const name in node.attributes) {
    setAttribute($element, name, node.attributes[name])
  }

  node.children.forEach((child) => {
    $element.appendChild(createElement(child))
  })

  return $element
}

const updateElement = ($parent: Element, $element: Element, node: ChildNode, oldNode: ChildNode | undefined) => {
  if (node === oldNode) return

  if (oldNode == null) {
    $parent.appendChild(createElement(node))
  }
  else if (node == null) {
    $parent.removeChild($element)
  }
  else if (node.type !== oldNode.type) {
    $parent.replaceChild(createElement(node), $element)
  }
  else if (isVText(node)) {
    $element.nodeValue = node
  }
  else {
    updateAttributes($element, node.attributes, oldNode.attributes!)

    const len = Math.max(node.children.length, oldNode.children!.length)

    for (let i = 0; i < len; i++) {
      updateElement($element, $element.childNodes[i] as Element, node.children[i], oldNode.children![i])
    }
  }
}

export type SetState<State> = (state: State) => void
export type View<State> = (state: State, setState: SetState<State>) => VNode

export const app = <State>(initState: State, view: View<State>, container: Element) => {
  let node: VNode | undefined

  const setState = (state: State) => {
    const prevNode = node
    node = view(state, setState)

    updateElement(container, container.firstChild as Element, node, prevNode)
  }

  setState(initState)
}

export default app
