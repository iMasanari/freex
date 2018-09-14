import h from './h'
import app from './app'

const initState = {
  count: 0
}

type State = typeof initState

const increment = () =>
  (state: State) =>
    ({ count: state.count + 1 })

const Counter = (props: { count: number }) =>
  <div>
    <span>{props.count}</span>
    <button onclick={increment}>+</button>
  </div>

const view = (state: State) =>
  <div>
    <Counter count={state.count} />
  </div>

app(initState, view, document.getElementById('app')!)
