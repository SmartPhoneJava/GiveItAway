import {createStore} from 'redux';
// http://localhost:8091
// https://giveitaway.ru  
const reducer = (state="http://localhost:8091", action) => {
  switch (action.type) {
    case 'set':
      return action.new_state;
    default: return state;
  }
}

export const BASE = "/api/"
export const BASE_AD = "/api/ad/" //!! поправь меня на /api/post/
export const BASE_DEAL = "/api/deal/"
export const BASE_USER = "/api/user/"
export const BASE_COMMENT = "/api/comment/"

export const Addr = createStore(reducer);
const update = () => {
  console.log("sub:", Addr.getState()); // при каждом обращение к User будет выводить его значение

}
Addr.subscribe(update);  // Подписываемся на вызов User
