import { VNode, VText, ChildNode } from './h'
import { Store } from './createDefaultStore'

type AnyObject = Record<string, any>

type ElementWithEvent = Element & { _events?: Record<string, any> }
type EventProxy = (event: Event) => void

const isVText = (node: ChildNode): node is VText =>
  node.type == null

const setEvent = ($target: ElementWithEvent, name: string, value: any, eventProxy: EventProxy) => {
  const eventName = name.slice(2).toLowerCase()
  let oldValue: any

  if ($target._events) {
    oldValue = $target._events[eventName]
  } else {
    $target._events = {}
  }

  $target._events[eventName] = value

  if (value) {
    if (!oldValue) {
      $target.addEventListener(eventName, eventProxy)
    }
  } else {
    $target.removeEventListener(eventName, eventProxy)
  }
}

const setAttribute = ($target: Element, name: string, value: any, eventProxy: EventProxy) => {
  if (name[0] === 'o' || name[1] === 'n') {
    setEvent($target, name, value, eventProxy)
    return
  }

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

const updateAttributes = ($target: Element, attributes: AnyObject, oldAttributes: AnyObject, eventProxy: EventProxy) => {
  if (attributes === oldAttributes) return

  for (const name in { ...attributes, ...oldAttributes }) {
    const oldValue = name === 'value' || name === 'checked'
      ? ($target as any)[name]
      : oldAttributes[name]

    if (attributes[name] !== oldValue) {
      setAttribute($target, name, attributes[name], eventProxy)
    }
  }
}

const createElement = (node: ChildNode<AnyObject>, eventProxy: EventProxy) => {
  if (isVText(node)) {
    return document.createTextNode(node)
  }

  const $element = document.createElement(node.type)

  for (const name in node.attributes) {
    setAttribute($element, name, node.attributes[name], eventProxy)
  }

  node.children.forEach((child) => {
    if (child != null) {
      $element.appendChild(createElement(child, eventProxy))
    }
  })

  return $element
}

const updateElement = (
  $parent: Element,
  $element: Element,
  node: ChildNode | undefined,
  oldNode: ChildNode | undefined,
  eventProxy: EventProxy,
) => {
  if (node === oldNode) return

  if (oldNode == null) {
    $parent.insertBefore(createElement(node!, eventProxy), $element)
  }
  else if (node == null) {
    $parent.removeChild($element)
  }
  else if (node.type !== oldNode.type) {
    $parent.replaceChild(createElement(node, eventProxy), $element)
  }
  else if (isVText(node)) {
    $element.nodeValue = node
  }
  else {
    updateAttributes($element, node.attributes, oldNode.attributes!, eventProxy)

    const len = Math.max(node.children.length, oldNode.children!.length)
    let domIndex = 0

    for (let i = 0; i < len; i++) {
      const child = node.children[i]
      const oldChild = oldNode.children![i]
      const $childNode = $element.childNodes[domIndex] as Element

      updateElement($element, $childNode, child, oldChild, eventProxy)

      if (child != null) {
        ++domIndex
      }
    }
  }
}

export type View<State> = (state: State) => VNode

export const app = <State, ActionObject>(
  store: Store<State, ActionObject>,
  view: View<State>,
  container: Element,
) => {
  let node: VNode | undefined
  let rootState: State

  const getState = () =>
    rootState

  const setState = (state: State) => {
    const prevNode = node
    rootState = state
    node = view(state)
    updateElement(container, container.firstChild as Element, node, prevNode, eventProxy)
  }

  const dispatch = store(setState, getState)

  const eventProxy = (event: Event) => {
    const action = (event.currentTarget as ElementWithEvent)._events![event.type](event)
    dispatch(action)
  }

  dispatch()
}

export default app
