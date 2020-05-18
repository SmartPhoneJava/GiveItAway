import {createStore} from 'redux';
// ws://localhost:8000
// wss://giveitaway.ru/centrifugo
const reducer = (state="ws://localhost:8000", action) => {
  switch (action.type) {
    case 'set':
      return action.new_state;
    default: return state;
  }
}
export const AddrWS = createStore(reducer);
const update = () => {
  console.log("sub:", AddrWS.getState()); // при каждом обращение к User будет выводить его значение

}
AddrWS.subscribe(update);  // Подписываемся на вызов User