import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { UIActions } from '../state';
import { SidePanel as View } from './SidePanel';

export const SidePanel = connect(function mapState(state) {
  return {
    isSidePanelOpen: state.ui.isSidePanelOpen,
  };
}, function mapDispatch(dispatch) {
  return {
    actions: {
      ...bindActionCreators(UIActions, dispatch),
    }
  };
})(View);
