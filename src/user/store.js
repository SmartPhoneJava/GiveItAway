import {createStore} from 'redux';

const reducer = (state={}, action) => {
  switch (action.type) {
    case 'set':
      return action.new_state;
    default: return state;
  }
}
export const store = createStore(reducer);
const update = () => {
  console.log("sub:", store.getState()); // при каждом обращение к store будет выводить его значение
}
store.subscribe(update);  // Подписываемся на вызов store
