import { StateContainer, Updater } from "./profunctor-state";

export class SimpleStateContainer<T> implements StateContainer<T> {
  private state: T;

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState(): T {
    return this.state;
  }

  setState(updater: Updater<T> | T) {
    this.state = (typeof updater === 'function') 
      ? (updater as Updater<T>)(this.state)
      : updater as T;
  }
}
