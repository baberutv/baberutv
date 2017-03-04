import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

function insertCss(...styles) {
  // eslint-disable-next-line no-underscore-dangle
  const removeStyles = styles.map(style => style._insertCss());
  return () => {
    removeStyles.forEach(removeStyle => removeStyle());
  };
}

function render(component, container) {
  return new Promise((resolve, reject) => {
    try {
      ReactDOM.render(component, container, resolve);
    } catch (error) {
      reject(error);
    }
  });
}

async function main() {
  const container = document.getElementById('root');
  const { default: App } = await import('./app');
  try {
    await render((
      <Router>
        <App context={{ insertCss }} />
      </Router>
    ), container);
  } catch (error) {
    console.error(error); // eslint-disable-line no-console
  }
}

main();
