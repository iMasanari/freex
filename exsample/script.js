/** @jsx h */

const { h, app, createDefaultStore } = freex

const initState = { count: 0 }
const store = createDefaultStore(initState)

const increment = () =>
  (state) =>
    ({ count: state.count + 1 })

const Counter = (props) =>
  <div>
    <span>{props.count}</span>
    <button onclick={increment}>+</button>
  </div>

const view = (state) =>
  <Counter count={state.count} />

app(store, view, document.getElementById('app'))
