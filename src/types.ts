export type Updater<T> = (prev: T) => T;
export type GetState<T> = () => T;
export type SetState<T> = (updater: Updater<T>) => void;
export type Lens<T, S> = { get: Getter<T, S>; set: Setter<T, S> };
export type Getter<T, S> = (outer: T) => S;
export type Setter<T, S> = (newInner: S, prevOuter: T) => T;
export type OnStateChange<T> = (cb: (state: T) => void) => void;

export interface StateContainer<T> {
  getState: GetState<T>;
  setState: SetState<T>;
}
