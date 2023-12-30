import { EditorState } from 'draft-js';

const initialState = {
  editorState: EditorState.createEmpty(),
};

const editorReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_EDITOR_STATE':
      return {
        ...state,
        editorState: action.payload,
      };
  
    default:
      return state;
  }
};

export default editorReducer;
