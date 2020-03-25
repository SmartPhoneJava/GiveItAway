import { createStore } from "redux";
let s = 1;


const reducer = (state = null, action) => {
  switch (action.type) {
    case "null":
        console.log("inc", state)
      return null;
    case "filters":
      return "filters";
    default:
      return state;
  }
};

export const ActiveModal = createStore(reducer);

const update = () => {
  console.log("AdsPage:", ActiveModal.getState()); // при каждом обращение к User будет выводить его значение
};
ActiveModal.subscribe(update); // Подписываемся на вызов User
