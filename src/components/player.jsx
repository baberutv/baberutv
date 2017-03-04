import React, { Component, PropTypes } from 'react';
import URLSearchParams from 'url-search-params';
import Video from './video';

export default class Player extends Component {
  static contextTypes = {
    setVideo: PropTypes.func.isRequired,
  }

  static displayName = 'Player';

  static propTypes = {
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
    }).isRequired,
  };

  constructor(props, ...args) {
    super(props, ...args);
    const { search } = props.location;
    const searchParams = new URLSearchParams(search);
    Object.assign(this.state, {
      src: searchParams.get('uri') || null,
    });
  }

  state = {
    src: null,
  };

  componentWillMount() {
    const { src: videoUri } = this.state;
    if (videoUri) {
      this.context.setVideo({ uri: videoUri });
    }
  }

  shouldComponentUpdate(nextProps) {
    return this.props.location.search !== nextProps.location.search;
  }

  componentWillUpdate(nextProps) {
    const { search } = nextProps.location;
    const searchParams = new URLSearchParams(search);
    const videoUri = searchParams.get('uri');
    if (videoUri && this.state.src !== videoUri) {
      this.setState({ src: videoUri });
    }
  }

  render() {
    return (
      <div data-video-uri={this.state.src || false}>
        <Video src={this.state.src} />
      </div>
    );
  }
}
