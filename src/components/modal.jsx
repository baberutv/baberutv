import dialogPolyfill from 'dialog-polyfill';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import React, { Component, PropTypes } from 'react';
import database from '../databases/media';
import styles from '../styles/modal.css';

@withStyles(styles)
export default class Modal extends Component {
  static displayName = 'Modal';

  static contextTypes = {
    closeModal: PropTypes.func.isRequired,
    setVideo: PropTypes.func.isRequired,
  };

  static defaultProps = {
    open: false,
    videoUri: '',
  };

  static propTypes = {
    open: PropTypes.bool.isRequired,
    videoUri: PropTypes.string,
  };

  constructor(props, ...args) {
    super(props, ...args);
    Object.assign(this.state, {
      uri: props.videoUri || '',
    });
    this.handleCancel = this.handleCancel.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUriChange = this.handleUriChange.bind(this);
  }

  state = {
    uri: '',
    videos: [],
  };

  componentDidMount() {
    dialogPolyfill.registerDialog(this.dialogElement);
    this.dialogElement.addEventListener('cancel', this.handleCancel);
    this.dialogElement.addEventListener('close', this.handleClose);
    const { open } = this.dialogElement;
    if (this.props.open && !open) {
      this.showModal();
    } else if (open && !this.props.open) {
      this.close();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.videoUri !== nextProps.videoUri) {
      this.setState({
        uri: nextProps.videoUri,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.uri !== nextState.uri ||
      this.props.open !== nextProps.open ||
      this.state.videos.length !== nextState.videos.length
    );
  }

  componentWillUpdate(nextProps) {
    const { open } = this.dialogElement;
    if (nextProps.open && !open) {
      this.showModal();
    } else if (open && !nextProps.open) {
      this.close();
    }
  }

  handleCancel(event) {
    if (!this.props.videoUri) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  handleClose() {
    this.context.closeModal();
  }

  handleUriChange({ target }) {
    const { value } = target;
    this.setState({
      uri: value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { uri } = this.state;
    this.context.setVideo({ uri });
    return false;
  }

  close() {
    this.dialogElement.close();
  }

  showModal() {
    database.videos.orderBy('createdAt').reverse().limit(15).toArray()
      .then(videos => this.setState({ videos }))
      .catch(() => {});
    this.dialogElement.showModal();
  }

  render() {
    return (
      <dialog
        className="modal"
        /* onCancel={this.handleCancel} */
        /* onClose={this.handleClose} */
        ref={component => (this.dialogElement = component)}
      >
        <form action="/" method="get" onSubmit={this.handleSubmit}>
          <fieldset>
            <legend>
              <label htmlFor="video-uri">
                Video <abbr title="Uniform Resource Identifier">URI</abbr>
              </label>
            </legend>
            <input
              id="video-uri"
              list="uri-list"
              name="uri"
              onChange={this.handleUriChange}
              placeholder="https://example.com/index.m3u8"
              type="url"
              value={this.state.uri}
            />
          </fieldset>
          <datalist id="uri-list">
            <fieldset>
              <legend>
                <label htmlFor="uri-select">URI List</label>
              </legend>
              <select
                id="uri-select"
                name="uri"
                onChange={this.handleUriChange}
                value={this.state.videos.some(video => video.uri === this.state.uri) ? this.state.uri : ''}
              >
                {this.state.videos.map(video => video.uri && (
                  <option key={video.id} label={video.name || video.uri} value={video.uri} />
                ))}
                <option label="" value="" />
              </select>
            </fieldset>
          </datalist>
          <menu>
            <button type="submit">Play</button>
          </menu>
        </form>
      </dialog>
    );
  }
}
