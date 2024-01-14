import React, { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { RichUtils, EditorState, Modifier } from 'draft-js';
import {fonts} from './Fonts';
const TextStyles = ({ darkMode, editorState, handleEditorStateChange }) => {
  const [fontSize, setFontSize] = useState(14);
  const [textColor, setTextColor] = useState(`Black  Text`);
  const [backgroundColor, setBackgroundColor] = useState('Clear');
  const [textStylesAnchorEl, setTextStylesAnchorEl] = useState(null);
  const [font, setFont] = useState('Arial')
  const handleTextStylesClose = () => {
    setTextStylesAnchorEl(null);
  };

  const handleTextStylesClick = (event) => {
    setTextStylesAnchorEl(event.currentTarget);
  };

const handleFontSize = (newFontSize) => {
  setFontSize(newFontSize);
  handleInlineStyleChange(editorState, handleEditorStateChange,'fontsize', newFontSize*10.0);
};

const handleColor = (selectedColor) => {
  setTextColor(selectedColor);
  handleInlineStyleChange(editorState, handleEditorStateChange,'color', selectedColor);
};

const handleSetFont = (fontFamily) => {
  setFont(fontFamily);
  handleInlineStyleChange(editorState, handleEditorStateChange,'font', fontFamily);
};
const handleBackgroundColor = (backgroundColor) =>{
 setBackgroundColor(backgroundColor);
 handleInlineStyleChange(editorState, handleEditorStateChange,'colorbackground',backgroundColor)
};

  return (
    <div>
      <Button onClick={handleTextStylesClick} style={{ color: darkMode ? 'white' : 'black' }}>
        Text Styles
      </Button>
      <Menu anchorEl={textStylesAnchorEl} open={Boolean(textStylesAnchorEl)} onClose={handleTextStylesClose}>
        <MenuItem>
          Font Size
           <input type="range" min="1" max="92" step="0.1" value={fontSize} onChange={(e)=> handleFontSize(e.target.value)}/>
          <input type="number" min="1" max="92" step="0.1" value={fontSize} onChange={(e)=> handleFontSize(e.target.value)}  onBlur={(e) => handleFontSize(e.target.value)}/>
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
    .filter((color) => styleMap[color].id === 'color' && color.endsWith('Text'))
    .map((color) => (
      <MenuItem key={color} value={color} style={{ color: styleMap[color].color }}>
        {color.replace(' Text', '')}
      </MenuItem>
    ))}
</Select>
          </FormControl>
          <input type="color" style={{display: 'none'}} value={textColor} onChange={(e) => handleColor(e.target.value)} />
        </MenuItem>
        <MenuItem>
          Background Color
          <FormControl>
            <Select
              labelId="colorBackground-label"
              id="colorBackground-select"
              value={backgroundColor}

              onChange={(e) => handleBackgroundColor(e.target.value)}
            >
              {Object.keys(styleMap)
                .filter((colorB) => styleMap[colorB].id === 'colorbackground')
              .map((colorB) => (
                <MenuItem key={colorB} value={colorB}style={{ backgroundColor: styleMap[colorB].backgroundColor, color: 'white' }}>
                  {colorB}
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
export const handleInlineStyleChange = (editorState, handleEditorStateChange, styleId, newValue) => {
  const selection = editorState.getSelection();
  const nextContentState = Object.keys(styleMap).reduce((contentState, styleKey) => {
    const style = styleMap[styleKey];

    if (style.id === styleId) {
      contentState = Modifier.removeInlineStyle(contentState, selection, styleKey);
    }

    return contentState;
  }, editorState.getCurrentContent());

  let nextEditorState = EditorState.push(editorState, nextContentState, 'change-inline-style');
  const currentStyle = editorState.getCurrentInlineStyle();

   if (styleId === 'colorbackground' && newValue === 'Clear') {
    nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, 'bgcolor-clear');
  }else if (!currentStyle.has(newValue)) {
    nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, newValue);
  }

  handleEditorStateChange(nextEditorState);
}; 
const createFontStyle = (fontFamily) => ({
  [fontFamily]: {
    fontFamily:`${fontFamily} `,
    id: 'font',
  },
});


const fontStyles = Object.assign({}, ...fonts.map(createFontStyle));
export const styleMap = {
...fontStyles,
   'Red Text' : {
   color: '#FF0000',
   id:'color',
   },
   'Orange Text':{
    color: '#FFA500',
     id:'color',
   },
   'Yellow  Text':{
   color: '#ffff00',
    id:'color',
   },
   'Green Text':{
   color: '#00FF00',
    id:'color',
   },
   'Blue  Text':{
   color: '#0000FF',
    id:'color',
   },
   'Purple  Text':{
   color: '#A020F0',
    id:'color',
   },
   'Black  Text':{
   color: '#000000',
    id:'color',
   },
     'Red' : {
   backgroundColor: '#FF0000',
   id:'colorbackground',
   },
   'Orange':{
    backgroundColor: '#FFA500',
     id:'colorbackground',
   },
   'Yellow':{
   backgroundColor: '#ffff00',
    id:'colorbackground',
   },
   'Green':{
   backgroundColor: '#00FF00',
    id:'colorbackground',
   },
   'Blue':{
   backgroundColor: '#0000FF',
    id:'colorbackground',
   },
   'Purple':{
   backgroundColor: '#A020F0',
    id:'colorbackground',
   },
   'Black':{
   backgroundColor: '#000000',
    id:'colorbackground',
   },
   'Clear':{
    backgroundColor:'null',
    id:'colorbackground',
   },
...Array.from({ length: 920 }, (_, index) => ({
    fontSize: `${(index + 1) / 10}px`,
    id: 'fontSize',
  })),
};
