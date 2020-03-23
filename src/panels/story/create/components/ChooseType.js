import React, { useState, useEffect } from "react";
import { Radio, Group, FormLayout, Header } from "@vkontakte/vkui";

const ChooseAddType = props => {
  return (
    <div>
      <Group separator="show" header={<Header mode="secondary">Отдаю</Header>}>
        <FormLayout>
          <div>
            <Radio
              onClick={e => {
                props.set(e);
              }}
              name="radio"
              value="1"
              defaultChecked
            >
              Одну вещь
            </Radio>
            <Radio
              onClick={e => {
                props.set(e);
              }}
              name="radio"
              value="2"
            >
              Несколько вещей одной категории
            </Radio>
            <Radio
              name="radio"
              onClick={e => {
                props.set(e);
              }}
              value="3"
              description="Для каждой вещи будет создано своё объявление"
            >
              Несколько вещей разных категорий
            </Radio>
          </div>
        </FormLayout>
      </Group>
    </div>
  );
};

export default ChooseAddType;
