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

    // this.meId = meId;

    // base of our server
    this.base = wilddog.sync().ref();

    // storing the realtime player data
    this.root = this.base.child('DATA');

    // room list
    this.roomRef = this.base.child('ROOMS');

    // update rooms data
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

    // refs for rooms
    this.refs = {};

    this._rooms = {};
    this._dataRefs = new Map();

    // imparitve actions
    this.actionsMap = {

      [types.INIT_PLAYER]: (action) => {
        // lets go online
        // wilddog.goOnline();

        const ref = this.getRef(action.data.aid);
        this._dataRefs.set(action.data.aid, ref);
        if (action.owner) {
          // room owner, own the room data
          console.log('is owner');
          ref.set({}); // clearData

          const theRoom = this.roomRef.child(action.data.aid);
          theRoom.once('value', (data) => {
            const val = data.val();
            console.log('once data', data.val());
            if (!val) {
              theRoom.set(1);
            } else {
              theRoom.set(val + 1);
            }
          })

          console.log('broken?');
        }
        function syncAction(snapshot) {
          const data = snapshot.val();
          console.log('got action', data);
          dispatch({
            type: types.ON_CHANGE,
            key: action.data.aid,
            data,
          });
        }
        this._rooms[action.data.aid] = syncAction;
        console.log('query', this._rooms[action.data.aid]);
        // limitToLast
        ref.on('value', syncAction);

        console.log('works?');
      },
      [types.DO]: (action) => {
        const ref = this.getRef(action.data.av);
        delete action.data.av;
        action.data.date = Date.now();
        ref.push(action.data);
      },
      [types.EXIT_PLAYER]: (action) => {
        console.log('exit player!!!', action);
        const ref = this._dataRefs.get(action.data);
        if (!ref) return;
        // delete count
        const currentRoom = this.roomRef.child(action.data)
        currentRoom.once('value', (data) => {
          const val = data.val();
          console.log('once data', data.val());
          if (val > 1) {
            currentRoom.set(val - 1);
          } else {
            currentRoom.remove();
          }
        });
        console.log('does this off works?');
        ref.off('value', this._rooms[action.data]);
        delete this._rooms[action.data];
        this._dataRefs.delete(action.data);
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
