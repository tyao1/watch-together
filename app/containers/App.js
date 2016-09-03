import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../components/Header';
import MainSection from '../components/MainSection';
import * as TodoActions from '../actions/todos';
import style from './App.css';

import Player from '../containers/Player';

function locationToComponent() {
  const { hostname, /*pathname*/ } = document.location;
  console.log(hostname);
  if (hostname.indexOf('www.bilibili.com') > -1) {
    return Player;
  }
  return MainSection;
}

@connect(
  state => ({
    todos: state.todos
  }),
  dispatch => ({
    actions: bindActionCreators(TodoActions, dispatch)
  })
)
export default class App extends Component {

  static propTypes = {
    todos: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
  };

  render() {
    const { todos, actions } = this.props;
    const Comp = locationToComponent();
    return (
      <div className={style.normal}>
        <Header addTodo={actions.addTodo} />
        <Comp todos={todos} actions={actions} />
        {/* <MainSection todos={todos} actions={actions} /> */}
      </div>
    );
  }
}
