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
  Separator,
  ScreenSpinner,
  Snackbar,
  Avatar
} from "@vkontakte/vkui";

import Geocoder from "react-native-geocoding";

import CreateItem from "./components/CreateItem";
import ChooseAddType from "./components/ChooseType";
import ChooseFeedback from "./components/ChooseFeedback";

import Icon24Add from "@vkontakte/icons/dist/24/add";
import Icon24Favorite from "@vkontakte/icons/dist/24/favorite";
import Icon24Cancel from "@vkontakte/icons/dist/24/cancel";
import Icon24DoneOutline from "@vkontakte/icons/dist/24/done_outline";

import { User } from "../../../store/user";
import { Addr } from "../../../store/addr";

import { CategoryNo } from "./../../template/Categories";

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
        v.category == CategoryNo
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
      setAdress(Math.floor(value.long) + ":" + Math.floor(value.lat));
      /*
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
        });*/
    }

    fetchData();
  }
  useEffect(() => {
    updateGeo();
  }, []);

  function saveSuccess(goToAds) {
    if (props.snackbar) return;
    goToAds();
    //
    //!!! RK1 /** */
    /*
      <Snackbar
        onClose={() => {
         
          //props.setSnackbar(null)
        }}
        action="Отменить"
        onActionClick={() => {
          // тут запрос на удаление 
        }}
        before={
          <Avatar size={24} style={{ background: "green" }}>
            <Icon24DoneOutline fill="#fff" width={14} height={14} />
          </Avatar>
        }
      >
        Объявление создано! Спасибо, что делаете мир лучше :)
      </Snackbar>*/
  }

  function saveFail(err) {
    if (props.snackbar) return;

    /*//!!! RK1
     
    props.setSnackbar(
      <Snackbar
        onClose={() => props.setSnackbar(null)}
        action="Повторить"
        onActionClick={() => {
          // тут запрос на повторение 
        }}
        before={
          <Avatar size={24} style={{ background: "red" }}>
            <Icon24Cancel fill="#fff" width={14} height={14} />
          </Avatar>
        }
      >
        Произошла ошибка: {err}
      </Snackbar>
    );*/
  }

  function saveCancel() {
    if (props.snackbar) return;
    /*//!!! RK1
    props.setSnackbar(
      <Snackbar
        onClose={() => props.setSnackbar(null)}
        before={
          <Avatar size={24} style={{ background: "orange" }}>
            <Icon24Favorite fill="#fff" width={14} height={14} />
          </Avatar>
        }
      >
        Пожалуйста, заполните все обязательные поля.
      </Snackbar>
    );*/
  }

  function createAd(setPopout) {
    checkItems();
    console.log("cliiiick ", valid);
    if (valid) {
      //!!! RK1
      //setPopout(<ScreenSpinner size="large" />);

      const obj = JSON.stringify({
        author_id: User.getState().vk_id,
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

      async function fetchData() {
        fetch(Addr.getState() + `/api/ad/create`, {
          method: "post",
          mode: "cors",
          body: obj,
          credentials: "include"
        })
          .then(function(response) {
            console.log(
              "Вот ответ от бека на запрос создания объявления ",
              response
            );
            // !RK!
            //setPopout(null);
            if (response.status == 201) {
              saveSuccess(props.goToAds);
            } else {
              saveFail(response.status + " - " + response.statusText);
            }
            return response.json();
          })
          .catch(function(error) {
            console.log("Request failed", error);
            // !RK!
            //setPopout(null);
            saveFail(error);
          });
      }
      fetchData();
    } else {
      saveCancel();
    }
  }

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
        {/**   //!!! RK1 
         *  <Cell indicator={<Icon24Locate />} onClick={updateGeo}></Cell>
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
        */}
      </Div>
      <Separator />
      <ChooseFeedback
        setFeedbackType={setFeedbackType}
        feedbackType={feedbackType}
        setContacts={setContacts}
        contacts={contacts}
      />
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
          onClick={() => createAd(props.setPopout)}
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
