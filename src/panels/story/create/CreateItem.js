import React, { useState } from "react";
import {
  SelectMimicry,
  FormLayout,
  Input,
  Button,
  Card,
  CardGrid,
  Div
} from "@vkontakte/vkui";

import { Categories } from "./../../template/Categories";

const amountLabel = "Количество";
const nameLabel = "Название";
const categoryLabel = "Категория";
const descriptionLabel = "Описание";

const CreateItem = props => {
  const [amount, setAmount] = useState("1");
  const [name, setName] = useState(props.name);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  function checkAmount(a) {
    return Number(a) > 0 && Number(a) < 100;
  }

  function get(a) {
    console.log("My message:", a);
    return a;
  }

  return (
    <CardGrid>
      <Card size="l">
        {props.len > 1 ? (
          <Div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              padding: "5px"
            }}
          >
            <Button
              mode="destructive"
              onClick={() => {
                props.deleteMe();
              }}
            >
              Удалить
            </Button>
          </Div>
        ) : (
          <div />
        )}

        <Div
          style={{
            display: "flex",
            alignItems: "flex-start",
            padding: "0px"
          }}
        >
          <FormLayout>
            <Input
              top={amountLabel}
              name={amountLabel}
              size="1"
              placeholder="0"
              value={amount}
              onChange={e => {
                const { _, value } = e.currentTarget;
                setAmount(value);
                props.setItems({
                  value,
                  name,
                  category,
                  description
                });
              }}
              status={checkAmount(amount) ? "valid" : "error"}
              bottom={
                checkAmount(amount)
                  ? ""
                  : "Пожалуйста, введите число от 1 до 100"
              }
            />
          </FormLayout>
          <FormLayout>
            <Input
              top={nameLabel}
              name={nameLabel}
              size="200"
              placeholder="футбольный мяч"
              value={name}
              onChange={e => {
                const { _, value } = e.currentTarget;
                setName(value);
                props.setItems({
                  amount,
                  value,
                  category,
                  description
                });
              }}
              status={name ? "valid" : "error"}
            />
          </FormLayout>
          <Categories
            choose={cat => {
              setCategory(cat);
              props.setItems({
                amount,
                name,
                cat,
                description
              });
            }}
          />
        </Div>
        <Div
          style={{
            display: "flex",
            alignItems: "flex-start",
            padding: "0px"
          }}
        >
          <FormLayout>
            <Input
              top={descriptionLabel}
              name={descriptionLabel}
              placeholder="Состояние, габариты, дата покупки, особенности и т.д."
              value={description}
              size="200"
              onChange={e => {
                const { _, value } = e.currentTarget;
                setDescription(value);
                props.setItems({
                  amount,
                  name,
                  category,
                  value
                });
              }}
              status={description ? "valid" : "error"}
            />
          </FormLayout>
        </Div>
      </Card>
    </CardGrid>
  );
};

export default CreateItem;
