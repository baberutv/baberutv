import { createStyleSheet } from 'jss-theme-reactor/styleSheet';
import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import { Dialog, DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import Text from 'material-ui/Text';
import TextField from 'material-ui/TextField';
import ToolBar from 'material-ui/Toolbar';
import MenuIcon from 'material-ui/svg-icons/menu';
import customPropTypes from 'material-ui/utils/customPropTypes';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';

const styleSheet = createStyleSheet('Header', () => ({
  title: {
    flex: 1,
  },
  titleLink: {
    color: 'inherit',
    textDecoration: 'none',
  },
}));

export default class Header extends Component {
  static contextTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    setVideo: PropTypes.func.isRequired,
    styleManager: customPropTypes.muiRequired,
  };

  static defaultProps = {
    open: false,
    videoUri: null,
  };

  static displayName = 'Header';

  static propTypes = {
    open: PropTypes.bool,
    videoUri: PropTypes.string,
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
      const newState = { open: false };
      if (this.state.videoUri !== nextProps.videoUri) {
        newState.videoUri = nextProps.videoUri;
      }
      this.setState(newState);
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

  handleRequestClose = () => {
    if (this.props.videoUri) {
      this.setState({
        open: false,
      });
    }
  }

  handleSubmit = (event) => {
    const { videoUri } = this.state;
    event.preventDefault();
    if (videoUri) {
      this.setState({ open: false }, () => {
        this.context.setVideo({ uri: videoUri })
          .then(() => this.context.history.push(`/player/?uri=${videoUri}`));
      });
    }
    return false;
  }

  render() {
    const classes = this.context.styleManager.render(styleSheet);
    return (
      <header>
        <AppBar>
          <ToolBar>
            <IconButton contrast>
              <MenuIcon onClick={this.handleClick} />
            </IconButton>
            <Text className={classes.title} colorInherit type="title">
              <Link className={classes.titleLink} to="/">TV</Link>
            </Text>
            <Button contrast onClick={this.handleClick} primary>Open</Button>
            <Dialog onRequestClose={this.handleRequestClose} open={this.state.open}>
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
                  <Button onClick={this.handleRequestClose} primary>Cancel</Button>
                  <Button disabled={!this.state.videoUri} primary type="submit">Play</Button>
                </DialogActions>
              </form>
            </Dialog>
          </ToolBar>
        </AppBar>
      </header>
    );
  }
}
