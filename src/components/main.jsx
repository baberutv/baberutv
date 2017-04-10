import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Loader from './loader';
import Header from './header';

export default class Main extends Component {
  static childContextTypes = {
    setVideo: PropTypes.func.isRequired,
  };

  static displayName = 'Main';

  state = {
    open: false,
    videoUri: null,
  };

  getChildContext() {
    return {
      setVideo: this.setVideo,
    };
  }

  setVideo = async ({ uri }) => new Promise((resolve) => {
    this.setState({ videoUri: uri }, resolve);
  })

  render() {
    return (
      <div>
        <Header open={this.state.open} videoUri={this.state.videoUri} />
        <main>
          <Route exact path="/" render={props => <Loader name="home" {...props} />} />
          <Route path="/player/" render={props => <Loader name="player" {...props} />} />
        </main>
      </div>
    );
  }
}
