import Hls from 'hls.js';
import { createStyleSheet } from 'jss-theme-reactor/styleSheet';
import customPropTypes from 'material-ui/utils/customPropTypes';
import React, { Component, PropTypes } from 'react';
import database from '../databases/media';

const styleSheet = createStyleSheet('Video', () => ({
  container: {
    backgroundColor: '#000',
    margin: 0,
  },
  video: {
    display: 'block',
    height: 'auto',
    margin: '0 auto',
    maxWidth: '100%',
    padding: '90px 0 20px',
    width: '1280px',
  },
}));

export default class Video extends Component {
  static contextTypes = {
    setVideo: PropTypes.func.isRequired,
    styleManager: customPropTypes.muiRequired,
  };

  static defaultProps = {
    src: null,
  };

  static displayName = 'Video';

  static propTypes = {
    src: PropTypes.string,
  };

  constructor(...args) {
    super(...args);
    this.hls = null;
    this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
    this.handleCanPlay = this.handleCanPlay.bind(this);
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.handleBeforeUnload);
    if (typeof this.videoElement.playsInline !== 'undefined') {
      this.videoElement.playsInline = true;
    }
    const canPlay = this.videoElement.canPlayType('application/vnd.apple.mpegURL');
    if (!['probably', 'maybe'].includes(canPlay) && Hls.isSupported()) {
      this.hls = new Hls();
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
    const classes = this.context.styleManager.render(styleSheet);
    return (
      <div className={classes.container}>
        <video
          autoPlay
          className={classes.video}
          controls
          onCanPlay={this.handleCanPlay}
          ref={component => (this.videoElement = component)}
        />
      </div>
    );
  }
}
