import h from './h'
import app from './app'

const initState = {
  count: 0
}

type State = typeof initState

const view = (state: State, setState: (state: State) => void) => {
  const increment = () => {
    setState({ count: state.count + 1 })
  }

  return (
    <div>
      <span>{state.count}</span>
      <button onclick={increment}>+</button>
    </div>
  )
}

app(initState, view, document.getElementById('app')!)
