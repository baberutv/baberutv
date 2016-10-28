import provideContext from 'context-provider/lib/provideContext';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import React, { PropTypes, PureComponent } from 'react';
import URLSearchParams from 'url-search-params';
import styles from '../styles/app.css';
import Video from './video';

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
export default class App extends PureComponent {
  static contextTypes = {
    insertCss: PropTypes.func.isRequired,
  };

  static displayName = 'App';

  state = {
    videoUri: null,
  };

  componentWillMount() {
    const queryString = getQueryString();
    const searchParams = new URLSearchParams(queryString);
    const videoUri = searchParams.get('uri');
    if (videoUri) {
      this.setState({ videoUri });
    }
  }

  render() {
    return (
      <div className="app">
        <Video src={this.state.videoUri} />
      </div>
    );
  }
}
