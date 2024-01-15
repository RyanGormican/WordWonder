import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Editor, EditorState } from 'draft-js';
import { updateEditorState } from '../actions/editorActions';

const AtomicBlock = (props) => {
  const { block, contentState } = props;
  const entity = contentState.getEntity(block.getEntityAt(0));
  const { src, height, width } = entity.getData();

  const dispatch = useDispatch();
  const editorState = useSelector((state) => state.editor.editorState);

  const [resizing, setResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  const ghostImageRef = useRef(null); 

  const initialDimensions = useRef({ width, height });

  const MIN_WIDTH = 2; 
  const MIN_HEIGHT = 2; 

  const handleMouseDown = (e) => {
    e.preventDefault();
    setResizing(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
  };

  const handleMouseMove = (e) => {
    if (resizing) {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = initialDimensions.current.width + deltaX;
      let newHeight = initialDimensions.current.height + deltaY;

    
      newWidth = Math.max(newWidth, MIN_WIDTH);
      newHeight = Math.max(newHeight, MIN_HEIGHT);


      if (ghostImageRef.current) {
        ghostImageRef.current.style.width = `${newWidth}px`;
        ghostImageRef.current.style.height = `${newHeight}px`;
      }

      const newEntityData = { ...entity.getData(), width: newWidth, height: newHeight };

      const newContentState = contentState.mergeEntityData(block.getEntityAt(0), newEntityData);
      const newEditorState = EditorState.push(editorState, newContentState, 'change-block-data');
      dispatch(updateEditorState(newEditorState));
    }
  };

  const handleMouseUp = () => {
    setResizing(false);

    if (ghostImageRef.current) {
      ghostImageRef.current.style.width = '0';
      ghostImageRef.current.style.height = '0';
    }
  };

  useEffect(() => {
    initialDimensions.current = { width, height };
  }, [width, height]);

  if (entity.getType() === 'DATETIME') {
    const value = entity.getData().value;
    return <div>{value}</div>;
  }

  if (entity.getType() === 'TABLE') {
    const { rows, columns } = entity.getData();
    return (
      <table>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td style={{ border: '1px solid black' }}>
                  Cell {rowIndex + 1}-{colIndex + 1}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  if (entity.getType() === 'image') {
    return (
      <div>
     
        <div
          ref={ghostImageRef}
          style={{
            position: 'absolute',
            zIndex: 999,
            pointerEvents: 'none',
            width: '0',
            height: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.3)', 
          }}
        ></div>


        <img
          src={src}
          alt="Uploaded"
          style={{ width, height, maxWidth: '100%', cursor: 'pointer' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseOut={handleMouseUp}
        />
      </div>
    );
  }

  return null;
};

export const blockRenderer = (contentBlock) => {
  const type = contentBlock.getType();

  if (type === 'atomic') {
    return {
      component: AtomicBlock,
      editable: false,
    };
  }

  return null;
};

export default AtomicBlock;
