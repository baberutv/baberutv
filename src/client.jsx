import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';

const currentScript = document.currentScript || (() => {
  const scripts = document.getElementsByTagName('script');
  return scripts[scripts.length - 1];
})();
const container = document.createElement('div');
currentScript.parentNode.insertBefore(container, currentScript);

function insertCss(...styles) {
  // eslint-disable-next-line no-underscore-dangle
  const removeStyles = styles.map(style => style._insertCss());
  return () => {
    removeStyles.forEach(removeStyle => removeStyle());
  };
}

ReactDOM.render(<App context={{ insertCss }} />, container);
