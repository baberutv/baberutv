import provideContext from 'context-provider/lib/provideContext';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import React, { PropTypes, PureComponent } from 'react';
import styles from '../styles/app.css';
import Video from './video';

@provideContext({
  insertCss: PropTypes.func.isRequired
})
@withStyles(styles)
export default class App extends PureComponent {
  static contextTypes = {
    insertCss: PropTypes.func.isRequired
  };

  static displayName = 'App';

  state = {
    videoUri: null
  }

  componentDidMount() {
    const queryString = (location.search || '?').slice(1);
    const searchParams = new URLSearchParams(queryString);
    const videoUri = searchParams.get('uri');
    this.setState({ videoUri });
  }

  render() {
    return (
      <div className="app">
        <Video src={this.state.videoUri} />
      </div>
    );
  }
}
