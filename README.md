
<h1 align="center">
  <br>
  <a href="https://github.com/alber70g/ortum"><img src="https://raw.githubusercontent.com/alber70g/ortum/master/packages/ortum/assets/ortum-logo.png" alt="Ortum" width="300"></a>
  <br>
  Ortum
  <br>
</h1>

<h4 align="center">Minimal unidirectional global state management library (based on basic functional programming concepts).</h4>

<p align="center">
  <a href=""><img src="https://img.shields.io/codeship/a1ced050-e5b1-0136-a839-2ea949930c0f.svg" alt="build"></a>
  <a href=""><img src="https://img.shields.io/npm/dt/ortum.svg" alt="downloads"></a>
  <a href=""><img src="https://img.shields.io/bundlephobia/min/ortum.svg" alt="minified size 1.61 KB"></a>
  <a href=""><img src="https://img.shields.io/badge/coverage-100%25-brightgreen.svg" alt="coverage 100%"></a>
  <a href=""><img src="https://img.shields.io/badge/license-MIT-brightgreen.svg" alt="license MIT"></a>
</p>

<p align="center">
  <a href="#description">Description</a> •
  <a href="#demo">Demo</a> •
  <a href="#getting-started">Getting started</a> •
  <a href="#minimal-example">Minimal example</a> •
  <a href="#concepts">Concepts</a> •
  <a href="#example-with-ramdajs">Example with Ramdajs</a>
</p>

Description
------------

Ortum is a small framework agnostic, unidirectional state management library.  
It's inspired by the work of André Staltz' on
[Profunctor State Optics](https://github.com/staltz/use-profunctor-state)

Ortum allows your features to be independent from the global state while having 
the ability to use the global state.  
By using this, your features are decoupled from their environment, thus easy to
test.

Demo
----

A demo can be found here:
https://stackblitz.com/edit/ortum-counter?file=src/counter.ts

Getting started
---------------

Install into your project:

```bash
$ npm install --save ortum
```

Minimal example
---------------

```js
const { SimpleStateContainer, useProfunctor } = require('ortum');

const [appProf, onStateChange] = useProfunctor(
  new SimpleStateContainer({ counter: 0 }),
);

onStateChange((state) => console.log(state)); 

console.log(appProf.getState()); // { counter: 0 }

appProf.setState(
  ({ counter, ...state }) => ({...state, counter: counter + 1 })
);

const counterProf = appProf.promap(
  (state) => state.counter,
  (counter, state) => ({ ...state, counter })
);

console.log(authorsProf.getState()); // 2
```

Concepts
--------

Don't get scared away by the functional jargon that's being used. They are just
terms for patterns that you already use.

### Functor

Something on which you can call `map` over with a single function to transform
each element.  
For example an array:
```js
[1,2,3,4].map(x => x * x) // [2,4,9,16]
```

### Profunctor

Something on which you can call `promap` over, however, you can pass two
functions: 
1. a map (`x => x * 2`), times two
2. a 'reverse'-map  (`x => x / 2`), divide by two  
  
This is some pseudo-code explaining what happens:

```js
const prof1 = new Profunctor([1,2,3,4]);
const prof2 = prof1.promap(x => x * 2, x => x / 2)
prof2.get() // [2,4,6,8]
//    ^ the first function applied on the array of prof1 
prof2.set(([first, ...rest]) => [10, ...rest]) 
//    ^ the second function applied on the array of prof2
prof2.get() // [10,4,6,8]
prof1.get() // [5,2,3,4]
// this code is for explanatory purpose, not an example of Ortum
```

This is what happens:
- A Profunctor `prof1` holds some state `[1,2,3,4]` and is 'promappable'.
- When promapping you get a new Profunctor `y`.
- `prof2` now holds `prof1.map(x => x * 2)` as `get`-function and a reversed
  version as `set`-function

### Example with objects

The same concept can be applied on an object:

```js
const prof1 = new Profunctor({ counter: 0, title: 'Profunctors' });
const prof2 = prof1.promap(
  obj => obj.counter, 
  (counter, obj) => ({ ...obj, counter })
)
// this code is for explanatory purpose, not an example of Ortum
```

You guessed it; `prof2` holds only the value of `counter`: `0`. And the
`set`-function, puts it back in the `prof1`-state.


Example with Ramdajs
--------------------

Ramdajs is a nice functional library that can remove a lot of boilerplating from
your `promap`-functions.

Because the signatures of Ortum's `promap`-functions have a 'data-last'
approach, it works fluently with other functional libraries that use currying.

```js
import * as R from 'ramda';
import { useProfunctor, SimpleStateContainer } from 'ortum';

const appProf = useProfunctor(
  new SimpleStateContainer({ foo: { bar: { baz: 'value' } } })
)

const bazLens = R.lensPath(['foo','bar','baz']);
const bazProf = appProf.promap(
  R.view(bazLens),
  R.set(bazLens)
)

bazProf.getState() // 'value'
bazProf.setState('another value')
bazProf.getState() // 'another value'
```

Instead of making the two map/unmap functions manually, we can use `lenses` with
`view` and `get` from Ramda to simplify our code. This would be the alternative:

```js
appProf.promap(
  state => state.foo.bar.baz,
  (baz, state) => {
    ...state,
    foo: {
      ...state.foo,
      bar: {
        ...state.foo.bar,
        baz
      }
    }
  }
)
```



Ortum and lit-html
------------------

Ortum can be used in multiple ways. A useful way is how 

### Todo 

- Add docs: How it relates to Redux, Reacts setState
- Add docs: How to/can I use it with React, Angular, lit-html
