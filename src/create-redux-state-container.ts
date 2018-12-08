import { Store, Action } from 'redux';
import { StateContainer } from './types';

/**
 * Creates a StateContainer based on Redux
 * @param store the Redux store to use as StateContainer
 * @param action The action (containing a 'type' prop) that will
 *   be dispatched when updating the state from the profunctor
 */
export function createReduxStateContainer<T = any>(
  store: Store<T>,
  action: Action,
): StateContainer<T> {
  const stateContainer: StateContainer<T> = {
    getState: store.getState,
    setState: (updater) => {
      store.dispatch({
        type: action.type,
        payload: updater(stateContainer.getState()),
      });
    },
  };
  return stateContainer;
}
