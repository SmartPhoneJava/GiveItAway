import {createStore} from 'redux';
// http://localhost:8091
// http://35.223.136.32:8091
const reducer = (state="http://localhost:8091", action) => {
  switch (action.type) {
    case 'set':
      return action.new_state;
    default: return state;
  }
}
export const Addr = createStore(reducer);
const update = () => {
  console.log("sub:", Addr.getState()); // при каждом обращение к User будет выводить его значение
}
Addr.subscribe(update);  // Подписываемся на вызов User
