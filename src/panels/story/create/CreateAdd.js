import React, { useState, useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";
import {
  Button,
  Textarea,
  Card,
  Group,
  Header,
  CardGrid,
  FormLayout,
  Div,
  InfoRow,
  Checkbox,
  Cell,
  Link
} from "@vkontakte/vkui";

import Geocoder from "react-native-geocoding";

import CreateItem from "./CreateItem";

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

  const [hideGeo, setHideGeo] = useState(false);
  const [geodata, setGeodata] = useState(null);
  const [adress, setAdress] = useState("Не указан");

  useEffect(() => {
    async function fetchData() {
      const value = await bridge.send("VKWebAppGetGeodata");
      setGeodata(value);

      console.log("geodata:", value);
      Geocoder.init("no_code_here");
      Geocoder.from(value.lat, value.long)
        .then(json => {
          var addressComponent = json.results[0].address_components[0];
          console.log("addressComponent:", addressComponent);
          setAdress(addressComponent)
        })
        .catch(error => {
          console.warn(error);
          setAdress("Город не обнаружен")
        });
    }

    console.log("launch");
    fetchData();
  });

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

      <Cell
        indicator={
          <Checkbox
            value={hideGeo}
            onClick={e => {
              setHideGeo(!hideGeo);
            }}
          >
            Не указывать
          </Checkbox>
        }
      >
        <InfoRow
          style={{ color: hideGeo ? "grey" : "black" }}
          header="Местоположение"
        >
          {!hideGeo ? adress : "Скрыто"}
        </InfoRow>
      </Cell>
    </Group>
  );
};

export default CreateAdd;
