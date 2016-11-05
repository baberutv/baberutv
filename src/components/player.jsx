import withStyles from 'isomorphic-style-loader/lib/withStyles';
import React, { Component, PropTypes } from 'react';
import styles from '../styles/player.css';
import Video from './video';

@withStyles(styles)
export default class Player extends Component {
  static displayName = 'Player';

  static propTypes = {
    src: PropTypes.string,
  };

  shouldComponentUpdate(nextProps) {
    return this.props.src !== nextProps.src;
  }

  render() {
    return (
      <div aria-hidden={!this.props.src} className="player">
        <Video src={this.props.src} />
      </div>
    );
  }
}
