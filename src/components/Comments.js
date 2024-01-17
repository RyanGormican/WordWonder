import React, { useState, useRef } from 'react';
import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

const Comments = ({ darkMode, comments, setComments, editorState }) => {
  const [commentsAnchorEl, setCommentsAnchorE1] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const inputRef = useRef(null);
  const [commentIndex, setCommentIndex] = useState(null);

  const handleCommentsClick = (event) => {
    setCommentsAnchorE1(event.currentTarget);
  };

  const handleCommentsClose = () => {
    setCommentsAnchorE1(null);
    setCommentIndex(null);
  };
  const handleCommentClick = (index) => {
     if (commentIndex !== index) { 
  setCommentIndex(index);
  } else 
  {
    setCommentIndex(null);
  }
 
  };
  const handleAddComment = () => {
    if (newComment.trim() !== '') {
      const commentTimestamp = new Date().toLocaleString();
      const commentWithTimestamp = { text: newComment, timestamp: commentTimestamp };
      setComments((prevComments) => [...prevComments, commentWithTimestamp]);
      setNewComment('');
    }
  };

  const handleDeleteComment = (index) => {
    const newComments = [...comments];
    newComments.splice(index, 1);
    setComments(newComments);
    setHoveredIndex(null);
  };

  const handleMenuItemKeyDown = (e) => {
    e.stopPropagation();
  };

  const handleCommentMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleCommentMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <div>
      <Button onClick={handleCommentsClick} component="span" style={{ color: darkMode ? 'white' : 'black' }}>
        <Icon icon="mdi:comments" height="30" />
      </Button>

      <Menu
        anchorEl={commentsAnchorEl}
        open={Boolean(commentsAnchorEl)}
        onClose={handleCommentsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onKeyDown={handleMenuItemKeyDown}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Add a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Icon onClick={handleAddComment} icon="material-symbols:add-comment" />
        </MenuItem>
        {comments.map((comment, index) => (
          <MenuItem
            key={index}
            onMouseEnter={() => handleCommentMouseEnter(index)}
            onMouseLeave={handleCommentMouseLeave}
            class="comment"
          >
            {commentIndex === index ? (
              <input
                type="text"
                value={comment.text}
                onChange={(e) => {
                  const updatedComments = [...comments];
                  updatedComments[index].text = e.target.value;
                  setComments(updatedComments);
                }}
              />
            ) : (
              <span>{comment.text}</span>
            )}
            {hoveredIndex === index && (
              <span style={{ marginLeft: '5px' }}>
              <Icon onClick={() => handleCommentClick(index)} icon="mdi:pencil" />   ( {comment.timestamp} ) <Icon onClick={() => handleDeleteComment(index)} icon="mdi:trash" />
              </span>
            )}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default Comments;
