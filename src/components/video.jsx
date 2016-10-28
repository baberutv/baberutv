import Hls from 'hls.js';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import React, { PropTypes, PureComponent } from 'react';
import styles from '../styles/video.css';

@withStyles(styles)
export default class Video extends PureComponent {
  static displayName = 'Video';

  static propTypes = {
    src: PropTypes.string,
  };

  constructor(...args) {
    super(...args);
    this.hls = null;
  }

  componentDidMount() {
    const canPlay = this.videoElement.canPlayType('application/vnd.apple.mpegURL');
    if (!['probably', 'maybe'].includes(canPlay) && Hls.isSupported()) {
      this.hls = new Hls();
      this.hls.attachMedia(this.videoElement);
    }
    if (this.props.src) {
      this.loadSource(this.props.src);
    }
  }

  componentWillReceiveProps({ src: videoUri }) {
    if (videoUri && this.props.src !== videoUri) {
      this.loadSource(videoUri);
    }
  }

  componentWillUnmount() {
    if (this.hls) {
      this.hls.destroy();
    }
  }

  loadSource(uri) {
    if (this.hls) {
      this.hls.loadSource(uri);
    } else {
      this.videoElement.src = uri;
    }
  }

  render() {
    return (
      <div aria-hidden={!this.props.src} className="video">
        <video autoPlay controls ref={component => (this.videoElement = component)} />
      </div>
    );
  }
}
