import { OnStateChange, StateContainer, Updater } from './types';
import { ProfunctorState } from './profunctor-state';
import { SimpleStateContainer } from './simple-state-container';

export function useProfunctor<T>(
  stateContainer: StateContainer<T>,
): [ProfunctorState<T>, OnStateChange<T>] {
  let cb: (state: T) => void;

  function onStateChange(callback: typeof cb) {
    cb = callback;
    // cb(stateContainer.getState());
  }

  function newSetState(updater: Updater<T>) {
    stateContainer.setState(updater);
    cb && cb(stateContainer.getState());
  }

  const profunctor = new ProfunctorState(
    stateContainer.getState.bind(stateContainer),
    newSetState,
  );
  profunctor.promap = profunctor.promap.bind(
    profunctor,
  ) as typeof profunctor.promap;

  return [profunctor, onStateChange];
}
