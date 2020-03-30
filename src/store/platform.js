import {createStore} from 'redux';

const reducer = (state={}, action) => {
  switch (action.type) {
    case 'set':
      return action.new_state;
    default: return state;
  }
}
export const Platform = createStore(reducer);
const update = () => {
  console.log("sub:", Platform.getState()); // при каждом обращение к User будет выводить его значение
}
Platform.subscribe(update);  // Подписываемся на вызов User
