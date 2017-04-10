import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class Loader extends Component {
  static displayName = 'Loader';

  static propTypes = {
    name: PropTypes.string.isRequired,
  };

  state = {
    component: null,
  };

  componentDidMount() {
    const { name, ...otherProps } = this.props;
    import(`./${name}`)
      .then(({ default: C }) => {
        this.setState({
          component: (
            <C {...otherProps} />
          ),
        });
      });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.component !== nextState.component;
  }

  render() {
    return this.state.component;
  }
}
