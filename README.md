Ortum
=====

![](https://img.shields.io/codeship/a1ced050-e5b1-0136-a839-2ea949930c0f.svg)
![](https://img.shields.io/npm/dt/ortum.svg)
![](https://img.shields.io/bundlephobia/min/ortum.svg)
![](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)
![](https://img.shields.io/badge/license-MIT-brightgreen.svg)

Ortum is a small framework agnostic, unidirectional state 
management library.  
It's inspired by the work of André Staltz' on [Profunctor State Optics](https://github.com/staltz/use-profunctor-state)

Ortum allows your features to be independent from the global state while having 
the ability to use the global state.  
By using this, your features are decoupled from their environment, thus easy to test.

Demo
----

A demo can be found here: https://stackblitz.com/edit/ortum-counter?file=src/counter.ts

Getting started
---------------

Install into your project:

```bash
$ npm install --save ortum
```


### Usage in Javascript

Create an initial state, and use it to create the Profunctor.  
The `useProfunctor` returns an array with two elements: 
 - the profunctor: basically a store that holds the state and allows access and update it  
 using the functions `getState`, `setState` and `promap`.
 - an onStateChange that you can pass a callback of `(state) => console.log(state)`

```js
const { SimpleStateContainer, useProfunctor } = require('ortum');

const initialState = { 
  counter: 0, 
  authors: {
    1: {
      name: 'Andre Staltz',
      github: 'staltz'
    },
    2: {
      name: 'Albert Groothedde',
      github: 'alber70g',
    }
  }
  
};

// Create the app profunctor
const [appProf, onStateChange] = useProfunctor(
  new SimpleStateContainer(initialState),
);

// Listen to state changes
onStateChange((state) => console.log(state));

// Use the profunctor to get and set the state
console.log(appProf.getState()); 
// `{ counter: 0, authors: { .. }  }` 

// Set state using an Updater: prevState => newState
// After this statement you'll get a console.log with 
// // { counter: 1, authors: { .. }  }
appProf.setState((prevState) => {
  return Object.assign(
    {}, 
    prevState, 
    { counter: prevState.counter + 1 }
  )
});

// To create a substate profunctor
const authorsProf = appProf.promap(
  // map/getter
  (state) => state.authors,
  // unmap/setter
  (authors, prevState) => {
    return Object.assign({}, prevState, { authors: authors })
  }
)

console.log(authorsProf.getState()); 
// { 
//   counter: 1,
//   1: {
//     name: 'Andre Staltz',
//     github: 'staltz'
//   },
//   2: {
//     name: 'Albert Groothedde',
//     github: 'alber70g',
//   }
// }

```
