import dialogPolyfill from 'dialog-polyfill';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import React, { Component, PropTypes } from 'react';
import styles from '../styles/modal.css';

function handleCancel(event) {
  event.preventDefault();
  return false;
}

@withStyles(styles)
export default class Modal extends Component {
  static displayName = 'Modal';

  static contextTypes = {
    setVideo: PropTypes.func.isRequired,
  };

  static defaultProps = {
    open: false,
  };

  static propTypes = {
    open: PropTypes.bool.isRequired,
  };

  constructor(props, ...args) {
    super(props, ...args);
    Object.assign(this.state, {
      open: props.open,
    });
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUriChange = this.handleUriChange.bind(this);
  }

  state = {
    open: false,
    uri: '',
  };

  componentDidMount() {
    dialogPolyfill.registerDialog(this.dialogElement);
    this.dialogElement.addEventListener('cancel', handleCancel);
    this.dialogElement.addEventListener('close', this.handleClose);
    const { open } = this.dialogElement;
    if (this.state.open && !open) {
      this.showModal();
    } else if (open && !this.state.open) {
      this.close();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.setState({
        open: nextProps.open,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.uri !== nextState.uri ||
      this.state.open !== nextState.open
    );
  }

  componentWillUpdate(nextProps, nextState) {
    const { open } = this.dialogElement;
    if (nextState.open && !open) {
      this.showModal();
    } else if (open && !nextState.open) {
      this.close();
    }
  }

  handleClose() {
    this.setState({
      open: false,
    });
  }

  handleUriChange({ target }) {
    const { value } = target;
    this.setState({
      uri: value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.context.setVideo({
      uri: this.state.uri,
    });
    return false;
  }

  close() {
    this.dialogElement.close();
  }

  showModal() {
    this.dialogElement.showModal();
  }

  render() {
    return (
      <dialog
        className="modal"
        /* onCancel={handleCancel} */
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
              name="uri"
              onChange={this.handleUriChange}
              placeholder="https://example.com/index.m3u8"
              type="url"
              value={this.state.uri}
            />
          </fieldset>
          <menu>
            <button type="submit">Play</button>
          </menu>
        </form>
      </dialog>
    );
  }
}
