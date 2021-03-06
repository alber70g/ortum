import * as test from 'tape';
import * as redux from 'redux';
import { createReduxStateContainer, Updater } from '../lib/commonjs';

test('createReduxStateContainer', (t) => {
  t.plan(3);

  class ProfAction<T> implements redux.Action {
    public type = 'PROF_ACTION';
    constructor(public payload: T) {}
  }

  const state = { number: 1, foo: { bar: { baz: 1 } } };
  const createStore = <T>(initialState: T) =>
    redux.createStore<T, redux.Action<string>, {}, {}>((state, action) => {
      switch (action.type) {
        case 'PROF_ACTION':
          return { ...state, ...(action as any).payload };

        default:
          return state || initialState;
      }
    });
  const act = new ProfAction<typeof state>({
    number: 1,
    foo: { bar: { baz: 1 } },
  });

  const testProf = createReduxStateContainer(createStore(state), act);
  t.deepEqual(testProf.getState(), state, 'getState() returns correct state');

  const updater: Updater<typeof state> = (prev) => ({
    ...prev,
    number: prev.number + 1,
  });
  testProf.setState(updater);
  t.deepEqual(
    testProf.getState(),
    updater(state),
    'setState() updates state correctly',
  );

  const oldState = testProf.getState();
  testProf.setState({ ...testProf.getState(), number: 10 });
  t.deepEqual(
    testProf.getState(),
    { ...oldState, number: 10 },
    'setState(T) updates state correctly',
  );

  t.end();
});
