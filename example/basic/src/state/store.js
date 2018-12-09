import { StateStore } from '@reb/state';
import {
  ReduxPersistStorageStrategy,
} from '@reb/state/lib/storage/strategy/ReduxPersistStorageStrategy';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import states from './states';

export const store = new StateStore({
  logLevel: 1,
  logger: process.env.NODE_ENV === 'development' ? createLogger() : undefined,
  states,
  storageConfig: {
    strategy: ReduxPersistStorageStrategy,
  },
  thunk,
});
export default store;
