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
