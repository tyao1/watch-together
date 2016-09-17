import React, { Component, PropTypes } from 'react';
import waitUntilVariant from '../utils/waitUntilVariant';
import { connect } from 'react-redux';
import { init, userDo, exitPlayer } from '../actions/player';

// don't sync these actions
const blacklist = [
  'setting_config'
]

@connect(
  state => {
    const currentAv = state.players.currentAv;
    // console.log('actions:', state.players[currentAv]);

    return {
      currentAv,
      meId: state.players.meId,
      actions: state.players[currentAv],
      mode: state.players.mode,
    }
  },
  { init, userDo, exitPlayer }
)
export default class Player extends Component {

  async componentDidMount() {
    if (window.playerWT) return; // avoid multiple patch in hot reloading

    // console.log('mount');
    // hook into the h5 player
    if (!window.bilibiliPlayer) {
      // Html5 player is not loaded, load it mannually
      // console.log('start load');
      if (! await waitUntilVariant(() => window.$ !== undefined)) {
        alert('[WT] 😃加载播放器失败，请检查网络并刷新页面重试');
        return;
      }
      const result = await new Promise((resolve, reject) => {
        window.$.ajax({
          url: 'http://static.hdslb.com/player/js/bilibiliPlayer.min.js?v=' + window.GrayManager.gray_config_html5.version,
          cache: !0,
          type: 'get',
          dataType: 'script',
          success: () => {
            resolve(true);
          },
          failure: () => {
            reject();
          }
        });
      });
      if (!result) alert('[WT] 加载播放器失败，请检查网络并刷新页面重试');
      // inject our instance of player
      const a = window.GrayManager.update_params(!0);

      console.log('vidoeData', a);
      this.props.init(a, this.props.mode);

      a.p = window.pageno;
      $("#bofqi").html('<div class="player"><div id="bilibiliPlayer"></div></div><iframe style="display: none"></iframe>');

      window.playerWT = new window.bilibiliPlayer(a);

    } else {
      // init video data
      const a = window.GrayManager.update_params(!0);
      console.log('vidoeData', a);
      this.props.init(a, this.props.mode);
    }

    /*
      Patch the player and
      hook into the functions
    */
    const { bilibiliPlayer } = window;
    const biliProto = {...bilibiliPlayer.prototype};
    const dis = this;

    function patchFunc(name) {
      bilibiliPlayer.prototype[name] = function() {
        //if (!dis.playerRef) {
        //  console.log('our this', this);
        dis.playerRef = this;
        // }
        dis.props.userDo({
          func: name,
          args: Array.prototype.slice.call(arguments),
          av: dis.props.currentAv,
          meId: dis.props.meId,
          current: dis.playerRef.currentTime(), // current play time
        });
        return biliProto[name].apply(this, arguments);
      }
      // the original function to be called
      bilibiliPlayer.prototype[name + 'WT'] = biliProto[name];
    }
    const patchList = [
      'play', 'pause', 'seek', 'volume', // 'nh',
    ];
    if (!this.props.mode) {
      // if we are the guest we need to follow
      bilibiliPlayer.prototype.nh = function() {
        biliProto.nh.apply(this, arguments);
        dis.followTheHost();
      }
    }

    bilibiliPlayer.prototype.set = function() {
      // get set actions but don't dispatch
      console.log('set', arguments);
      if (arguments[0] === 'video_status'){
        if (arguments[1] === 'volume') {
          if (dis._lastVol === arguments[2]) return;
          dis.props.userDo({
            func: 'volume',
            args: [arguments[2]],
            av: dis.props.currentAv,
            meId: dis.props.meId,
          });
          dis._lastVol = arguments[2];
        }
      }
      // return biliProto.set.apply(this, arguments);
    }

    patchList.forEach(patchFunc);
    // patchFunc('set');

    console.info('[WT] HTML PLAYER LOADED');
    this.loaded = true;
    window.addEventListener('unload', this.onUnload);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.actions) {
      // wait until we have playerRef
      if (!this.loaded || !this.playerRef) return;
      if (!nextProps.mode && !this.actionHasInited) return;
      // new actions in coming
      const keys = Object.keys(nextProps.actions);
      const lastAction = keys[keys.length - 1];
      if (lastAction === this.lastAction) return;
      this.lastAction = lastAction;
      const action = nextProps.actions[lastAction];
      this.doAction(action);
    }
  }

  componentWillUnmount() {
    this.onUnload();
    window.removeEventListener('unload', this.onUnload);
  }

  onUnload = () => {
    // player is unloaded
    this.props.exitPlayer(this.props.currentAv);
  }

  followTheHost = () => {
    if (!this.actionHasInited) {
      console.log('is it ok to init ?');

      // first time running, sync with the host
      // we need to find the last play or seek to locate the player
      const keys = Object.keys(this.props.actions);

      for (let id = keys.length - 1; id >= 0; id--) {
        const action = this.props.actions[keys[id]];
        if (!action) continue;
        this.doAction(action);
        if (['play', 'pause', 'seek'].indexOf(action.func) > -1) {
          console.log('initialize complete');
          break;
        }
      }

      this.actionHasInited = true;
      return;
    }
  }

  doAction = (action) => {
    console.log(action);

    if (action.meId === this.props.meId) return;
    if (action.func === 'play') {
      const time = action.current;
      const myCurrent = this.playerRef.currentTime();
      const timeDiff = (Date.now() - action.date) / 990;
      // if (timeDiff > 0.005) {
        // our time is not in sync, we need to sync
        const realTime = timeDiff + time;
        this.playerRef.seekWT(realTime);
        console.log('moded play', time, realTime);
        return;
      // }
    } else if (action.func === 'seek') {
      const jumpTo = action.args[0];
      const timeDiff = (Date.now() - action.date) / 990;
      // if (timeDiff > 5) {
        // too much time spent in transfer
        const realTime = timeDiff + jumpTo;
        this.playerRef.seekWT(realTime);
        console.log('moded seek', jumpTo, realTime);
        return;
      // }
    }
    window.bilibiliPlayer.prototype[action.func + 'WT'].apply(this.playerRef, action.args);
  }

  render() {
    return (
      <div><p style={{textAlign: 'center', margin: 3, color: '#a3a3a3'}}>工作中</p></div>
    )
  }
}
