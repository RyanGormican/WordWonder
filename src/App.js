import './App.css';
import { Icon } from '@iconify/react';
import Processor from './components/Processor';
import 'contenido/dist/styles.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <div className="title">
      WordWonder
      </div>
        <Processor />
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
        </div>
      </header>
    </div>
  );
}

export default App;
