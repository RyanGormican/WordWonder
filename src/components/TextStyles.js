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

  const handleFontSizeIncrease = () => {
    if (fontSize < 92) {
      const newFontSize = fontSize + 1;
        setFontSize(newFontSize);
      changeFontSize(newFontSize);
    
    }
  };

  const handleFontSizeDecrease = () => {
    if (fontSize > 1) {
      const newFontSize = fontSize - 1;
        setFontSize(newFontSize);
      changeFontSize(newFontSize);
    }
  };

  const changeFontSize = (newFontSize) => {
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
          Font Size (WIP)
          <Button onClick={handleFontSizeDecrease}>-</Button>
          {fontSize}
          <Button onClick={handleFontSizeIncrease}>+</Button>
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

export const styleMap = {
  'Arial': {
    fontFamily: 'Arial',
    id:'font',
  },
  'Arial Black': {
    fontFamily: 'Arial Black',
    id:'font',
  },
  'Book Antiqua': {
    fontFamily: 'Book Antiqua',
     id:'font',
  },
  'Comic Sans MS': {
    fontFamily: 'Comic Sans MS',
     id:'font',
  },
  'Courier': {
    fontFamily: 'Courier',
     id:'font',
  },
  'Garamond': {
    fontFamily: 'Garamond',
     id:'font',
  },
  'Georgia': {
    fontFamily: 'Georgia',
     id:'font',
  },
  'Helvetica': {
    fontFamily: 'Helvetica',
     id:'font',
  },
  'Impact': {
    fontFamily: 'Impact',
     id:'font',
  },
  'Lucida Console': {
    fontFamily: 'Lucida Console',
     id:'font',
  },
  'Lucida Sans Unicode': {
    fontFamily: 'Lucida Sans Unicode',
     id:'font',
  },
  'Palatino Linotype': {
    fontFamily: 'Palatino Linotype',
     id:'font',
  },
  'Times New Roman': {
    fontFamily: 'Times New Roman',
     id:'font',
  },
  'Trebuchet MS': {
    fontFamily: 'Trebuchet MS',
     id:'font',
  },
  'Verdana': {
    fontFamily: 'Verdana',
     id:'font',
  },
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
 1: {
    fontSize: '1px',
    id: 'fontSize',
  },
  2: {
    fontSize: '2px',
    id: 'fontSize',
  },
  3: {
    fontSize: '3px',
    id: 'fontSize',
  },
  4: {
    fontSize: '4px',
    id: 'fontSize',
  },
  5: {
    fontSize: '5px',
    id: 'fontSize',
  },
  6: {
    fontSize: '6px',
    id: 'fontSize',
  },
  7: {
    fontSize: '7px',
    id: 'fontSize',
  },
  8: {
    fontSize: '8px',
    id: 'fontSize',
  },
  9: {
    fontSize: '9px',
    id: 'fontSize',
  },
  10: {
    fontSize: '10px',
    id: 'fontSize',
  },
  11: {
    fontSize: '11px',
    id: 'fontSize',
  },
  12: {
    fontSize: '12px',
    id: 'fontSize',
  },
  13: {
    fontSize: '13px',
    id: 'fontSize',
  },
  14: {
    fontSize: '14px',
    id: 'fontSize',
  },
  15: {
    fontSize: '15px',
    id: 'fontSize',
  },
  16: {
    fontSize: '16px',
    id: 'fontSize',
  },
  17: {
    fontSize: '17px',
    id: 'fontSize',
  },
  18: {
    fontSize: '18px',
    id: 'fontSize',
  },
  19: {
    fontSize: '19px',
    id: 'fontSize',
  },
  20: {
    fontSize: '20px',
    id: 'fontSize',
  },
  21: {
    fontSize: '21px',
    id: 'fontSize',
  },
  22: {
    fontSize: '22px',
    id: 'fontSize',
  },
  23: {
    fontSize: '23px',
    id: 'fontSize',
  },
  24: {
    fontSize: '24px',
    id: 'fontSize',
  },
  25: {
    fontSize: '25px',
    id: 'fontSize',
  },
  26: {
    fontSize: '26px',
    id: 'fontSize',
  },
  27: {
    fontSize: '27px',
    id: 'fontSize',
  },
  28: {
    fontSize: '28px',
    id: 'fontSize',
  },
  29: {
    fontSize: '29px',
    id: 'fontSize',
  },
  30: {
    fontSize: '30px',
    id: 'fontSize',
  },
  31: {
    fontSize: '31px',
    id: 'fontSize',
  },
  32: {
    fontSize: '32px',
    id: 'fontSize',
  },
  33: {
    fontSize: '33px',
    id: 'fontSize',
  },
  34: {
    fontSize: '34px',
    id: 'fontSize',
  },
  35: {
    fontSize: '35px',
    id: 'fontSize',
  },
  36: {
    fontSize: '36px',
    id: 'fontSize',
  },
  37: {
    fontSize: '37px',
    id: 'fontSize',
  },
  38: {
    fontSize: '38px',
    id: 'fontSize',
  },
  39: {
    fontSize: '39px',
    id: 'fontSize',
  },
  40: {
    fontSize: '40px',
    id: 'fontSize',
  },
  41: {
    fontSize: '41px',
    id: 'fontSize',
  },
  42: {
    fontSize: '42px',
    id: 'fontSize',
  },
  43: {
    fontSize: '43px',
    id: 'fontSize',
  },
  44: {
    fontSize: '44px',
    id: 'fontSize',
  },
  45: {
    fontSize: '45px',
    id: 'fontSize',
  },
  46: {
    fontSize: '46px',
    id: 'fontSize',
  },
  47: {
    fontSize: '47px',
    id: 'fontSize',
  },
  48: {
    fontSize: '48px',
    id: 'fontSize',
  },
  49: {
    fontSize: '49px',
    id: 'fontSize',
  },
  50: {
    fontSize: '50px',
    id: 'fontSize',
  },
  51: {
    fontSize: '51px',
    id: 'fontSize',
  },
  52: {
    fontSize: '52px',
    id: 'fontSize',
  },
  53: {
    fontSize: '53px',
    id: 'fontSize',
  },
  54: {
    fontSize: '54px',
    id: 'fontSize',
  },
  55: {
    fontSize: '55px',
    id: 'fontSize',
  },
  56: {
    fontSize: '56px',
    id: 'fontSize',
  },
  57: {
    fontSize: '57px',
    id: 'fontSize',
  },
  58: {
    fontSize: '58px',
    id: 'fontSize',
  },
  59: {
    fontSize: '59px',
    id: 'fontSize',
  },
  60: {
    fontSize: '60px',
    id: 'fontSize',
  },
  61: {
    fontSize: '61px',
    id: 'fontSize',
  },
  62: {
    fontSize: '62px',
    id: 'fontSize',
  },
  63: {
    fontSize: '63px',
    id: 'fontSize',
  },
  64: {
    fontSize: '64px',
    id: 'fontSize',
  },
  65: {
    fontSize: '65px',
    id: 'fontSize',
  },
  66: {
    fontSize: '66px',
    id: 'fontSize',
  },
  67: {
    fontSize: '67px',
    id: 'fontSize',
  },
  68: {
    fontSize: '68px',
    id: 'fontSize',
  },
  69: {
    fontSize: '69px',
    id: 'fontSize',
  },
  70: {
    fontSize: '70px',
    id: 'fontSize',
  },
  71: {
    fontSize: '71px',
    id: 'fontSize',
  },
  72: {
    fontSize: '72px',
    id: 'fontSize',
  },
  73: {
    fontSize: '73px',
    id: 'fontSize',
  },
  74: {
    fontSize: '74px',
    id: 'fontSize',
  },
  75: {
    fontSize: '75px',
    id: 'fontSize',
  },
  76: {
    fontSize: '76px',
    id: 'fontSize',
  },
  77: {
    fontSize: '77px',
    id: 'fontSize',
  },
  78: {
    fontSize: '78px',
    id: 'fontSize',
  },
  79: {
    fontSize: '79px',
    id: 'fontSize',
  },
  80: {
    fontSize: '80px',
    id: 'fontSize',
  },
  81: {
    fontSize: '81px',
    id: 'fontSize',
  },
  82: {
    fontSize: '82px',
    id: 'fontSize',
  },
  83: {
    fontSize: '83px',
    id: 'fontSize',
  },
  84: {
    fontSize: '84px',
    id: 'fontSize',
  },
  85: {
    fontSize: '85px',
    id: 'fontSize',
  },
  86: {
    fontSize: '86px',
    id: 'fontSize',
  },
  87: {
    fontSize: '87px',
    id: 'fontSize',
  },
  88: {
    fontSize: '88px',
    id: 'fontSize',
  },
  89: {
    fontSize: '89px',
    id: 'fontSize',
  },
  90: {
    fontSize: '90px',
    id: 'fontSize',
  },
  91: {
    fontSize: '91px',
    id: 'fontSize',
  },
  92: {
    fontSize: '92px',
    id: 'fontSize',
  },
  
};
