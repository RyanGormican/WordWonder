import React, {useState, useEffect} from 'react';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';
import { AtomicBlockUtils, Editor, EditorState, RichUtils,Modifier, Entity,ContentBlock, ContentState, InlineStyle, SelectionState } from 'draft-js';
const SearchAndReplace = ({editorState, handleEditorStateChange}) => {
const [searchAnchorEl, setSearchAnchorEl] = useState(null);
const [search,setSearch] = useState(null);
 const handleSearchClose = () => {
    setSearchAnchorEl(null);
  };
   const handleSearchClick = (event) => {
    setSearchAnchorEl(event.currentTarget);
  };
   const handleSearch = (event) => {
 setSearch(event);
 }
 const [occurrences, setOccurrences] = useState(0);
   useEffect(() => {
   if (search)
   {
    const contentText = editorState.getCurrentContent().getPlainText();
    const term = search.toLowerCase();
    const count = contentText.toLowerCase().split(term).length - 1;
    setOccurrences(count);
    }
  }, [search, editorState]);  
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
        <input 
        type="text"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        />
        <Icon icon="ph:magnifying-glass" />
         / {occurrences}
        <Icon icon="mdi:arrow-drop-up" />
        <Icon icon="mdi:arrow-drop-down"/>
          </MenuItem>
        </Menu>
</div>
)
};
export default SearchAndReplace;