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
  const [items, setItemsR] = useState([
    {
      id: itemID,
      name: "",
      category: "",
      description: ""
    }
  ]);

  function setItems(r) {
    console.log("we are logs:", r);
    setItemsR(r);
    checkItems();
  }

  const [description, setDescription] = useState("");

  const [hideGeo, setHideGeo] = useState(false);
  const [geodata, setGeodata] = useState({
    long: "0",
    lat: "0"
  });
  const [adress, setAdress] = useState("Не указан");
  const [valid, setValid] = useState(false);
  const [contacts, setContactsR] = useState("");

  function setContacts(r) {
    setContactsR(r);
    checkItems();
  }

  const [feedbackType, setFeedbackTypeR] = useState("ls");

  function setFeedbackType(r) {
    setFeedbackTypeR(r);
    checkItems();
  }

  const [addType, setAddType] = useState(1);
  const [itemDescription, setItemDescription] = useState(false);
  function checkItems() {
    let v = true;
    items.forEach(val => {
      if (val.name === undefined || val.name.length == 0) {
        v = false;
      }
      if (val.description === undefined || val.description.length == 0) {
        v = false;
      }
      if (
        val.category === undefined ||
        val.category.length == 0 ||
        v.category == "Не определена"
      ) {
        v = false;
      }
    });
    // if (feedbackType == "other" && contacts == "") {
    //   v = false
    // }
    setValid(v);
  }

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
  //updateGeo();
  console.log("lvl3 props.user ", props.user);

  return (
    <div>
      {/*
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
          {/*
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
            onClick={() => {
              setFeedbackType("ls");
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
              setFeedbackType("comments");
            }}
            description="Пользователи оставляют комментарии к вашему объявлению"
          >
            Комментарии
          </Radio>
          <Radio
            name="radio"
            value="3"
            onClick={() => {
              setFeedbackType("other");
            }}
            description="Вы указываете контакты для связи, пользователи связываются с вами"
          >
            Контакты
          </Radio>
        </div>
      </Group>
      {feedbackType == "other" ? (
        <FormLayout>
          <Textarea
            top="Контакты"
            name="Контакты"
            placeholder="Почта, номер телфона, мессенджеры и т.д."
            value={contacts}
            onChange={e => {
              const { _, value } = e.currentTarget;
              setContacts(value);
            }}
            status={contacts ? "valid" : "error"}
          />
        </FormLayout>
      ) : (
        <div />
      )}
      {valid ? (
        ""
      ) : (
        <InfoRow
          style={{
            color: "grey",
            margin: "12px"
          }}
        >
          Вы не заполнили некоторые обязательные поля. Проверьте, указаны ли
          имена, описания и категории предметов.
        </InfoRow>
      )}
      <Div style={{ display: "flex" }}>
        <Button
          onClick={() => {
            if (valid) {
              const obj = JSON.stringify({
                author_id: props.user().vk_id,
                header: items[0].name,
                text: items[0].description,
                is_auction: false,
                feedback_type: feedbackType,
                extra_field: contacts,
                geo_position: {
                  long: geodata.long,
                  lat: geodata.lat
                },
                status: "offer",
                category: items[0].category,
                comments_count: 0
              });
              console.log("loook at me", obj);
              /*
              fetch(`http://localhost:8091/api/ad/create`, {
                method: "post",
                mode: "cors",
                body: JSON.stringify({
                  author_id: props.user().vk_id,
                  header: items[0].name,
                  text: items[0].description,
                  is_auction: false,
                  feedback_type: feedbackType,
                  extra_field: contacts,
                  geo_position: {
                    long: geodata.long,
                    lat: geodata.lat
                  },
                  status: "offer",
                  category: items[0].category,
                  comments_count: 0
                }),
                credentials: "include"
              })
                .then(function(response) {
                  console.log(
                    "Вот ответ от бека на запрос создания объявления ",
                    response
                  );
                  return response.json();
                })
                .catch(function(error) {
                  console.log("Request failed", error);
                });*/
            }
          }}
          mode={valid ? "commerce" : "secondary"}
          size="l"
          stretched
          style={{ marginRight: 8 }}
        >
          Добавить
        </Button>
      </Div>
    </div>
  );
};

export default CreateAdd;
