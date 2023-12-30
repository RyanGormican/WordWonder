import React, { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';
import { AtomicBlockUtils, EditorState } from 'draft-js';

const Insert = ({ editorState, handleEditorStateChange }) => {
  const [insertCommandAnchorE1, setInsertCommandAnchorEl] = useState(null);

  const handleInsertCommandClose = () => {
    setInsertCommandAnchorEl(null);
  };

  const handleInsertCommandClick = (event) => {
    setInsertCommandAnchorEl(event.currentTarget);
  };

  const handleImageUpload = (event) => {
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
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              id="imageInput"
            />
            Image <Icon icon="material-symbols:photo" />
          </MenuItem>
        </label>
      </Menu>
    </div>
  );
};

export default Insert;
