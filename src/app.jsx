import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
import Main from './components/main';

export default function App(props) {
  return (
    <MuiThemeProvider>
      <Main {...props} />
    </MuiThemeProvider>
  );
}

App.displayName = 'App';
