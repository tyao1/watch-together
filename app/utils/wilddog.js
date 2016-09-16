import wilddog from 'wilddog';
import * as types from '../constants/Players';
import shortid from 'shortid';

export default class Wild {


  constructor(config, dispatch) {
    if (!config) throw Error('Config file is required');
    wilddog.initializeApp(config);
    this.dispatch = dispatch;

    //  assign uniq id
    const meId = shortid.generate();
    dispatch({
      type: types.INIT_ID,
      data: meId,
    });


    // base of our server
    this.base = wilddog.sync().ref();

    // storing the realtime player data
    this.root = this.base.child('DATA');

    // room list
    this.roomRef = this.base.child('ROOMS');

    this.roomRef.on('value', (snapshot) => {
      console.log('AVAILABLE ROOMS', snapshot.val());
      const data = snapshot.val();
      if (!data) {
        console.log('Init Data');
        this.roomRef.set({});
      }
      this.dispatch({
        type: types.ON_ROOM,
        data,
      });
    });
    this.refs = {};

    // imparitve actions
    this.actionsMap = {

      [types.INIT_PLAYER]: (action) => {
        const ref = this.getRef(action.data.aid);

        if (action.owner) {
          // room owner, own the room data
          console.log('is owner');
          ref.set({}); // clearData
          this.roomRef.update({
            [action.data.aid]: true
          });
        }
        // limitToLast
        ref.orderByKey().on('value', (snapshot) => {
          const data = snapshot.val();
          dispatch({
            type: types.ON_CHANGE,
            key: action.data.aid,
            data,
          });
        });
      },
      [types.DO]: (action) => {
        const ref = this.getRef(action.data.av);
        delete action.data.av;
        action.data.date = Date.now();
        ref.push(action.data);
      },
    };
  }


  getRef = (key) => {
    if (!this.refs[key]) {
      this.refs[key] = this.root.child(key);
    }
    // console.log('val', this.refs[key].val());
    return this.refs[key];
  }

  process = (action) => {
    const func = this.actionsMap[action.type];
    if (func) func(action);
    else console.log('Unknown type:' + action);
  }

}
