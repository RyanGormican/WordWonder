import { useState } from 'react';
import { EditorState, Modifier } from 'draft-js';
import { handleImageUpload } from './Insert';

export const useDragState = () => {
  const [dragging, setDragging] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, { editorState, handleEditorStateChange }) => {
    e.preventDefault();
    setDragging(false);

    const droppedText = e.dataTransfer.getData('text/plain');

    if (droppedText) {
      const selectionState = editorState.getSelection();
      const contentState = editorState.getCurrentContent();

      const newContentState = Modifier.replaceText(
        contentState,
        selectionState,
        droppedText
      );

      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        'insert-characters'
      );

      handleEditorStateChange(newEditorState);
    }

    const files = e.dataTransfer.files;

    if (files.length > 0) {
      const imageFile = files[0];

      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        handleImageUpload(
          editorState,
          handleEditorStateChange,
          { target: { files: [imageFile] } }
        );
      };
      reader.readAsDataURL(imageFile);
    }
  };

  return { dragging, handleDragEnter, handleDragLeave, handleDragOver, handleDrop };
};
