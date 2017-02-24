import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';

function insertCss(...styles) {
  // eslint-disable-next-line no-underscore-dangle
  const removeStyles = styles.map(style => style._insertCss());
  return () => {
    removeStyles.forEach(removeStyle => removeStyle());
  };
}

ReactDOM.render(<App context={{ insertCss }} />, document.getElementById('root'));
