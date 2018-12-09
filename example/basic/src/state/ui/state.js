import { UIActions } from './actions';

export const UIState = {
  name: 'ui',
  persist: true,
  defaults: {
    isSidePanelOpen: false,
  },
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
