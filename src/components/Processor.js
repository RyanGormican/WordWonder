import React, { useState,useRef } from 'react';
import {Editor} from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Icon } from '@iconify/react';
import Button from '@mui/material/Button';
import DocumentInfo from './DocumentInfo';
import Insert from './Insert';
import TextCommands from './TextCommands';
import TextStyles from './TextStyles';
import Import from './Import';
import Export from './Export';
import SearchAndReplace from './SearchAndReplace';
import DocumentLayout from './DocumentLayout';
import VoiceInput from './VoiceInput';
import TextToSpeech from './TextToSpeech';
import 'draft-js/dist/Draft.css'; 
import { useDispatch, useSelector } from 'react-redux';
import { updateEditorState } from '../actions/editorActions';
import {blockRenderer} from './BlockRender'; /* Handles basic display of images and tables */
import { useDragState } from './ProcessorDrag'; /* Drag and drop for images and non styled text import */
const Processor = () => {
    const documentInfoRef = useRef();
    const { dragging, handleDragEnter, handleDragLeave, handleDragOver, handleDrop } = useDragState();
  const dispatch = useDispatch();
  const editorState = useSelector((state) => state.editor.editorState);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [undoStack, setUndoStack] = useState([]);
const [redoStack, setRedoStack] = useState([]);
 const [documentName, setDocumentName] = useState('document');
  const handleDocumentNameChange = (newDocumentName) => {
    setDocumentName(newDocumentName);
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
      {/*Document Outline formed of menu items of given headings. Click to jump to respective positioning of that heading text*/}
      <DocumentLayout editorState={editorState} handleEditorStateChange={handleEditorStateChange}/>
      {/*Import TXTs */}
      <Import editorState={editorState} handleEditorStateChange={handleEditorStateChange} documentName={documentName} onDocumentNameChange={handleDocumentNameChange}/>
       {/*Download/Export PDFs, HTMLs, Markdowns and TXTs*/}
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
         {/*Document Naming, Pauseable Session Duration Counter, Flesch Reading Ease Score, Set Export Format(PDF,HTML,Markdown,&TXT) Word and Character Count (Document and Selected), Sentence and Paragraph Counts, Average Characters per Word along with Words per Sentences and Sentences per Paragraph Counts, File Size Indication, Visual Max & Min Count Checker for Word & Character Limits/Goals*/}
      <DocumentInfo  ref={documentInfoRef}  documentName={documentName} onDocumentNameChange={handleDocumentNameChange} editorState={editorState} exportFormat={exportFormat} onExportFormatChange={setExportFormat} />
      
        <Button onClick={handleUndo}  style={{ color: undoStack.length > 0 ? 'white' : 'grey', pointerEvents: undoStack.length > 0 ? 'auto' : 'none' }}>
       <Icon icon= "material-symbols:undo" height="30" />
        </Button>
        <Button onClick={handleRedo}style={{ color: redoStack.length > 0 ? 'white' : 'grey', pointerEvents: redoStack.length > 0 ? 'auto' : 'none' }}>
        <Icon icon ="material-symbols:redo" height="30"/>
        </Button>
    {/*Search and find # of occurance of a given text, Transition to the position of that given item*/}
    <SearchAndReplace editorState={editorState} handleEditorStateChange={handleEditorStateChange}/>
    {/*Simple voice to text translation*/}
    <VoiceInput editorState={editorState} handleEditorStateChange={handleEditorStateChange}/>
    {/*Simple text to speech */}
    <TextToSpeech editorState={editorState}/>
    </span>

      <div 
      className={`drop-area ${dragging ? 'dragging' : ''}processor`}
      onDragEnter={(e) =>handleDragEnter(e)}
      onDragLeave={(e) =>handleDragLeave(e)}
      onDragOver={(e) =>handleDragOver(e)}
      onDrop={(e) =>handleDrop(e,{editorState, handleEditorStateChange})}
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