import { StateContainer, Updater } from "./profunctor-state";

export class SimpleStateContainer<T> implements StateContainer<T> {
  private state: T[];

  constructor(initialState: T) {
    this.state = [initialState];
  }

  getTravelState() {
    return this.state;
  }

  getState(): T {
    return this.state[this.state.length - 1];
  }

  setState(updater: Updater<T> | T) {
    this.state.push(
      typeof updater === "function"
        ? (updater as Updater<T>)(this.state[this.state.length - 1])
        : (updater as T)
    );
  }
}
