import { createStore } from "redux";
let s = 1;
const reducer = (state = s, action) => {
  switch (action.type) {
    case "inc":
        console.log("inc", state)
      return s++;
    case "first_page":
        s = 0
      return s;
    default:
      return state;
  }
};

export const AdsPage = createStore(reducer);

const update = () => {
  console.log("AdsPage:", AdsPage.getState()); // при каждом обращение к User будет выводить его значение
};
AdsPage.subscribe(update); // Подписываемся на вызов User
