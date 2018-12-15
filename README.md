# State

Simplified redux state and persistence management.

## Installation

```sh
npm install @reb/state
```
OR
```sh
yarn add @reb/state
```

## Usage

### Basic Usage

```js
import { StateStore } from '@reb/state';
import states from './states';
const store = new StateStore({ states });
```

### Define States

The `states` option for `StateStore` is an array of specifications to build
a reducer for each slice of state. Here is an example:

```js
import { UIActions } from './actions';

export const UIState = {
  name: 'ui',     // Name of this slice of state.
  persist: true,  // True to allow this slice to be stored in localStorage, etc.
  preload: true,  // True to preload this slice. Defaults to value of `persist`.
  defaults: {     // Default values returned if no handler is defined.
    isSidePanelOpen: false,
  },
  // Handlers can be passed to build a reducer, or you can pass your own reducer
  // function, e.g. `reducer: (state, action)=> state`
  handlers: {
    [UIActions.SIDE_PANEL_TOGGLE]: (state, action) => {
      const { value } = action;
      return {
        ...state,
        isSidePanelOpen: typeof value !== 'undefined'
          ? value
          : !state.isSidePanelOpen,
      };
    },
  },
};
```

Here is the `./actions` file for the `ui` state slice:

```js
export const UIActions = {
  SIDE_PANEL_TOGGLE: 'SIDE_PANEL_TOGGLE',
  /** Toggles the side panel. Optionally, provide a value to ensure that it is
   * toggled to `true/false`.
   */
  toggleSidePanel(value = undefined) {
    return { type: UIActions.SIDE_PANEL_TOGGLE, value };
  }
};
```

And here is how you could define the `./states` file:

```js
import { UIState } from './ui/state';

export * from './ui/actions';

export default [
  UIState,
];
```

See `./examples/basic` for a full example.

### With middleware

```js
import { StateStore } from '@reb/state';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import states from './states';

const store = new StateStore({
  middleware: {
    logging: process.env.NODE_ENV === 'development'
      ? createLogger()
      : undefined,
    other: [/* other custom middleware */],
    thunking: thunk,
  },
  states,
});
```

Alternatively, you can pass all middleware as an array, e.g:

```js
const store = new StateStore({
  middleware: [middleX, middleY, createLogger(), thunk],
  states,
});
```

### With redux-persist

```js
import { StateStore } from '@reb/state';
import {
  createReduxPersistStorage,
} from '@reb/state/lib/storage/strategy/redux-persist';

import states from './states';

const store = new StateStore({
  states,
  storage: createReduxPersistStorage({
    // All redux-persist options accepted...
    debug: true,
    key: 'storageKey',
  }),
});
```

### With middleware, localStorage and redux-persist

See `./examples/basic` to run this example.

```js
import { StateStore } from '@reb/state';
import {
  createReduxPersistStorage,
  preloadReduxPersistLocalStorage,
} from '@reb/state/lib/storage/strategy/redux-persist';
import { createLogger } from 'redux-logger';
import persistLocalStorage from "redux-persist/lib/storage";
import thunk from 'redux-thunk';

import states from './states';

const store = new StateStore({
  middleware: {
    logging: process.env.NODE_ENV === 'development'
      ? createLogger()
      : undefined,
    thunking: thunk,
  },
  states,
  storage: createReduxPersistStorage({
    debug: true,
    key: 'storageKey',
    // `preload` is not a redux-persist option. It is a function that receives
    // redux-persist options and a state slice name to load. It should
    // **synchronously** return the loaded data.
    preload: preloadReduxPersistLocalStorage,
    storage: persistLocalStorage,
    // `sync` is not a redux-persist option. It can be `true` to enable the
    // built-in crosstab sync feature or it can be an object to configure the
    // built-in crosstab sync feature. Alternatively, it can be a custom
    // function that receives the store and the redux-persist options to
    // start synchronizing (initialized when you call `store.storage.load()`).
    sync: true,
  }),
});
```
