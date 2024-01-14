import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App'; 
import store from './store'; 
import { fonts } from './components/Fonts';

function generateGoogleFontsLinks() {
  const googleFontsUrl = 'https://fonts.googleapis.com/css?family=';
  const fontsString = fonts.map(font => encodeURIComponent(font)).join('|');
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `${googleFontsUrl}${fontsString}&display=swap`;
  document.head.appendChild(link);
}

generateGoogleFontsLinks();

ReactDOM.render(
  <Provider store={store} >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);
