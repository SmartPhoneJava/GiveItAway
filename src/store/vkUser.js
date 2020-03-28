import {createStore} from 'redux';

const reducer = (state={}, action) => {
  switch (action.type) {
    case 'set':
      return action.new_state;
    default: return state;
  }
}
export const VkUser = createStore(reducer);
const update = () => {
  console.log("sub:", VkUser.getState()); // при каждом обращение к User будет выводить его значение
}
VkUser.subscribe(update);  // Подписываемся на вызов User
