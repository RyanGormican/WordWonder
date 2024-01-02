import React, { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';
import { AtomicBlockUtils, Entity, EditorState,  Modifier, } from 'draft-js';

const Insert = ({ editorState, handleEditorStateChange }) => {
  const [insertCommandAnchorE1, setInsertCommandAnchorEl] = useState(null);
  const [dateTimeCommandAnchorE1, setDateTimeCommandAnchorE1] = useState(null);
  const [rowCount, setRowCount] = useState(1);
  const [colCount, setColCount] = useState(1);
  const handleInsertCommandClose = () => {
    setInsertCommandAnchorEl(null);
    setDateTimeCommandAnchorE1(null);
  };

  const handleInsertCommandClick = (event) => {
    setInsertCommandAnchorEl(event.currentTarget);
  };

  const handleDateTimeCommandClick = (event) => {
    setDateTimeCommandAnchorE1(event.currentTarget);
  };

  const handleDateTimeCommandClose = (event) => {
    setDateTimeCommandAnchorE1(null);
  };
  const handleInsertDate = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();

    const contentState = editorState.getCurrentContent();
    const contentStateWithText = Modifier.insertText(
      contentState,
      editorState.getSelection(),
      formattedDate
    );

    const newEditorState = EditorState.push(
      editorState,
      contentStateWithText,
      'insert-characters'
    );

    handleEditorStateChange(newEditorState);
    setDateTimeCommandAnchorE1(null);
  };

  const handleInsertTime = () => {
    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString();

    const contentState = editorState.getCurrentContent();
    const contentStateWithText = Modifier.insertText(
      contentState,
      editorState.getSelection(),
      formattedTime
    );

    const newEditorState = EditorState.push(
      editorState,
      contentStateWithText,
      'insert-characters'
    );

    handleEditorStateChange(newEditorState);
    setDateTimeCommandAnchorE1(null);
  };

  const handleInsertDateTime = () => {
    const currentDate = new Date();
    const formattedDateTime = currentDate.toLocaleString();

    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();

    const contentStateWithText = Modifier.insertText(
      contentState,
      selection,
      formattedDateTime
    );

    const newEditorState = EditorState.push(
      editorState,
      contentStateWithText,
      'insert-characters'
    );

    const newSelection = selection.merge({
      anchorOffset: selection.getEndOffset(),
      focusOffset: selection.getEndOffset(),
    });

    const finalEditorState = EditorState.forceSelection(
      newEditorState,
      newSelection
    );

    handleEditorStateChange(finalEditorState);
    setInsertCommandAnchorEl(null);
  };

  const handleInsertTable = () => {
    if (rowCount && colCount) {
      const contentState = editorState.getCurrentContent();
      const selection = editorState.getSelection();
      const newContentState = Modifier.splitBlock(contentState, selection);
      const entityKey = Entity.create('TABLE', 'IMMUTABLE', { rows: rowCount, columns: colCount });
      const newEditorState = EditorState.set(editorState, { currentContent: newContentState });
      const atomicBlock = AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ');
      const finalEditorState = EditorState.moveFocusToEnd(atomicBlock);
      handleEditorStateChange(finalEditorState);
    }

    setInsertCommandAnchorEl(null);
  };

  return (
    <div>
      <Button onClick={handleInsertCommandClick} style={{ color: 'white' }}>
        Insert
      </Button>
      <Menu
        anchorEl={insertCommandAnchorE1}
        open={Boolean(insertCommandAnchorE1)}
        onClose={handleInsertCommandClose}
      >
        <label htmlFor="imageInput">
          <MenuItem>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => handleImageUpload(editorState, handleEditorStateChange, event)}
              style={{ display: 'none' }}
              id="imageInput"
            />
            Image <Icon icon="material-symbols:photo" />
          </MenuItem>
        </label>
        <MenuItem onClick={handleDateTimeCommandClick}>
          Date & Time <Icon icon="mdi:calendar" />
          <Icon icon="bxs:right-arrow" style={{ marginLeft: 'auto', marginRight: '4px', verticalAlign: 'middle' }} />
        </MenuItem>
        <MenuItem>
          <Button style={{ color: 'black' }} onClick={handleInsertTable}> Table(WIP) </Button> <Icon icon="material-symbols:table" />
          <div>
            Rows:
            <input
              type="number"
              value={rowCount}
              onChange={(e) => setRowCount(Math.min(Math.max(1, parseInt(e.target.value, 10)), 20))}
              min="1"
              max="20"
            />
          </div>
          <div>
            Columns:
            <input
              type="number"
              value={colCount}
              onChange={(e) => setColCount(Math.min(Math.max(1, parseInt(e.target.value, 10)), 20))}
              min="1"
              max="20"
            />
          </div>
        </MenuItem>
        <MenuItem>
    
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={dateTimeCommandAnchorE1}
        open={Boolean(dateTimeCommandAnchorE1)}
        onClose={handleDateTimeCommandClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleInsertDateTime}>
          Exact Date/Time <Icon icon="mdi:calendar" />
        </MenuItem>
        <MenuItem onClick={handleInsertDate}>
          Exact Date <Icon icon="clarity:date-line" />
        </MenuItem>
        <MenuItem onClick={handleInsertTime}>
          Exact Time <Icon icon="fa-solid:clock" />
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Insert;

export const handleImageUpload = (editorState, handleEditorStateChange, event) => {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
          'image',
          'IMMUTABLE',
          { src: reader.result, height: img.height, width: img.width }
        );

        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(
          editorState,
          { currentContent: contentStateWithEntity },
          'create-entity'
        );

        handleEditorStateChange(
          AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ')
        );
      };
    };

    reader.readAsDataURL(file);
  }
};
