import { memoizeWith, identity } from 'ramda';

export type Updater<T> = (prev: T) => T;
export type GetState<T> = () => T;
export type SetState<T> = (updater: Updater<T>) => void;
export type Lens<T, S> = { get: Getter<T, S>; set: Setter<T, S> };
export type Getter<T, S> = (outer: T) => S;
export type Setter<T, S> = ((newInner: S, prevOuter: T) => T);
export type OnStateChange<T> = (cb: (state: T) => void) => void;

export interface StateContainer<T> {
  getState: GetState<T>;
  setState: SetState<T>;
}

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

    const innerSetState: SetState<S> = (newInnerStateOrUpdate: Updater<S>) => {
      this.setState((prevState) => {
        const innerState = get(prevState);
        const newInnerState = newInnerStateOrUpdate(innerState);
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
