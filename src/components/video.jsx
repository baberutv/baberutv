import Hls from 'hls.js';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import React, { Component, PropTypes } from 'react';
import database from '../databases/media';
import styles from '../styles/video.css';

@withStyles(styles)
export default class Video extends Component {
  static displayName = 'Video';

  static contextTypes = {
    setVideo: PropTypes.func.isRequired,
  };

  static propTypes = {
    src: PropTypes.string,
  };

  static defaultProps = {
    src: null,
  }

  constructor(...args) {
    super(...args);
    this.hls = null;
    this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
    this.handleCanPlay = this.handleCanPlay.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.handleBeforeUnload);
    if (typeof this.videoElement.playsInline !== 'undefined') {
      this.videoElement.playsInline = true;
    }
    const canPlay = this.videoElement.canPlayType('application/vnd.apple.mpegURL');
    if (!['probably', 'maybe'].includes(canPlay) && Hls.isSupported()) {
      this.hls = new Hls();
      this.hls.on(Hls.Events.ERROR, this.handleError);
    }
    if (this.props.src) {
      this.loadSource(this.props.src);
    }
  }

  componentWillReceiveProps({ src: videoUri }) {
    if (this.props.src !== videoUri) {
      this.loadSource(videoUri);
    }
  }

  shouldComponentUpdate(nextProps) {
    return this.props.src !== nextProps.src;
  }

  componentWillUnmount() {
    if (this.hls) {
      this.hls.destroy();
    }
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  }

  handleBeforeUnload(event) {
    if (!this.videoElement.paused) {
      const returnValue = '';
      event.preventDefault();
      Object.assign(event, { returnValue });
      return returnValue;
    }
    return undefined;
  }

  handleCanPlay() {
    const { src: uri } = this.props;
    database.transaction('rw', database.videos, async () => {
      if (uri && (await database.videos.where('uri').equals(uri).count()) < 1) {
        await database.videos.add({
          uri,
          createdAt: new Date(),
        });
      }
    });
  }

  handleError() {
    if (this.props.src) {
      // eslint-disable-next-line no-alert
      alert('Video playback failed.');
      this.context.setVideo({
        uri: '',
      });
    }
  }

  loadSource(uri) {
    if (this.hls) {
      if (uri) {
        this.hls.attachMedia(this.videoElement);
        this.hls.loadSource(uri);
      } else if (!this.hls.url) {
        this.hls.destroy();
      }
    } else {
      this.videoElement.src = uri;
    }
    if (!uri) {
      this.videoElement.pause();
    }
  }

  render() {
    return (
      <div className="video">
        <video
          autoPlay
          controls
          onCanPlay={this.handleCanPlay}
          onError={this.handleError}
          ref={component => (this.videoElement = component)}
        />
      </div>
    );
  }
}
