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

const amountLabel = "Количество";
const nameLabel = "Название";
const categoryLabel = "Категория";
const descriptionLabel = "Описание";

const CreateItem = props => {
  const [amount, setAmount] = useState("1");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function checkAmount(a) {
    return Number(a) > 0 && Number(a) < 100;
  }

  return (
      <CardGrid>
        <Card size="l">
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
                  const { name, value } = e.currentTarget;
                  setAmount(value);
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
                  const { name, value } = e.currentTarget;
                  setName(value);
                }}
                status={name ? "valid" : "error"}
              />
            </FormLayout>
            <FormLayout>
              <SelectMimicry
                top={categoryLabel}
                placeholder="Не выбрана"
                onClick={props.openCategories}
                value={props.category}
                status={props.category != "" ? "valid" : "error"}
              >
                {props.category}
              </SelectMimicry>
            </FormLayout>
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
                  const { name, value } = e.currentTarget;
                  setDescription(value);
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
