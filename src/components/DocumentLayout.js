import React, { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';
import { EditorState, ContentState, SelectionState, convertToRaw } from 'draft-js';

const DocumentLayout = ({ editorState, handleEditorStateChange}) => {
  const [documentLayoutEl, setDocumentLayoutEl] = useState(null);

  const handleDocumentLayoutClose = () => {
    setDocumentLayoutEl(null);
  };

  const handleDocumentLayoutClick = (event) => {
  setDocumentLayoutEl(event.currentTarget);
  };

  const handleSectionClick = (blockKey) => {
    const newEditorState = jumpToSection(editorState, blockKey);
    handleEditorStateChange(newEditorState);
    handleDocumentLayoutClose();
  };
   
const jumpToSection = (editorState, blockKey) => {
  const contentState = editorState.getCurrentContent();
  const block = contentState.getBlockForKey(blockKey);
  const selection = new SelectionState({
    anchorKey: blockKey,
    anchorOffset: 0,
    focusKey: blockKey,
    focusOffset: block.getLength(),
  });
  const newEditorState = EditorState.forceSelection(editorState, selection);
  const selectedBlockNode = document.querySelector(`[data-offset-key="${blockKey}-0-0"]`);
  if (selectedBlockNode) {
    selectedBlockNode.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return newEditorState;
};



  const generateSectionsFromContent = () => {
    const contentState = editorState.getCurrentContent();
    const blocks = contentState.getBlockMap();
    const sections = [];

    blocks.forEach((block) => {
      const blockType = block.getType();
      if (blockType.startsWith('header')) {
        sections.push({
          blockKey: block.getKey(),
          title: block.getText(),
        });
      }
    });

    return sections;
  };

  const sections = generateSectionsFromContent();

  return (
    <div>
      <Button style={{ color: 'white' }} onClick={handleDocumentLayoutClick}>
        <Icon icon="iconoir:page" height="30" />
      </Button>
      <Menu anchorEl={documentLayoutEl} open={Boolean(documentLayoutEl)} onClose={handleDocumentLayoutClose}>
        {sections.map((section) => (
        <MenuItem key={section.blockKey} onClick={() => handleSectionClick(section.blockKey)}>
        {section.title}
        </MenuItem>

        ))}
      </Menu>
    </div>
  );
};

export default DocumentLayout;
