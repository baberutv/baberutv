import provideContext from 'context-provider/lib/provideContext';
import dialogStyles from 'dialog-polyfill/dialog-polyfill.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import React, { Component, PropTypes } from 'react';
import URLSearchParams from 'url-search-params';
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
    closeModal: PropTypes.func.isRequired,
    editVideo: PropTypes.func.isRequired,
    setVideo: PropTypes.func.isRequired,
  };

  static displayName = 'App';

  constructor(...args) {
    super(...args);
    this.handlePopState = this.handlePopState.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.editVideo = this.editVideo.bind(this);
    this.setVideo = this.setVideo.bind(this);
  }

  state = {
    editVideo: false,
    videoUri: null,
  };

  getChildContext() {
    const { closeModal, editVideo, setVideo } = this;
    return {
      closeModal,
      editVideo,
      setVideo,
    };
  }

  componentWillMount() {
    const queryString = getQueryString();
    const searchParams = new URLSearchParams(queryString);
    const videoUri = searchParams.get('uri');
    if (videoUri) {
      this.setState({ videoUri });
    } else {
      this.setState({
        editVideo: true,
      });
    }
  }

  componentDidMount() {
    window.addEventListener('popstate', this.handlePopState);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.editVideo !== nextState.editVideo ||
      this.state.videoUri !== nextState.videoUri
    );
  }

  componentWillUpdate(nextProps, nextState) {
    const { editVideo, videoUri } = nextState;
    if (this.state.videoUri !== videoUri) {
      if (videoUri && editVideo) {
        this.setState({
          editVideo: false,
        });
      }
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
    this.setState({
      videoUri: uri,
    });
  }

  editVideo() {
    if (!this.state.editVideo) {
      this.setState({
        editVideo: true,
      });
    }
  }

  closeModal() {
    if (this.state.editVideo) {
      this.setState({
        editVideo: false,
      });
    }
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
        </main>
        <Modal open={this.state.editVideo} videoUri={this.state.videoUri} />
      </div>
    );
  }
}
