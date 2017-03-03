import { createStyleSheet } from 'jss-theme-reactor/styleSheet';
import customPropTypes from 'material-ui/utils/customPropTypes';
import React, { Component, PropTypes } from 'react';
import Video from './video';

const styleSheet = createStyleSheet('Player', () => ({
  player: {
    '&[aria-hidden]:not([aria-hidden="false"])': {
      display: 'none',
    },
  },
}));

export default class Player extends Component {
  static contextTypes = {
    styleManager: customPropTypes.muiRequired,
  };

  static defaultProps = {
    src: null,
  };

  static displayName = 'Player';

  static propTypes = {
    src: PropTypes.string,
  };

  shouldComponentUpdate(nextProps) {
    return this.props.src !== nextProps.src;
  }

  render() {
    const classes = this.context.styleManager.render(styleSheet);
    return (
      <div aria-hidden={!this.props.src} className={classes.player}>
        <Video src={this.props.src} />
      </div>
    );
  }
}
