import provideContext from 'context-provider/lib/provideContext';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import React, { Component, PropTypes } from 'react';
import URLSearchParams from 'url-search-params';
import styles from '../styles/app.css';
import Header from './header';
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
@withStyles(styles)
export default class Main extends Component {
  static contextTypes = {
    insertCss: PropTypes.func.isRequired,
  };

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

  componentWillMount() {
    const queryString = getQueryString();
    const searchParams = new URLSearchParams(queryString);
    const videoUri = searchParams.get('uri');
    if (videoUri) {
      this.setState({ videoUri });
    } else {
      this.setState({
        open: true,
      });
    }
  }

  componentDidMount() {
    window.addEventListener('popstate', this.handlePopState);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.open !== nextState.open ||
      this.state.videoUri !== nextState.videoUri
    );
  }

  componentWillUpdate(nextProps, nextState) {
    const { open, videoUri } = nextState;
    if (this.state.videoUri !== videoUri) {
      if (videoUri && open) {
        this.setState({
          open: false,
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

  setVideo = ({ uri }) => {
    this.setState({
      videoUri: uri,
    });
  }

  handlePopState = ({ state }) => {
    const { videoUri = '' } = state || {};
    this.setState({ videoUri });
  }

  render() {
    return (
      <div>
        <Header videoUri={this.state.videoUri} />
        <main>
          <Player src={this.state.videoUri} />
        </main>
      </div>
    );
  }
}
