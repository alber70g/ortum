import { GetState, SetState, Lens, Getter, Setter, Updater } from './types';
import { memoizeWith, identity } from 'ramda';

/**
 * Inspired by https://github.com/staltz/use-profunctor-state
 */
export class ProfunctorState<T> {
  constructor(public getState: GetState<T>, public setState: SetState<T>) {}

  promap<S>(lens: Lens<T, S>, args?: any[]): ProfunctorState<S>;
  promap<S>(
    get: Getter<T, S>,
    set: Setter<T, S>,
    args?: any[],
  ): ProfunctorState<S>;
  promap<S>(
    a: Getter<T, S> | Lens<T, S>,
    b?: Setter<T, S> | any[],
    c?: any[],
  ): ProfunctorState<S> {
    const get = typeof a === 'object' ? a.get : a;
    const set = typeof a === 'object' ? a.set : b as Setter<T, S>;

    const innerSetState: SetState<S> = (
      newInnerStateOrUpdate: S | Updater<S>,
    ) => {
      this.setState((prevState) => {
        const innerState = get(prevState);
        const newInnerState =
          typeof newInnerStateOrUpdate === 'function'
            ? (newInnerStateOrUpdate as Updater<S>)(innerState)
            : newInnerStateOrUpdate as S;
        if (newInnerState === innerState) return prevState;
        return set(newInnerState, prevState);
      });
    };

    const innerState = () => get(this.getState());

    const memoProfunctor = memoizeWith(
      identity,
      (innerState: GetState<S>, innerSetState: SetState<S>) => {
        const profunctor = new ProfunctorState(innerState, innerSetState);
        profunctor.promap = profunctor.promap.bind(
          profunctor,
        ) as typeof profunctor.promap;
        return profunctor;
      },
    );

    return memoProfunctor(innerState, innerSetState);

    // const profunctor = new ProfunctorState(innerState, innerSetState);

    // profunctor.promap = profunctor.promap.bind(
    //   profunctor,
    // ) as typeof profunctor.promap;

    // return profunctor;
  }
}
