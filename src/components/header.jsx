import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import { Dialog, DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import Text from 'material-ui/Text';
import TextField from 'material-ui/TextField';
import ToolBar from 'material-ui/Toolbar';
import MenuIcon from 'material-ui/svg-icons/menu';
import React, { Component, PropTypes } from 'react';

export default class Header extends Component {
  static displayName = 'Header';

  static contextTypes = {
    setVideo: PropTypes.func.isRequired,
  };

  static propTypes = {
    open: PropTypes.bool,
    videoUri: PropTypes.string,
  };

  static defaultProps = {
    open: false,
    videoUri: null,
  };

  constructor(props, ...args) {
    super(props, ...args);
    Object.assign(this.state, {
      open: props.open || !props.videoUri,
      videoUri: props.videoUri || '',
    });
  }

  state = {
    open: false,
    videoUri: null,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.open !== nextState.open ||
      this.state.videoUri !== nextState.videoUri ||
      this.props.open !== nextProps.open ||
      this.props.videoUri !== nextProps.videoUri
    );
  }

  componentWillUpdate(nextProps) {
    if (nextProps.videoUri && this.props.videoUri !== nextProps.videoUri) {
      this.setState({ open: false });
    }
  }

  handleChange = ({ target }) => {
    this.setState({
      videoUri: target.value,
    });
  }

  handleClick = () => {
    if (!this.state.open) {
      this.setState({
        open: true,
      });
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.context.setVideo({
      uri: this.state.videoUri,
    });
    return false;
  }

  render() {
    return (
      <header>
        <AppBar>
          <ToolBar>
            <IconButton contrast>
              <MenuIcon onClick={this.handleClick} />
            </IconButton>
            <Text className="main-title" colorInherit type="title">TV</Text>
            <Button contrast onClick={this.handleClick}>Open</Button>
            <Dialog open={this.state.open}>
              <form action="/" onSubmit={this.handleSubmit}>
                <DialogTitle>Open video</DialogTitle>
                <DialogContent>
                  <TextField
                    id="video-uri"
                    inputProps={{ name: 'uri' }}
                    label="URI"
                    onChange={this.handleChange}
                    required
                    type="url"
                    value={this.state.videoUri}
                  />
                </DialogContent>
                <DialogActions>
                  <Button primary type="submit">Play</Button>
                </DialogActions>
              </form>
            </Dialog>
          </ToolBar>
        </AppBar>
      </header>
    );
  }
}
