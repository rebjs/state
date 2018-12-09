import { StateStore } from '@reb/state';
import {
  createReduxPersistStorage,
} from '@reb/state/lib/storage/strategy/redux-persist';
import { createLogger } from 'redux-logger';
import persistLocalStorage from "redux-persist/lib/storage";
import thunk from 'redux-thunk';

import states from './states';

export const store = new StateStore({
  middleware: {
    logging: process.env.NODE_ENV === 'development'
      ? createLogger()
      : undefined,
    thunking: thunk,
  },
  states,
  storage: createReduxPersistStorage({
    debug: true,
    key: 'reduxPersist',
    // serialize: false,
    storage: persistLocalStorage,
  }),
});
export default store;
