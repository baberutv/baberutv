import withStyles from 'isomorphic-style-loader/lib/withStyles';
import React, { Component, PropTypes } from 'react';
import styles from '../styles/header.css';

@withStyles(styles)
export default class Header extends Component {
  static displayName = 'Header';

  static propTypes = {
    videoUri: PropTypes.string,
  };

  constructor(props, ...args) {
    super(props, ...args);
    Object.assign(this.state, {
      visible: !props.videoUri,
    });
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  state = {
    visible: false,
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.videoUri !== nextProps.videoUri) {
      this.setState({
        visible: !nextProps.videoUri,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.visible !== nextState.visible;
  }

  handleMouseEnter() {
    if (!this.state.visible) {
      this.setState({
        visible: true,
      });
    }
  }

  handleMouseLeave() {
    if (this.state.visible) {
      this.setState({
        visible: false,
      });
    }
  }

  render() {
    return (
      <header
        aria-hidden={!this.state.visible}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <h1>TV</h1>
      </header>
    );
  }
}
