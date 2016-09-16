import React, { PropTypes, Component } from 'react';
// import TodoTextInput from './TodoTextInput';

export default class Header extends Component {

  static propTypes = {
    // addTodo: PropTypes.func.isRequired
  };


  render() {
    return (
      <header>
        <h1>一起看B站</h1>
      </header>
    );
  }
}
