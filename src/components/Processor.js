import React, { useState,useRef } from 'react';
import {Editor, Modifier, EditorState} from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Icon } from '@iconify/react';
import Button from '@mui/material/Button';
import DocumentInfo from './DocumentInfo';
import Insert,{handleImageUpload} from './Insert';
import TextCommands from './TextCommands';
import TextStyles from './TextStyles';
import Import from './Import';
import Export from './Export';
import SearchAndReplace from './SearchAndReplace';
import 'draft-js/dist/Draft.css'; 
import { useDispatch, useSelector } from 'react-redux';
import { updateEditorState } from '../actions/editorActions';
const Processor = () => {
    const documentInfoRef = useRef();
    const { speechSynthesis } = window;

    const [dragging, setDragging] = useState(false);
  const dispatch = useDispatch();
  const editorState = useSelector((state) => state.editor.editorState);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [undoStack, setUndoStack] = useState([]);
const [redoStack, setRedoStack] = useState([]);
  const [isListening, setIsListening] = useState(false); 
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    let recognitionIsRunning = false;
 const [documentName, setDocumentName] = useState('document');

  const handleDocumentNameChange = (newDocumentName) => {
    setDocumentName(newDocumentName);
  };
const handleVoiceButtonClick = () => {
    if (recognitionIsRunning) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  recognition.onstart = () => {
    setIsListening(true);
    recognitionIsRunning = true;
  };

  recognition.onend = () => {
    setIsListening(false);
    recognitionIsRunning = false;
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const updatedEditorState = handleTranscribedText(transcript);
    handleEditorStateChange(updatedEditorState);
  };

  const handleTranscribedText = (transcript) => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const newContentState = contentState.createEntity('TOKEN', 'IMMUTABLE', { text: transcript });
    const entityKey = newContentState.getLastCreatedEntityKey();
    const textWithEntity = `${transcript} `;
    const updatedContentState = Modifier.replaceText(contentState, selectionState, textWithEntity, null, entityKey);
    const updatedEditorState = EditorState.push(editorState, updatedContentState, 'insert-characters');
    return updatedEditorState;
  };

 const handleTextToSpeech = () => {
    const selectedText = getSelectedText();
    const utterance = new SpeechSynthesisUtterance(selectedText);
    speechSynthesis.speak(utterance);
};

const getSelectedText = () => {
  const selection = editorState.getSelection();
  const currentContent = editorState.getCurrentContent();
  const selectedBlock = currentContent.getBlockForKey(selection.getStartKey());
  const start = selection.getStartOffset();
  const end = selection.getEndOffset();
  const selectedText = selectedBlock.getText().slice(start, end);

  return selectedText;
};



const handleUndo = () => {
  if (undoStack.length > 0) {
    const prevState = undoStack.pop();
    setRedoStack((prevRedoStack) => [editorState, ...prevRedoStack]);
    dispatch(updateEditorState(prevState));
  }
};

const handleRedo = () => {
  if (redoStack.length > 0) {
    const nextState = redoStack.shift();
    setUndoStack((prevUndoStack) => [...prevUndoStack, editorState]);
    dispatch(updateEditorState(nextState));
  }
};

 const handleDragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const files = e.dataTransfer.files;

    if (files.length > 0) {
    
      const imageFile = files[0];

      const reader = new FileReader();
      reader.onload = (readerEvent) => {
       
     handleImageUpload(editorState, handleEditorStateChange, { target: { files: [imageFile] } });
      };
      reader.readAsDataURL(imageFile);
    }
  };
 
const blockRenderer = (contentBlock) => {
  const type = contentBlock.getType();

  if (type === 'atomic') {
    return {
      component: AtomicBlock,
      editable: false,
    };
  }

  return null;
};

const AtomicBlock = (props) => {
  const { block, contentState } = props;
  const entity = contentState.getEntity(block.getEntityAt(0));
  const { src, height, width } = entity.getData();
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
                <td
                 style={{border:'1px solid black'}}
                >
               
                  Cell {rowIndex + 1}-{colIndex + 1}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return <img src={src} alt="Uploaded" style={{ width, height, maxWidth: '100%' }} />;
};

  const handleEditorStateChange = (newEditorState) => {
  setUndoStack((prevUndoStack) => [...prevUndoStack, newEditorState]);
  setRedoStack([]);   
    dispatch(updateEditorState(newEditorState));
    documentInfoRef.current.countWords();
    documentInfoRef.current.countCharacters();
    documentInfoRef.current.countSelected();
    documentInfoRef.current.countDocumentStatistics();
  };
  return (
    <div>
      <span className="activity">
      {/*Import TXTs */}
      <Import editorState={editorState} handleEditorStateChange={handleEditorStateChange} documentName={documentName} onDocumentNameChange={handleDocumentNameChange}/>
       {/*Download PDFs, HTMLs, Markdowns and TXTs*/}
        <Export editorState={editorState} documentName={documentName} exportFormat={exportFormat}/>
       {/*Insert Images & Date/Time*/}
       <Insert editorState={editorState} handleEditorStateChange={handleEditorStateChange}/> 
       {/*Bold Italicize Underline Strikethrough, Make Selection Uppercase,  Clear Formatting
       Bullet List, Numbered List, Code Blocks, Quote Blocks
       H1 H2 H3 H4 H5 H6
       Paragraph
       */}
       <TextCommands editorState={editorState} handleEditorStateChange={handleEditorStateChange}/>

       <TextStyles editorState={editorState} handleEditorStateChange={handleEditorStateChange}/>
         {/*Document Naming, Session Duration Counter, Set Export Format(PDF,HTML,Markdown,&TXT) Word and Character Count (Document and Selected), Sentence and Paragraph Counts, Average Characters per Word along with Words per Sentences and Sentences per Paragraph Counts, File Size Indication, Visual Max & Min Count Checker for Word & Character Limits/Goals*/}
      <DocumentInfo  ref={documentInfoRef}  documentName={documentName} onDocumentNameChange={handleDocumentNameChange} editorState={editorState} exportFormat={exportFormat} onExportFormatChange={setExportFormat} />
      
        <Button onClick={handleUndo}  style={{ color: undoStack.length > 0 ? 'white' : 'grey', pointerEvents: undoStack.length > 0 ? 'auto' : 'none' }}>
       <Icon icon= "material-symbols:undo" height="30" />
        </Button>
        <Button onClick={handleRedo}style={{ color: redoStack.length > 0 ? 'white' : 'grey', pointerEvents: redoStack.length > 0 ? 'auto' : 'none' }}>
        <Icon icon ="material-symbols:redo" height="30"/>
        </Button>
    <SearchAndReplace editorState={editorState} handleEditorStateChange={handleEditorStateChange}/>
      <Button style={{color: isListening? 'red':'white'}} onClick={handleVoiceButtonClick}>
      <Icon icon="mdi:microphone" height="30"/>
      </Button>
      <Button onClick={handleTextToSpeech} style={{ color: 'white' }}>
      <Icon icon="material-symbols:text-to-speech" height ="30"/>
      </Button>
    </span>

      <div 
      className={`drop-area ${dragging ? 'dragging' : ''}processor`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      >
        <Editor
          toolbarHidden
          editorState={editorState}
          onChange={handleEditorStateChange}
          wrapperClassName="processor-wrapper"
          editorClassName="processor-editor"
          spellCheck={true}
           blockRendererFn={blockRenderer}
        />
      </div>
    </div>
  );
};

export default Processor;