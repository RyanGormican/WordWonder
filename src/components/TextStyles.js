import React, {useState} from 'react';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
const TextStyles = ({editorState, handleEditorStateChange}) => {
  const [fontSize, setFontSize] = useState(14);
   const [textColor, setTextColor] = useState('black');
  const [textStylesAnchorEl, setTextStylesAnchorEl] = useState(null);

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
 
 const handleColor = (event) => {
 setTextColor(event);
 
 }
   



return (
<div>
  <Button onClick={handleTextStylesClick}  style ={{color:'white'}}>Text Styles</Button>
        <Menu
          anchorEl={textStylesAnchorEl}
          open={Boolean(textStylesAnchorEl)}
          onClose={handleTextStylesClose}
        >
          <MenuItem>
            Font Size (WIP)
            <Button onClick={handleFontSizeDecrease}>-</Button>
            {fontSize}
            <Button onClick={handleFontSizeIncrease}>+</Button>
          </MenuItem>
          <MenuItem>
            Text Color (WIP)
            <input
              type="color"
              value={textColor}
              onChange={(e) => handleColor(e.target.value)}
             />
</MenuItem>
        </Menu>

</div>
);
};
export default TextStyles;