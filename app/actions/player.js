import * as types from '../constants/Players';

export function init(data, mode) {
  return {
    type: types.INIT_PLAYER,
    data,
    owner: mode,
    wild: true,
  };
}

export function userDo(data) {
  console.log('do', data);
  if (data.av > 0) {
    return { type: types.DO, data, wild: true, };
  } else {
    return { type: 'Do Nothing' };
  }
}

export function changeMode(mode) {
  console.log('change mode ', mode)
  return { type: types.CHANGE_MODE, mode, global: true, };
}
