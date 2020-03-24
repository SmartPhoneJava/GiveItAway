import {createStore} from 'redux';

const reducer = (state={}, action) => {
  switch (action.type) {
    case 'set':
      return action.new_state;
    default: return state;
  }
}
export const User = createStore(reducer);
const update = () => {
  console.log("sub:", User.getState()); // при каждом обращение к User будет выводить его значение
}
User.subscribe(update);  // Подписываемся на вызов User

/*http://35.223.136.32:8091/ */