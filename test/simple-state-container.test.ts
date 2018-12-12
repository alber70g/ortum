import * as test from 'tape';
import { SimpleStateContainer } from '../lib/commonjs';
import { Updater } from '../lib/commonjs';

test('SimpleStateContainer', (t) => {
  t.plan(2);

  const state = { number: 1, foo: { bar: { baz: 1 } } };
  const simpleState = new SimpleStateContainer(state);

  t.deepEquals(
    simpleState.getState(),
    state,
    'getState() returns the initialstate',
  );

  const updater: Updater<typeof state> = (prev: typeof state) => ({
    ...prev,
    number: prev.number + 1,
  });
  simpleState.setState(updater);

  t.deepEquals(
    simpleState.getState(),
    updater(state),
    'setState() modifies the state correctly',
  );
  t.end();
});
