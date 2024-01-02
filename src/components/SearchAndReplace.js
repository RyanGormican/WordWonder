import React, { useState, useEffect, useRef } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';
import { Editor, EditorState, Modifier,SelectionState,blockLength } from 'draft-js';

const SearchAndReplace = ({ editorState, handleEditorStateChange }) => {
  const [searchAnchorEl, setSearchAnchorEl] = useState(null);
  const [search, setSearch] = useState(null);
  const [occurrences, setOccurrences] = useState(0);
  const [currentInstance, setCurrentInstance] = useState(0);
  const searchPositionsRef = useRef([]);

  const editorStateRef = useRef(editorState);

  useEffect(() => {
    editorStateRef.current = editorState;
  }, [editorState]);

  useEffect(() => {
    if (search) {
      const newSearchPositions = findSearchPositions(editorStateRef.current, search);
      searchPositionsRef.current = newSearchPositions;
      setOccurrences(newSearchPositions.length);
    }
  }, [search, editorStateRef.current]);

  useEffect(() => {
    if (search && currentInstance >= 0 && currentInstance < occurrences) {
      const contentState = editorStateRef.current.getCurrentContent();

      const { blockKey, offset } = searchPositionsRef.current[currentInstance];

   const newSelection = SelectionState.createEmpty(blockKey).merge({
  anchorOffset: blockLength,
  focusOffset: blockLength,
});
const newEditorState = EditorState.forceSelection(
  editorStateRef.current,
  newSelection
);
handleEditorStateChange(newEditorState);
      handleEditorStateChange(newEditorState);
    }
  }, [search, currentInstance, occurrences]);

  const handleSearchClose = () => {
    setSearchAnchorEl(null);
  };

  const handleSearchClick = (event) => {
    setSearchAnchorEl(event.currentTarget);
  };

  const handleSearch = (event) => {
    setSearch(event);
    setCurrentInstance(0);
    const newSearchPositions = findSearchPositions(editorStateRef.current, event);
    searchPositionsRef.current = newSearchPositions;
    setOccurrences(newSearchPositions.length);
  };

  const handleNextInstance = (direction) => {
    setCurrentInstance((prevInstance) => {
      let nextInstance = prevInstance + direction;
      if (nextInstance < 0) {
        nextInstance = occurrences - 1;
      } else if (nextInstance >= occurrences) {
        nextInstance = 0;
      }
      return nextInstance;
    });
  };
  const findSearchPositions = (editorState, term) => {
    const contentState = editorState.getCurrentContent();
    const termText = term.toLowerCase();
    const searchPositions = [];

    contentState.getBlockMap().forEach((block) => {
      const text = block.getText().toLowerCase();
      let startIndex = 0;

      while (startIndex < text.length) {
        const index = text.indexOf(termText, startIndex);

        if (index !== -1) {
          searchPositions.push({
            blockKey: block.getKey(),
            offset: index,
          });
          startIndex = index + termText.length;
        } else {
          break;
        }
      }
    });

    return searchPositions;
  };

  return (
    <div>
      <Button style={{ color: 'white' }} onClick={handleSearchClick}>
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
          {occurrences > 0 ? (  
          <div>
          {currentInstance + 1} / {occurrences}
          </div>
            ) : ( 
            <div>
            0 results found
            </div>
            )}
          <Icon
            icon="mdi:arrow-drop-up"
            onClick={() => handleNextInstance(-1)}
            style={{ cursor: 'pointer' }}
          />
          <Icon
            icon="mdi:arrow-drop-down"
            onClick={() => handleNextInstance(1)}
            style={{ cursor: 'pointer' }}
          />
        </MenuItem>
      </Menu>
    </div>
  );
};
export default SearchAndReplace;