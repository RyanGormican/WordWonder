import React, { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { RichUtils, EditorState, Modifier } from 'draft-js';

const TextStyles = ({ darkMode, editorState, handleEditorStateChange }) => {
  const [fontSize, setFontSize] = useState(14);
  const [textColor, setTextColor] = useState('black');
  const [textStylesAnchorEl, setTextStylesAnchorEl] = useState(null);
  const [font, setFont] = useState('Arial')
  const handleTextStylesClose = () => {
    setTextStylesAnchorEl(null);
  };

  const handleFontSizeIncrease = () => {
    if (fontSize < 92) {
      const newFontSize = fontSize + 1;
      changeFontSize(newFontSize);
      setFontSize(newFontSize);
    }
  };

  const handleFontSizeDecrease = () => {
    if (fontSize > 1) {
      const newFontSize = fontSize - 1;
      changeFontSize(newFontSize);
      setFontSize(newFontSize);
    }
  };

  const changeFontSize = (newFontSize) => {

  };

  const handleTextStylesClick = (event) => {
    setTextStylesAnchorEl(event.currentTarget);
  };

  const handleColor = (color) => {
    setTextColor(color);
  };

  const handleSetFont = (fontFamily) => {
 setFont(fontFamily);
    const selection = editorState.getSelection();

    const nextContentState = Object.keys(styleMap).reduce((contentState, font) => {
      return Modifier.removeInlineStyle(contentState, selection, font);
    }, editorState.getCurrentContent());

    let nextEditorState = EditorState.push(editorState, nextContentState, 'change-inline-style');

    const currentStyle = editorState.getCurrentInlineStyle();

    if (selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, font) => {
        return RichUtils.toggleInlineStyle(state, font);
      }, nextEditorState);
    }

    if (!currentStyle.has(fontFamily)) {
      nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, fontFamily);
    }

    handleEditorStateChange(nextEditorState);
  };

  return (
    <div>
      <Button onClick={handleTextStylesClick} style={{ color: darkMode ? 'white' : 'black' }}>
        Text Styles
      </Button>
      <Menu anchorEl={textStylesAnchorEl} open={Boolean(textStylesAnchorEl)} onClose={handleTextStylesClose}>
        <MenuItem>
          Font Size (WIP)
          <Button onClick={handleFontSizeDecrease}>-</Button>
          {fontSize}
          <Button onClick={handleFontSizeIncrease}>+</Button>
        </MenuItem>
        <MenuItem style={{ display: 'block' }}>
          Text Color (WIP)
          <input type="color" value={textColor} onChange={(e) => handleColor(e.target.value)} />
        </MenuItem>
        <MenuItem>
          Font Family
          <FormControl>
            <Select
              labelId="font-family-label"
              id="font-family-select"
              value={font}
              onChange={(e) => handleSetFont(e.target.value)}
            >
              {Object.keys(styleMap).map((font) => (
                <MenuItem key={font} value={font}style={{ fontFamily: styleMap[font].fontFamily }}>
                  {font}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
    
        </MenuItem>
      </Menu>
    </div>
  );
};

export default TextStyles;

export const styleMap = {
  'Arial': {
    fontFamily: 'Arial',
  },
  'Arial Black': {
    fontFamily: 'Arial Black',
  },
  'Book Antiqua': {
    fontFamily: 'Book Antiqua',
  },
  'Comic Sans MS': {
    fontFamily: 'Comic Sans MS',
  },
  'Courier': {
    fontFamily: 'Courier',
  },
  'Garamond': {
    fontFamily: 'Garamond',
  },
  'Georgia': {
    fontFamily: 'Georgia',
  },
  'Helvetica': {
    fontFamily: 'Helvetica',
  },
  'Impact': {
    fontFamily: 'Impact',
  },
  'Lucida Console': {
    fontFamily: 'Lucida Console',
  },
  'Lucida Sans Unicode': {
    fontFamily: 'Lucida Sans Unicode',
  },
  'Palatino Linotype': {
    fontFamily: 'Palatino Linotype',
  },
  'Trebuchet MS': {
    fontFamily: 'Trebuchet MS',
  },
  'Times New Roman': {
    fontFamily: 'Times New Roman',
  },
  'Verdana': {
    fontFamily: 'Verdana',
  },
};
