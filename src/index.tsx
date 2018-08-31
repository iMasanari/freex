import h from './h'
import app from './app'

const initState = {
  count: 0
}

type State = typeof initState

const increment = () =>
  (state: State) =>
    ({ count: state.count + 1 })

const view = (state: State) =>
  <div>
    <span>{state.count}</span>
    <button onclick={increment}>+</button>
  </div>

app(initState, view, document.getElementById('app')!)
