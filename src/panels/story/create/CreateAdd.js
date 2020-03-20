import React, { useState } from "react";
import {
  View,
  Panel,
  PanelHeader,
  Radio,
  SelectMimicry,
  FormLayoutGroup,
  FormLayout,
  Input,
  Select,
  Checkbox,
  Link,
  Button,
  Textarea,
  Card,
  Group,
  Header,
  CardGrid,
  Div
} from "@vkontakte/vkui";

import CreateItem from "./CreateItem";

const CreateAdd = props => {
  const [items, setItems] = useState([
    {
      amount: "1",
      name: "",
      category: "",
      description: ""
    }
  ]);

  return (
    <Group
      separator="hide"
      header={<Header mode="secondary">Опишите выставляемые предметы</Header>}
    >
      {items.map(item => (
        <CreateItem
          openCategories={props.openCategories}
          category={props.category}
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
      </Div>
    </Group>
  );
};

export default CreateAdd;
