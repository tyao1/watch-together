import React, { Component, PropTypes } from 'react';
import waitUntilVariant from '../utils/waitUntilVariant';
import { connect } from 'react-redux';
import { changeMode } from '../actions/player';
import styles from './Dashboard.css';

const modeMap = {
  1: '主持者',
  0: '参与者',
};

@connect(
  state => ({
    rooms: state.players.rooms,
    mode: state.players.mode,
  }), { changeMode }
)
export default class Player extends Component {


  onGuestMode = (event) => {
    // event.preventDefault();
    this.props.changeMode(0);
  }

  onSwitchClick = () => {
    this.props.changeMode(1 - this.props.mode);
  }

  renderMode = () => {
    return (
      <p className={styles.mode}>当前模式: <span>{modeMap[this.props.mode]}</span>
        <span className={styles.switch} onClick={this.onSwitchClick}>切换</span>
      </p>
    );
  }

  renderRooms = () => {
    if (this.props.rooms) {
      const keys = Object.keys(this.props.rooms);
      if (keys.length) {
        return (<ul className={styles.roomContainer}>
          {
            keys.map(key => {
              return (<a
                className={styles.room}
                key={key}
                href={'http://www.bilibili.com/video/av' + key}
                target="about_blank"
                onClick={this.onGuestMode}
              >
                <p>{key}</p>
              </a>)
            })
          }
        </ul>);
      }
    }
    return <p>还没有房间</p>
  }

  render() {
    return (
      <div>
        {this.renderMode()}
        {this.renderRooms()}
      </div>
    )
  }
}
