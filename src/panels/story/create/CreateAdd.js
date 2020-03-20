import React, { useState, useRef } from "react";
import {
  Button,
  Textarea,
  Card,
  Group,
  Header,
  CardGrid,
  Div
} from "@vkontakte/vkui";

import CreateItem from "./CreateItem";
import { compose } from "recompose";

let itemID = 1

const CreateAdd = props => {
  const [items, setItems] = useState([
    {
      id: itemID,
      amount: "1",
      name: "",
      category: "",
      description: ""
    }
  ]);

  function updateCategory(need, item, value) {
    if (need) {
      item.category = value;
    }
    return item.category;
  }

  function get(a) {
    console.log("!!!!!!!!!!!!!!!!!", a);
    return a.name;
  }

  return (
    <Group
      separator="hide"
      header={<Header mode="secondary">Опишите выставляемые предметы</Header>}
    >
      {items.map((item, i) => (
        <CreateItem
          key={item.id}
          len={items.length}
          deleteMe={() => {
            setItems([...items.slice(0, i), ...items.slice(i + 1)]);
          }}
          openCategories={() => {
            props.openCategories(i);
          }}
          amount={item.amount}
          name={get(item)}
          setItems={newItem => {
            newItem.id = items[i].id
            items[i] = newItem;
            setItems([...items]);
          }}
          category={updateCategory(props.id == i, item, props.category)}
          description={item.description}
        />
      ))}
      <Div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Button
          mode="secondary"
          onClick={() => {
            setItems([
              ...items,
              {
                id: ++itemID,
                amount: "1",
                name: "",
                category: "",
                description: ""
              }
            ]);
          }}
        >
          Добавить еще вещь
        </Button>
        <Button
          mode="secondary"
          onClick={() => {
            console.log(items);
          }}
        >
          Вывести все
        </Button>
      </Div>
    </Group>
  );
};

export default CreateAdd;
