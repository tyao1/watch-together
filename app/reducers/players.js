import * as ActionTypes from '../constants/Players';

const initialState = {
  currentAv: -1, // localState
  rooms: {},
  mode: 1,
  meId: '',
};

const actionsMap = {

  [ActionTypes.INIT_PLAYER](state, action) {
    return {
      ...state,
      currentAv: action.data.aid
    };
  },

  [ActionTypes.ON_ROOM](state, action) {
    return {
      ...state,
      rooms: action.data,
    };
  },

  [ActionTypes.ON_CHANGE](state, action) {
    // console.log('receive action', Object.keys(action.data).length, action.data);
    return {
      ...state,
      [action.key]: action.data,
    };
  },

  [ActionTypes.CHANGE_MODE](state, action) {
    return {
      ...state,
      mode: action.mode,
    };
  },
  [ActionTypes.INIT_ID](state, action) {
    return {
      ...state,
      meId: action.data,
    };
  },

};

export default function todos(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
