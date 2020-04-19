import {createStore} from 'redux';
// http://localhost:8091
// https://giveitaway.ru  
const reducer = (state="https://giveitaway.ru", action) => {
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
