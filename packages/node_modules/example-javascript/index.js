// import the library
const { SimpleStateContainer, useProfunctor } = require('ortum');

// create an initial state to use in the stateContainer
const initialState = { counter: 0 };

// create the profunctor
const [appStateContainer, onStateChange] = useProfunctor(
  new SimpleStateContainer(initialState),
);

// listen to state changes
onStateChange((state) => console.log(state));

// get the state
console.log(appStateContainer.getState()); // { counter: 0 }

// update the state
appStateContainer.setState((prevState) => ({
  ...prevState,
  counter: prevState.counter + 1,
}));
// console.log in onStateChange triggers { counter: 1 }
