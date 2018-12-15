# Basic Example of @reb/state

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## The Gist

The `StateStore` is created in `./state/store.js`.

The built-in `redux-persist` storage strategy should be used until we have a
better default strategy. This is our only milestone for getting out of alpha!

Since [@reb/state](https://www.npmjs.com/package/@reb/state) only has a
`devDependency` on `redux-persist`, you should install it in your project
to use it.

Storage/persistence and middleware are completely optional. So, this example
is not _as_ basic as it could be. Just comment out the `storage:` and/or
`middleware:` keys passed to `StateStore` for now, to try it without them.

Here is actually the most basic example:

```js
import states from './states';
export const store = new StateStore({
  states,
});
export default store;
```
