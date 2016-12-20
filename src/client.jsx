/* @flow */

import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';

function insertCss(...styles: Array<Object>): () => void {
  // eslint-disable-next-line no-underscore-dangle
  const removeStyles = styles.map(style => style._insertCss());
  return () => {
    removeStyles.forEach(removeStyle => removeStyle());
  };
}

console.log(process.env.NODE_ENV);

ReactDOM.render(<App context={{ insertCss }} />, document.getElementById('root'));
