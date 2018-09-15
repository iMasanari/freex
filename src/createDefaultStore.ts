export type Store<State, ActionObject> = (render: (state: State) => void, getState: () => State) =>
  (action?: ActionObject) => void

export const createDefaultStore = <State>(initState: State): Store<State, ((state: State) => Partial<State>) | Partial<State>> =>
  (render, getState) => {
    render(initState)

    return (action) => {
      if (action === undefined) return

      const state = getState()
      const newState = typeof action === 'function' ? action(state) : action
      const isObject = newState === Object(newState)

      render(isObject ? { ...state as any, ...newState as any } : newState)
    }
  }

export default createDefaultStore
