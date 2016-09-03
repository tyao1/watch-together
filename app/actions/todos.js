import * as types from '../constants/ActionTypes';

export function addTodo(text) {
  return { global: true, type: types.ADD_TODO, text };
}

export function deleteTodo(id) {
  return { global: true, type: types.DELETE_TODO, id };
}

export function editTodo(id, text) {
  return { global: true, type: types.EDIT_TODO, id, text };
}

export function completeTodo(id) {
  return { global: true, type: types.COMPLETE_TODO, id };
}

export function completeAll() {
  return { global: true, type: types.COMPLETE_ALL };
}

export function clearCompleted() {
  return { global: true, type: types.CLEAR_COMPLETED };
}
