import { StateContainer, Updater } from './types';

export class SimpleStateContainer<T> implements StateContainer<T> {
  private state: T;

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState(): T {
    return this.state;
  }

  setState(updater: Updater<T>) {
    this.state = updater(this.state);
  }
}
