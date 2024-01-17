import React, { useState,useRef, useEffect } from 'react';
import {Editor } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Icon } from '@iconify/react';
import Button from '@mui/material/Button';
import DocumentInfo from './DocumentInfo';
import Insert from './Insert';
import TextCommands from './TextCommands';
import TextStyles,{styleMap} from './TextStyles';
import Import from './Import';
import Export from './Export';
import SearchAndReplace from './SearchAndReplace';
import DocumentLayout from './DocumentLayout';
import VoiceInput from './VoiceInput';
import TextToSpeech from './TextToSpeech';
import Settings from './Settings';
import Comments from './Comments';
import History from './History';
import 'draft-js/dist/Draft.css'; 
import { useDispatch, useSelector } from 'react-redux';
import { updateEditorState } from '../actions/editorActions';
import {blockRenderer} from './BlockRender'; /* Handles basic display of images and tables. Basic image resizing*/
import { useDragState } from './ProcessorDrag'; /* Drag and drop for images and non styled text import */
const Processor = ({darkMode, toggleDarkMode}) => {
    const documentInfoRef = useRef();
     const [settings, setSettings] = useState({ voice: null,pitch: 1.0, speed: 1.0, volume: 1.0,  });
    const { dragging, handleDragEnter, handleDragLeave, handleDragOver, handleDrop } = useDragState();
  const dispatch = useDispatch();
  const editorState = useSelector((state) => state.editor.editorState);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [undoStack, setUndoStack] = useState([]);
  const [versionStack, setVersionStack] = useState([]);
const [redoStack, setRedoStack] = useState([]);
  const [comments, setComments] = useState([]);
 const [documentName, setDocumentName] = useState('document');
  const handleDocumentNameChange = (newDocumentName) => {
    setDocumentName(newDocumentName);
  };
    const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
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

  const timestamp = Date.now();
    setUndoStack((prevUndoStack) => [...prevUndoStack, newEditorState]);
  setRedoStack([]); 
    const version = { editorState: newEditorState, timestamp };
    setVersionStack((prevUndoStack) => [...prevUndoStack, version]);
    dispatch(updateEditorState(newEditorState));
    documentInfoRef.current.countWords();
    documentInfoRef.current.countCharacters();
    documentInfoRef.current.countSelected();
    documentInfoRef.current.countDocumentStatistics();
};

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          handleUndo();
        } else if (e.key === 'y') {
          e.preventDefault();
          handleRedo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleUndo, handleRedo]);
  return (
    <div>
      <span className="activity" style={{ border: darkMode ? 'none' : '1px solid black' }}>
      {/*Change Text to Speech Voice, Volume, Language, Pitch, and Speed */}
      <Settings darkMode={darkMode} settings={settings} handleSettingsChange={handleSettingsChange}/>
      {/*Maps over the stack allowing the user to click to revert to an appropriate version */}
      <History darkMode={darkMode} versionStack={versionStack} editorState = {editorState} handleEditorStateChange = {handleEditorStateChange}/>
      {/*Add, Update, Delete Non-Exportable Comments from a button */}
      <Comments comments = {comments} setComments = {setComments} darkMode={darkMode} editorState={editorState}/>
      {/*Document Outline formed of menu items of given headings. Click to jump to respective positioning of that heading text*/}
      <DocumentLayout  darkMode={darkMode} editorState={editorState} handleEditorStateChange={handleEditorStateChange}/>
      {/*Import TXTs */}
      <Import  darkMode={darkMode} editorState={editorState} handleEditorStateChange={handleEditorStateChange} documentName={documentName} onDocumentNameChange={handleDocumentNameChange}/>
       {/*Download/Export PDFs, HTMLs, Markdowns and TXTs*/}
        <Export  darkMode={darkMode} editorState={editorState} documentName={documentName} exportFormat={exportFormat} styleMap={styleMap} comments={comments}/>
       {/*Insert Images & Date/Time*/}
       <Insert  darkMode={darkMode} editorState={editorState} handleEditorStateChange={handleEditorStateChange}/> 
       {/*Bold Italicize Underline Strikethrough, Make Selection Uppercase,  Clear Formatting
       Bullet List, Numbered List, Code Blocks, Quote Blocks
       H1 H2 H3 H4 H5 H6
       Paragraph
       */}
       <TextCommands  darkMode={darkMode} editorState={editorState} handleEditorStateChange={handleEditorStateChange}/>
       {/*Change Font Family from 64 fonts, Change text and background color from 7 colors, Change font size from 1px to 92px */}
       <TextStyles  darkMode={darkMode} editorState={editorState} handleEditorStateChange={handleEditorStateChange}/>
         {/*Document Naming, Pauseable Session Duration Counter, Flesch Reading Ease Score, Word Frequency Analysis, Set Export Format(PDF,HTML,Markdown,&TXT) Word and Character Count (Document and Selected), Sentence, Syllables and Paragraph Counts, Average Characters per Word along with Words per Sentences and Sentences per Paragraph Counts, File Size Indication, Visual Max & Min Count Checker for Word & Character Limits/Goals*/}
      <DocumentInfo  darkMode={darkMode} ref={documentInfoRef}  documentName={documentName} onDocumentNameChange={handleDocumentNameChange} editorState={editorState} exportFormat={exportFormat} onExportFormatChange={setExportFormat} />
      
        <Button onClick={handleUndo}  style={{ color: undoStack.length > 0 ? (darkMode? 'white': 'black') : 'grey', pointerEvents: undoStack.length > 0 ? 'auto' : 'none' }}>
       <Icon icon= "material-symbols:undo" height="30" />
        </Button>
        <Button onClick={handleRedo}style={{ color: redoStack.length > 0 ? (darkMode? 'white': 'black') : 'grey', pointerEvents: redoStack.length > 0 ? 'auto' : 'none' }}>
        <Icon icon ="material-symbols:redo" height="30"/>
        </Button>
    {/*Search and find # of occurance of a given text, Transition to the position of that given item*/}
    <SearchAndReplace  darkMode={darkMode} editorState={editorState} handleEditorStateChange={handleEditorStateChange}/>
    {/*Simple voice to text translation*/}
    <VoiceInput darkMode={darkMode} editorState={editorState} handleEditorStateChange={handleEditorStateChange}/>
    {/*Simple text to speech */}
    <TextToSpeech settings={settings} darkMode={darkMode} editorState={editorState}/>
    {darkMode? <Icon icon="ph:moon" onClick={toggleDarkMode}/>:<Icon icon="ph:sun" onClick={toggleDarkMode}/>}
    </span>

      <div 
      className={`drop-area ${dragging ? 'dragging' : ''}processor`}
      onDragEnter={(e) =>handleDragEnter(e)}
      onDragLeave={(e) =>handleDragLeave(e)}
      onDragOver={(e) =>handleDragOver(e)}
      onDrop={(e) =>handleDrop(e,{editorState, handleEditorStateChange})}
     style={{ border: darkMode ? 'none' : '1px solid black' }}
      >
        <Editor
          toolbarHidden
          editorState={editorState}
          customStyleMap={styleMap}
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