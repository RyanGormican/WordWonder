import React, { useState, useEffect, useRef, useMemo } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';
import { EditorState, SelectionState, Modifier } from 'draft-js';

const SearchAndReplace = ({ editorState, handleEditorStateChange }) => {
  const [searchAnchorEl, setSearchAnchorEl] = useState(null);
  const [search, setSearch] = useState('');
  const [replace, setReplace] = useState('');
  const [occurrences, setOccurrences] = useState(0);
  const [currentInstance, setCurrentInstance] = useState(0);
  const searchPositionsRef = useRef([]);
const findSearchPositions = (editorState, term) => {
  const contentState = editorState.getCurrentContent();
  
  const searchPositions = [];

  contentState.getBlockMap().forEach((block) => {
    if (block) {
      const text = block.getText();

      if (text && term) {
        const termText = term.toLowerCase();
        const lowerCaseText = text.toLowerCase();
        let startIndex = 0;

        while (startIndex < lowerCaseText.length) {
          const index = lowerCaseText.indexOf(termText, startIndex);

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
      }
    }
  });

  return searchPositions;
};

  const memoizedSearchPositions = useMemo(() => {
    return findSearchPositions(editorState, search);
  }, [editorState, search]);

  const handleSearchClose = () => {
    setSearchAnchorEl(null);
  };

  const handleSearchClick = (event) => {
    setSearchAnchorEl(event.currentTarget);
  };

 const handleSearch = (event) => {
  setSearch(event);
  setCurrentInstance(0);
};

const handleNextInstance = (direction) => {
  setCurrentInstance((prevInstance) => {
    if (occurrences > 0) {
      const nextInstance = (prevInstance + direction + occurrences) % occurrences;

      if (memoizedSearchPositions && memoizedSearchPositions[nextInstance]) {
        const { blockKey, offset } = memoizedSearchPositions[nextInstance];

        const newSelection = new SelectionState({
          anchorKey: blockKey,
          anchorOffset: offset,
          focusKey: blockKey,
          focusOffset: offset + search.length,
        });

        const newEditorState = EditorState.forceSelection(editorState, newSelection);
  const selectedBlockNode = document.querySelector(`[data-offset-key="${blockKey}-0-0"]`);
  if (selectedBlockNode) {
    selectedBlockNode.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
        handleEditorStateChange(newEditorState);
      }

      return nextInstance;
    } else {
      return prevInstance;
    }
  });
};





  useEffect(() => {
    if (search) {
      searchPositionsRef.current = memoizedSearchPositions;
      setOccurrences(memoizedSearchPositions.length);

      if (
        currentInstance >= 0 &&
        currentInstance < occurrences &&
        searchPositionsRef.current &&
        searchPositionsRef.current[currentInstance]
      ) {
        const { blockKey, offset } = searchPositionsRef.current[currentInstance];

        const selection = SelectionState.createEmpty(blockKey).merge({
          anchorOffset: offset,
          focusOffset: offset + search.length,
        });

        const contentState = Modifier.replaceText(
          editorState.getCurrentContent(),
          selection,
          search
        );

        const newEditorState = EditorState.push(
          editorState,
          contentState,
          'insert-characters'
        );

        handleEditorStateChange(newEditorState);
      }
    }
  }, [search, occurrences, currentInstance, editorState, handleEditorStateChange, memoizedSearchPositions]);

  
const replaceText = () => {
  if (search && replace) {
    if (memoizedSearchPositions && memoizedSearchPositions[currentInstance]) {
      const { blockKey, offset } = memoizedSearchPositions[currentInstance];

      const contentState = editorState.getCurrentContent();
      const selection = SelectionState.createEmpty(blockKey).merge({
        anchorOffset: offset,
        focusOffset: offset + search.length,
      });

      const newContentState = Modifier.replaceText(
        contentState,
        selection,
        replace
      );

      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        'replace-text'
      );

      handleEditorStateChange(newEditorState);
    }
  }
};




const replaceAll = () => {
  console.log('Executing replaceAll');
  if (search && replace) {
    let newContentState = editorState.getCurrentContent();

    memoizedSearchPositions.forEach(({ blockKey, offset }) => {
      console.log('Block key:', blockKey);
      console.log('Offset:', offset);

      const selection = SelectionState.createEmpty(blockKey).merge({
        anchorOffset: offset,
        focusOffset: offset + search.length,
      });

      console.log('Current selection:', selection.toJS());

      newContentState = Modifier.replaceText(
        newContentState,
        selection,
        replace
      );
    });

    console.log('New content state:', newContentState.toJS());

    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      'replace-text'
    );

    console.log('New editor state:', newEditorState);

    handleEditorStateChange(newEditorState);
    return;
  }

  handleEditorStateChange(editorState);
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
            {search.length>0? (
            <div>
              {currentInstance + 1} / {occurrences}
            </div>
            ):(
            ""
            )}
            </div>
          ) : (
            <div>
              {search ? (
                <div>
                  0 results found
                </div>
              ) : (
                ""
              )}
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
        <MenuItem>
          <input
            type="text"
            value={replace}
            onChange={(e) => setReplace(e.target.value)}
          />
          <Button onClick={replaceText} style={{color:'black'}}> Replace </Button> <Button onClick={replaceAll} style={{color:'black'}}> Replace All </Button> 
        </MenuItem>
      </Menu>
    </div>
  );
};
export default SearchAndReplace;