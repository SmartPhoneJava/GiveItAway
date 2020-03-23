import React, { useState, useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";
import {
  Button,
  Textarea,
  Card,
  Radio,
  Group,
  Header,
  CardGrid,
  CellButton,
  FormLayout,
  Div,
  InfoRow,
  Checkbox,
  Cell,
  Link,
  Separator
} from "@vkontakte/vkui";

import Geocoder from "react-native-geocoding";

import CreateItem from "./components/CreateItem";
import ChooseAddType from "./components/ChooseType";

import Icon24Add from "@vkontakte/icons/dist/24/add";

import Icon24Locate from "@vkontakte/icons/dist/32/place";

let itemID = 1;

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

  const [description, setDescription] = useState("");

  const [hideGeo, setHideGeo] = useState(false);
  const [geodata, setGeodata] = useState(null);
  const [adress, setAdress] = useState("Не указан");

  const [addType, setAddType] = useState(1);
  const [itemDescription, setItemDescription] = useState(false);
  // function checkItems() {
  //   const item = items[0].amount
  //   if (item.amount < 0 || item.amount > 50) {
  //     return false
  //   }
  //   if (item.name == "" || item.category == "" ) {
  //     return false
  //   }
  //   items. /
  //   тут надо проверить
  //   return true
  // }

  function updateGeo() {
    async function fetchData() {
      const value = await bridge.send("VKWebAppGetGeodata");
      setGeodata(value);

      console.log("geodata:", value);
      Geocoder.init("no_code_here");
      Geocoder.from(value.lat, value.long)
        .then(json => {
          var addressComponent = json.results[0].address_components[0];
          console.log("addressComponent:", addressComponent);
          setAdress(addressComponent);
        })
        .catch(error => {
          console.warn(error);
          setAdress("Город не обнаружен");
        });
    }

    console.log("launch");
    fetchData();
  }
  updateGeo();

  return (
  
    <div>
      {  /*
      <Separator />
      <ChooseAddType set={setAddType}/>
      <FormLayout>
        <Textarea
          top="Описание"
          name="Описание"
          placeholder="..."
          value={description}
          onChange={e => {
            const { _, value } = e.currentTarget;
            setDescription(value);
          }}
        />
      </FormLayout>
      <Separator />
        */}
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
            name={item.name}
            setItems={newItem => {
              newItem.id = items[i].id;
              items[i] = newItem;
              setItems([...items]);
            }}
            category={item.category}
            description={item.description}
          />
        ))}

        {items.length == 1 ? (
          ""
        ) : (
          <InfoRow
            style={{
              color: "grey",
              margin: "12px"
            }}
          >
            Вы указали несколько вещей, поэтому будет создано несколько
            объявлений: по одному на каждый предмет.
          </InfoRow>
        )}

        <Div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
            {  /*
          <CellButton
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
            before={<Icon24Add />}
          >
            Добавить предмет
          </CellButton> */}
        </Div>
      </Group>
      <Separator />
     
      <Div
        style={{
          padding: "10px",
          display: "flex"
        }}
      >
        <Cell indicator={<Icon24Locate />} onClick={updateGeo}></Cell>
        <Cell
          indicator={
            <Div
              style={{
                padding: "0px",
                display: "flex"
              }}
            >
              <Checkbox
                value={hideGeo}
                onClick={e => {
                  setHideGeo(!hideGeo);
                  console.log("claaaaaack");
                }}
              >
                Не указывать
              </Checkbox>
            </Div>
          }
        >
          <InfoRow
            style={{ color: hideGeo ? "grey" : "black" }}
            header="Местоположение"
          >
            {!hideGeo ? adress : "Скрыто"}
          </InfoRow>
        </Cell>
      </Div>
      <Separator />
      <Group
        separator="show"
        header={<Header mode="secondary">Тип фидбека</Header>}
      >
        <div>
          <Radio
            name="radio"
            value="1"
            description="Любой желающий может написать вам в лс"
            defaultChecked
          >
            Личные сообщения
          </Radio>
          <Radio
            name="radio"
            value="2"
            description="Пользователи оставляют комментарии к вашему объявлению"
          >
            Комментарии
          </Radio>
          <Radio
            name="radio"
            value="3"
            description="Вы указываете контакты для связи, пользователи связываются с вами"
          >
            Контакты
          </Radio>
        </div>
      </Group>
      <Div style={{ display: "flex" }}>
        <Button mode="commerce" size="l" stretched style={{ marginRight: 8 }}>
          Добавить
        </Button>
      </Div>
    </div>
  );
};

export default CreateAdd;
