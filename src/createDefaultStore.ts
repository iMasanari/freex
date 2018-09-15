type SetState<State> = (state: State) => void

export type Store<State, ActionObject> = (setState: SetState<State>, getState: () => State) =>
  (action?: ActionObject) => void

export const createDefaultStore = <State>(initState: State): Store<State, ((state: State) => Partial<State>) | Partial<State>> =>
  (setState, getState) => {
    let isInit: boolean | undefined

    return (action) => {
      if (!isInit) {
        isInit = true
        setState(initState)
      }
      else if (action !== undefined) {
        const state = getState()
        const newState = typeof action === 'function' ? action(state) : action
        const isObject = newState === Object(newState)

        setState(isObject ? { ...state as any, ...newState as any } : newState)
      }
    }
  }

export default createDefaultStore
