import React, { useState } from "react";
import {
  FormLayout,
  Input,
  Button,
  Card,
  CardGrid,
  Div,
  Textarea,
  SelectMimicry
} from "@vkontakte/vkui";

import {
  Categories,
  GetCategoryText,
  CategoriesLabel
} from "./../../../template/Categories";

const amountLabel = "Количество";
const nameLabel = "Название";
const categoryLabel = "Категория";
const descriptionLabel = "Описание";

const CreateItem = props => {
  const [amount, setAmount] = useState("1");
  const [name, setName] = useState(props.name);
  const [description, setDescription] = useState("");

  function checkAmount(a) {
    return Number(a) > 0 && Number(a) < 100;
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
              top={nameLabel}
              name={nameLabel}
              size="50"
              placeholder="футбольный мяч"
              value={name}
              onChange={e => {
                const { _, value } = e.currentTarget;
                setName(value);
                props.setItems({
                  amount,
                  name: value,
                  caregory: props.category,
                  description
                });
              }}
              status={name ? "valid" : "error"}
            />
          </FormLayout>
          <CategoriesLabel category={props.category} open={props.choose} />
        </Div>
        <Div
          style={{
            padding: "0px"
          }}
        >
          <FormLayout>
            <Textarea
              top={descriptionLabel}
              name={descriptionLabel}
              placeholder="Количество, состояние, габариты, дата покупки, особенности и т.д."
              value={description}
              onChange={e => {
                const { _, value } = e.currentTarget;
                setDescription(value);
                props.setItems({
                  amount,
                  name,
                  category: props.category,
                  description: value
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
