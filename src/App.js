import './App.css';
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Processor from './components/Processor';
import 'contenido/dist/styles.css';
import {  useSelector } from 'react-redux';
import Feedback from './components/Feedback/Feedback';
function App() {

 const [darkMode, setDarkMode] = useState(true);
      const [isModalOpen, setIsModalOpen] = useState(false);
   const editorState = useSelector((state) => state.editor.editorState);
  const toggleDarkMode = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  };
  const toggleFeedbackModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
    <div className="App">
      <header className={darkMode ? 'App-header-darkmode': 'App-header-lightmode'}>
      <div className="title">
      WordWonder
      </div>
        <Processor darkMode={darkMode} toggleDarkMode={toggleDarkMode} editorState = {editorState}/>
         {isModalOpen && (
          <Feedback  isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
          )}
        <div className="links">
          <a href="https://www.linkedin.com/in/ryangormican/">
            <Icon icon="mdi:linkedin" color="#0e76a8" width="60" />
          </a>
          <a href="https://github.com/RyanGormican/WordWonder">
            <Icon icon="mdi:github" color="#e8eaea" width="60" />
          </a>
          <a href="https://ryangormicanportfoliohub.vercel.app/">
            <Icon icon="teenyicons:computer-outline" color="#199c35" width="60" />
          </a>
            <div className="cursor-pointer" onClick={() => toggleFeedbackModal()}>
          <Icon icon="material-symbols:feedback"  color="#e8eaea" width="60" />
        </div>
        </div>
      </header>
    </div>
  );
}

export default App;
