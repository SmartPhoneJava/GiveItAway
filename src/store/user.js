import {createStore} from 'redux';

const reducer = (state={}, action) => {
  switch (action.type) {
    case 'set':
      return action.new_state;
    default: return state;
  }
}
export const User = createStore(reducer);

/*http://35.223.136.32:8091/ */