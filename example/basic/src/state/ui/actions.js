export const UIActions = {
  SIDE_PANEL_TOGGLE: 'SIDE_PANEL_TOGGLE',
  /** Toggles the side panel. Optionally, provide a value to ensure that it is
   * toggled to `true/false`.
   */
  toggleSidePanel(value = undefined) {
    return { type: UIActions.SIDE_PANEL_TOGGLE, value };
  }
};