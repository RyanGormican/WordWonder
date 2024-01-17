import React, { useState} from 'react';
import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

const History = ({ darkMode, versionStack, editorState, handleEditorStateChange }) => {
  const [historyAnchorEl, setHistoryAnchorEl] = useState(null);

  const handleHistoryClick = (event) => {
    setHistoryAnchorEl(event.currentTarget);
  };

  const handleHistoryClose = () => {
    setHistoryAnchorEl(null);
  };

  const handleVersionClick = (index) => {
    const selectedVersion = versionStack[index].editorState;
    handleEditorStateChange(selectedVersion);
    handleHistoryClose();
  };

  return (
    <div>
      <Button onClick={handleHistoryClick} component="span" style={{ color: darkMode ? 'white' : 'black' }}>
        <Icon icon="material-symbols:history" height="30" />
      </Button>

      <Menu
        anchorEl={historyAnchorEl}
        open={Boolean(historyAnchorEl)}
        onClose={handleHistoryClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {versionStack.map((version, index) => (
          <MenuItem key={index} onClick={() => handleVersionClick(index)}>
            Version {index + 1} - {new Date(version.timestamp).toLocaleString()} 
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
export default History;