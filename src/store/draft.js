import {createStore} from 'redux';
// http://localhost:8091
// https://giveitaway.site
const reducer = (state="DRAFT", action) => {
  switch (action.type) {
    case 'set':
      return action.new_state;
    default: return state;
  }
}
export const Draft = createStore(reducer);
const update = () => {
  console.log("DRAFT:", Draft.getState()); // при каждом обращение к User будет выводить его значение

}
Draft.subscribe(update);  // Подписываемся на вызов User
