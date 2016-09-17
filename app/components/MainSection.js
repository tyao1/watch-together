import React, { Component, PropTypes } from 'react';
import style from './MainSection.css';



export default class MainSection extends Component {

  static propTypes = {
    todos: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
  }



  render() {
    return (
      <section className={style.main}>
        还没有内容
      </section>
    );
  }
}
