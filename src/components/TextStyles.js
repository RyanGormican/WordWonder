import React, { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { RichUtils, EditorState, Modifier } from 'draft-js';

const TextStyles = ({ darkMode, editorState, handleEditorStateChange }) => {
  const [fontSize, setFontSize] = useState(14);
  const [textColor, setTextColor] = useState('Black');
  const [textStylesAnchorEl, setTextStylesAnchorEl] = useState(null);
  const [font, setFont] = useState('Arial')
  const handleTextStylesClose = () => {
    setTextStylesAnchorEl(null);
  };

  const handleFontSize = (newFontSize) => {
        setFontSize(newFontSize);
      changeFontSize(newFontSize);
  };

  const changeFontSize = (newFontSize) => {
  setFontSize(newFontSize);
   const selection = editorState.getSelection();
  const nextContentState = Object.keys(styleMap).reduce((contentState, styleKey) => {
    const style = styleMap[styleKey];
    
    if (style.id === 'fontsize') {
      contentState = Modifier.removeInlineStyle(contentState, selection, styleKey);
    }

    return contentState;
  }, editorState.getCurrentContent());

  let nextEditorState = EditorState.push(editorState, nextContentState, 'change-inline-style');
  const currentStyle = editorState.getCurrentInlineStyle();

  if (!currentStyle.has(newFontSize)) {
    nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, newFontSize);
  }

  handleEditorStateChange(nextEditorState);
  };

  const handleTextStylesClick = (event) => {
    setTextStylesAnchorEl(event.currentTarget);
  };

const handleColor = (selectedColor) => {
  setTextColor(selectedColor);
  const selection = editorState.getSelection();
  const nextContentState = Object.keys(styleMap).reduce((contentState, styleKey) => {
    const style = styleMap[styleKey];
    
    if (style.id === 'color') {
      contentState = Modifier.removeInlineStyle(contentState, selection, styleKey);
    }

    return contentState;
  }, editorState.getCurrentContent());

  let nextEditorState = EditorState.push(editorState, nextContentState, 'change-inline-style');
  const currentStyle = editorState.getCurrentInlineStyle();

  if (!currentStyle.has(selectedColor)) {
    nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, selectedColor);
  }

  handleEditorStateChange(nextEditorState);
 
};




const handleSetFont = (fontFamily) => {
  setFont(fontFamily);

  const selection = editorState.getSelection();
  const nextContentState = Object.keys(styleMap).reduce((contentState, styleKey) => {
    const style = styleMap[styleKey];
    
    if (style.id === 'font') {
      console.log(`Removing inline style for font: ${styleKey}`);
      contentState = Modifier.removeInlineStyle(contentState, selection, styleKey);
    }

    return contentState;
  }, editorState.getCurrentContent());

  let nextEditorState = EditorState.push(editorState, nextContentState, 'change-inline-style');
  const currentStyle = editorState.getCurrentInlineStyle();

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
          Font Size
           <input type="range" min="1" max="92" step="1" value={fontSize} onChange={(e)=> handleFontSize(e.target.value)}/>
          <input type="number" min="1" max="92" step="1" value={fontSize} onChange={(e)=> handleFontSize(e.target.value)}  onBlur={(e) => handleFontSize(e.target.value)}/>
        </MenuItem>
        <MenuItem>
          Text Color
          <FormControl>
            <Select
              labelId="color-label"
              id="color-select"
              value={textColor}

              onChange={(e) => handleColor(e.target.value)}
            >
              {Object.keys(styleMap)
                .filter((color) => styleMap[color].id === 'color')
              .map((color) => (
                <MenuItem key={color} value={color}style={{ color: styleMap[color].color }}>
                  {color}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <input type="color" style={{display: 'none'}} value={textColor} onChange={(e) => handleColor(e.target.value)} />
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
            {Object.keys(styleMap)
  .filter((font) => styleMap[font].id === 'font')
  .map((font) => (
    <MenuItem key={font} value={font} style={{ fontFamily: styleMap[font].fontFamily }}>
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
const createFontStyle = (fontFamily) => ({
  [fontFamily]: {
    fontFamily:`${fontFamily} `,
    id: 'font',
  },
});

const fonts = ['Arial', 'Arial Black', 'Book Antiqua','Cabin', 'Comic Sans MS', 'Courier', 'Garamond', 'Georgia','Helvetica', 'Impact','Lato','Lucida Console',  'Lucida Sans Unicode','Montserrat', 'Noto Sans', 'Open Sans',
  'Palatino Linotype','Raleway', 'Roboto','Source Sans Pro', 'Times New Roman','Trebuchet MS','Verdana'];

const fontStyles = Object.assign({}, ...fonts.map(createFontStyle));
export const styleMap = {
...fontStyles,
   'Red' : {
   color: '#FF0000',
   id:'color',
   },
   'Orange':{
    color: '#FFA500',
     id:'color',
   },
   'Yellow':{
   color: '#ffff00',
    id:'color',
   },
   'Green':{
   color: '#00FF00',
    id:'color',
   },
   'Blue':{
   color: '#0000FF',
    id:'color',
   },
   'Purple':{
   color: '#A020F0',
    id:'color',
   },
   'Black':{
   color: '#000000',
    id:'color',
   },
  ...Array.from({ length: 92 }, (_, index) => ({
    fontSize: `${index + 1}px`,
    id: 'fontSize',
  })),
};
