import React, {useState} from 'react';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';
import { AtomicBlockUtils, Editor, EditorState, RichUtils,Modifier, Entity,ContentBlock, ContentState, InlineStyle, SelectionState } from 'draft-js';
const SearchAndReplace = ({editorState, handleEditorStateChange}) => {
const [searchAnchorEl, setSearchAnchorEl] = useState(null);
 const handleSearchClose = () => {
    setSearchAnchorEl(null);
  };
   const handleSearchClick = (event) => {
    setSearchAnchorEl(event.currentTarget);
  };
return(
<div>
<Button style={{color:'white'}} onClick={handleSearchClick}>
<Icon icon="ph:list-magnifying-glass" height="30" />
</Button>
  <Menu
          anchorEl={searchAnchorEl}
          open={Boolean(searchAnchorEl)}
          onClose={handleSearchClose}
        >
          <MenuItem>
            
          </MenuItem>
        </Menu>
</div>
)
};
export default SearchAndReplace;