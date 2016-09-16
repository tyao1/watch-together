import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../components/Header';
import MainSection from '../components/MainSection';
import * as TodoActions from '../actions/todos';
import style from './App.css';

import Player from '../containers/Player';
import Dashboard from '../containers/Dashboard';

import {APP_ID} from '../config';

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

  locationToComponent = () => {
    const { hostname, /*pathname*/ } = document.location;
    console.log('hostname:', hostname);
    if (hostname.indexOf('www.bilibili.com') > -1) {
      return Player;
    } else if (hostname === APP_ID) {
      console.log('should dashboard');
      this.isStandalone = true;
      return Dashboard;
    }
    return MainSection;
  }

  render() {
    const { todos, actions } = this.props;
    const Comp = this.locationToComponent();
    return (
      <div className={style.normal + (this.isStandalone ? ' ' + style.standalone : '')}>
        <Header addTodo={actions.addTodo} />
        <Comp todos={todos} actions={actions} />
        {/* <MainSection todos={todos} actions={actions} /> */}
      </div>
    );
  }
}
