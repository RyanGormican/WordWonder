import React, { useState,useRef } from 'react';
import { AtomicBlockUtils, Editor, EditorState, RichUtils,Modifier, Entity,ContentBlock, ContentState, InlineStyle, SelectionState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Icon } from '@iconify/react';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import { getDocument } from 'pdfjs-dist';
import { stateToHTML } from 'draft-js-export-html';
import DocumentInfo from './DocumentInfo';
import Insert,{handleImageUpload} from './Insert';
import TextCommands from './TextCommands';
import TextStyles from './TextStyles';
import Export from './Export';
import 'draft-js/dist/Draft.css'; 
import { useDispatch, useSelector } from 'react-redux';
import { updateEditorState } from '../actions/editorActions';
const Processor = () => {
    const documentInfoRef = useRef();
    const [dragging, setDragging] = useState(false);
  const dispatch = useDispatch();
  const editorState = useSelector((state) => state.editor.editorState);
  const [linkInput, setLinkInput] = useState('');
  const [isUppercase, setIsUppercase] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [undoStack, setUndoStack] = useState([]);
const [redoStack, setRedoStack] = useState([]);

 const [lineSpacing, setLineSpacing] = useState(1.5); 
 const [documentName, setDocumentName] = useState('document');

  const handleDocumentNameChange = (newDocumentName) => {
    setDocumentName(newDocumentName);
  };


const loadPdf = async (file) => {
  const reader = new FileReader();

  reader.onload = async (event) => {
    const arrayBuffer = event.target.result;
    const pdfData = new Uint8Array(arrayBuffer);

    try {
      const loadingTask = getDocument({ data: pdfData });
      const pdf = await loadingTask.promise;

      let textContent = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const pageText = await page.getTextContent();
        textContent += pageText.items.map((item) => item.str).join(' ');
      }

      const contentState = ContentState.createFromText(textContent);
      const newEditorState = EditorState.push(
        editorState,
        contentState,
        'insert-characters'
      );
      handleEditorStateChange(newEditorState);
    } catch (error) {
      console.error('Error loading PDF:', error);
    }
  };

  reader.readAsArrayBuffer(file);
};

const importDocument = (event) => {
const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      loadPdf(file);
    }
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
        const imageDataUrl = readerEvent.target.result;
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
        <input type="file" onChange={importDocument} style={{ display: 'none' }} id="fileInput"  accept=".pdf" />
        <label htmlFor="fileInput">
          <Button component="span" style={{color: 'white'}}>
          <Icon icon="mdi:import" height="30" />
          </Button>
        </label>  
       {/*Download PDFs, HTMLs, and TXTs*/}
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

         {/*Document Naming, Session Duration Counter, Set Export Format(PDF,HTML&TXT) Word and Character Count (Document and Selected), Sentence and Paragraph Counts, Average Characters per Word along with Words per Sentences and Sentences per Paragraph Counts, File Size Indication, Visual Max & Min Count Checker for Word & Character Limits*/}
      <DocumentInfo  ref={documentInfoRef}  documentName={documentName} onDocumentNameChange={handleDocumentNameChange} editorState={editorState} exportFormat={exportFormat} onExportFormatChange={setExportFormat} />
      
        <Button onClick={handleUndo}  style={{ color: undoStack.length > 0 ? 'white' : 'grey', pointerEvents: undoStack.length > 0 ? 'auto' : 'none' }}>
       <Icon icon= "material-symbols:undo" height="30" />
        </Button>
        <Button onClick={handleRedo}style={{ color: redoStack.length > 0 ? 'white' : 'grey', pointerEvents: redoStack.length > 0 ? 'auto' : 'none' }}>
        <Icon icon ="material-symbols:redo" height="30"/>
        </Button>
      </span>

      <div 
      className={`drop-area ${dragging ? 'dragging' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="processor">
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
