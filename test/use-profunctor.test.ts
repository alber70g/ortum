import * as test from 'tape';
import {
  useProfunctor,
  SimpleStateContainer,
  Updater,
  Getter,
  Setter,
} from '../lib/commonjs';

test('useProfunctor', (t) => {
  t.plan(8);

  const initialState = { number: 0, foo: { bar: 1 } };
  const [ testProf, onStateChange ] = useProfunctor(
    new SimpleStateContainer(initialState),
  );
  t.deepEqual(
    testProf.getState(),
    initialState,
    'getState() returns initial state',
  );

  const updater: Updater<typeof initialState> = (prev) => ({
    ...prev,
    number: prev.number + 1,
  });
  onStateChange((newState) => {
    t.deepEqual(
      newState,
      updater(initialState),
      'onStateChange() callback gives correctly updated state',
    );
  });
  testProf.setState(updater);
  // set listener to nothing so the assert doesn't get triggered everytime
  onStateChange(() => {});
  t.deepEqual(
    testProf.getState(),
    updater(initialState),
    'getState() returns correct value after using setState()',
  );

  let getter: Getter<typeof initialState, number> = (state) => state.number;
  let setter: Setter<typeof initialState, number> = (number, prev) => ({
    ...prev,
    number,
  });
  const subProf = testProf.promap(getter, setter);
  t.deepEqual(
    subProf.getState(),
    getter(updater(initialState)),
    'promap() returns the correct data from getter',
  );

  const subProf2 = testProf.promap({ get: getter, set: setter });
  t.deepEqual(
    subProf2.getState(),
    getter(updater(initialState)),
    'promap() returns correct data when using {get,set} lens in promap',
  );

  subProf.setState(() => 15);
  t.deepEqual(
    testProf.getState(),
    { ...initialState, number: 15 },
    'using subProf.setState() testProf.getState() returns correct value',
  );

  const sameStateProf = testProf.promap(
    (state) => state,
    (newState, state) => newState,
  );
  sameStateProf.setState((state) => state);
  t.deepEqual(
    testProf.getState(),
    sameStateProf.getState(),
    'state stays the same',
  );

  const oldState = testProf.getState();
  testProf.setState({ ...testProf.getState(), number: 10 });
  t.deepEqual(
    testProf.getState(),
    { ...oldState, number: 10 },
    'using setState(T), state gets updated correctly',
  );

});
