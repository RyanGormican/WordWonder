export const updateEditorState = (newEditorState) => {
  return {
    type: 'UPDATE_EDITOR_STATE',
    payload: newEditorState,
  };
};