import React from "react";
import { Textarea, Radio, Group, Header, FormLayout } from "@vkontakte/vkui";

const ChooseFeedback = props => {
  return (
    <Group
      separator="show"
      header={<Header mode="secondary">Тип фидбека</Header>}
    >
      <div>
        <Radio
          name="radio"
          value="1"
          onClick={() => {
            props.setFeedbackType("ls");
          }}
          description="Любой желающий может написать вам в лс"
          defaultChecked
        >
          Личные сообщения
        </Radio>
        <Radio
          name="radio"
          value="2"
          onClick={() => {
            props.setFeedbackType("comments");
          }}
          description="Пользователи оставляют комментарии к вашему объявлению"
        >
          Комментарии
        </Radio>
        <Radio
          name="radio"
          value="3"
          onClick={() => {
            props.setFeedbackType("other");
          }}
          description="Вы указываете контакты для связи, пользователи связываются с вами"
        >
          Контакты
        </Radio>
      </div>
      {props.feedbackType == "other" ? (
        <FormLayout>
          <Textarea
            top="Контакты"
            name="Контакты"
            placeholder="Почта, номер телфона, мессенджеры и т.д."
            value={props.contacts}
            onChange={e => {
              const { _, value } = e.currentTarget;
              props.setContacts(value);
            }}
            status={props.contacts ? "valid" : "error"}
          />
        </FormLayout>
      ) : (
        <div />
      )}
    </Group>
  );
};

export default ChooseFeedback;
