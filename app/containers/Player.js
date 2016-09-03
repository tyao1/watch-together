import React, { Component, PropTypes } from 'react';

export default class Root extends Component {

  async componentDidMount() {
    // hook into the h5 player
    // console.log(window);
    // start load html5 player
    // window.GrayManager.gray_loader_html5();
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
    const a = window.GrayManager.update_params(!0);
    a.p = window.pageno;
    $("#bofqi").html('<div class="player"><div id="bilibiliPlayer"></div></div><iframe style="display: none"></iframe>');

    const { bilibiliPlayer } = window;
    const biliProto = {...bilibiliPlayer.prototype};

    bilibiliPlayer.prototype.play = function() {
      console.log('play', arguments);
      biliProto.play.apply(this, arguments);
    }

    bilibiliPlayer.prototype.pause = function() {
      console.log('pause', arguments);
      biliProto.pause.apply(this, arguments);
    }

    bilibiliPlayer.prototype.seek = function() {
      console.log('pseeklay', arguments);
      biliProto.seek.apply(this, arguments);
    }

    bilibiliPlayer.prototype.volumn = function() {
      console.log('volumn', arguments);
      biliProto.volumn.apply(this, arguments);
    }
    bilibiliPlayer.prototype.volume = function() {
      console.log('volume', arguments);
      biliProto.volume.apply(this, arguments);
    }
    bilibiliPlayer.prototype.volume = function() {
      console.log('volume', arguments);
      biliProto.volume.apply(this, arguments);
    }
    bilibiliPlayer.prototype.set = function() {
      console.log('set', arguments);
      biliProto.set.apply(this, arguments);
    }

    /*
    const handler = {
      get: (target, name) => {
        if (name in target) {
          const func = target[name];
          if (typeof func === 'function') {
            const patched = function () {
              console.log(name, arguments);
              func.apply(this, arguments);
            };
            return patched;
          }
        }
        return target[name];
      },
    };
    const proxiedProto = new Proxy(biliProto, handler);


    bilibiliPlayer.prototype = biliProto;
    */
    window.player = new bilibiliPlayer(a);

    console.info('[WT] HTML PLAYER LOADED');
  }

  render() {
    return (
      <div><p>PLAYER WILL BE HERE</p></div>
    )
  }
}
