import provideContext from 'context-provider/lib/provideContext';
import dialogStyles from 'dialog-polyfill/dialog-polyfill.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import React, { Component, PropTypes } from 'react';
import URLSearchParams from 'url-search-params';
import database from '../databases/media';
import styles from '../styles/app.css';
import Header from './header';
import Modal from './modal';
import Player from './player';

function getQueryString() {
  if (typeof location === 'undefined') {
    return '';
  }
  return (location.search || '?').slice(1);
}

@provideContext({
  insertCss: PropTypes.func.isRequired,
})
@withStyles(dialogStyles, styles)
export default class App extends Component {
  static contextTypes = {
    insertCss: PropTypes.func.isRequired,
  };

  static childContextTypes = {
    setVideo: PropTypes.func.isRequired,
  };

  static displayName = 'App';

  constructor(...args) {
    super(...args);
    this.handlePopState = this.handlePopState.bind(this);
    this.setVideo = this.setVideo.bind(this);
  }

  state = {
    videoUri: null,
  };

  getChildContext() {
    return {
      setVideo: this.setVideo,
    };
  }

  componentWillMount() {
    const queryString = getQueryString();
    const searchParams = new URLSearchParams(queryString);
    const videoUri = searchParams.get('uri');
    if (videoUri) {
      this.setState({ videoUri });
    }
  }

  componentDidMount() {
    window.addEventListener('popstate', this.handlePopState);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.videoUri !== nextState.videoUri;
  }

  componentWillUpdate(nextProps, nextState) {
    const { videoUri } = nextState;
    if (this.state.videoUri !== videoUri) {
      const currentUri = location.pathname + location.search;
      const uri = `/${videoUri ? `?uri=${encodeURIComponent(videoUri)}` : ''}`;
      if (currentUri !== uri) {
        history.pushState({ videoUri }, document.title, uri);
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.handlePopState);
  }

  setVideo({ uri }) {
    database.transaction('rw', database.videos, async () => {
      if (uri && (await database.videos.where('uri').equals(uri).count()) < 1) {
        await database.videos.add({
          uri,
          createdAt: new Date(),
        });
      }
      this.setState({
        videoUri: uri,
      });
    });
  }

  handlePopState({ state }) {
    const { videoUri = '' } = state || {};
    this.setState({ videoUri });
  }

  render() {
    return (
      <div className="app">
        <Header videoUri={this.state.videoUri} />
        <main>
          <Player src={this.state.videoUri} />
          <Modal open={!this.state.videoUri} />
        </main>
      </div>
    );
  }
}
