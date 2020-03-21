import React, { useState } from "react";
import { Div, Select, FormLayout } from "@vkontakte/vkui";

import Icon24Done from "@vkontakte/icons/dist/24/done";

import Animal from "./../../img/animal.png";
import Another from "./../../img/another.png";
import Book from "./../../img/book.png";
import Build from "./../../img/build.png";
import Child from "./../../img/child.png";
import Clothers from "./../../img/clothers.png";
import Cosmetic from "./../../img/cosmetic.png";
import Electronics from "./../../img/electronics.png";
import Flora from "./../../img/flora.png";
import Food from "./../../img/food.png";
import Furniture from "./../../img/furniture.png";
import Music from "./../../img/music.png";
import Old from "./../../img/old.png";
import Pencil from "./../../img/pencil.png";
import Play from "./../../img/play.png";
import Sport from "./../../img/sport.png";

const CategoryAnimals = "animals"
const CategoryAnother = "another"
const CategoryBooks = "books"
const CategoryBuild = "build"
const CategoryChildren = "children"
const CategoryClothers = "clothers"
const CategoryCosmetic = "cosmetic"
const CategoryElectronics= "electronics"
const CategoryFlora = "flora"
const CategoryFood = "food"
const CategoryFurniture = "furniture"
const CategoryMusic = "music"
const CategoryOld = "old"
const CategoryPencil = "pencil"
const CategoryPlay = "play"
const CategorySport = "sport"

export function GetCategory(category) {
  let image = Another;
  switch (category) {
    case CategoryAnimals:
      image = Animal;
      break;
    case CategoryBooks:
      image = Book;
      break;
    case CategoryBuild:
      image = Build;
      break;
    case CategoryChildren:
      image = Child;
      break;
    case CategoryClothers:
      image = Clothers;
      break;
    case CategoryCosmetic:
      image = Cosmetic;
      break;
    case CategoryElectronics:
      image = Electronics;
      break;
    case CategoryFlora:
      image = Flora;
      break;
    case CategoryFood:
      image = Food;
      break;
    case CategoryFurniture:
      image = Furniture;
      break;
    case CategoryMusic:
      image = Music;
      break;
    case CategoryOld:
      image = Old;
      break;
    case CategoryPencil:
      image = Pencil;
      break;
    case CategoryPlay:
      image = Play;
      break;
    case CategorySport:
      image = Sport;
      break;
  }
  return image
}

export function GetCategoryImage(category) {
  let image = GetCategory(category);
  return <img src={image} className="category" />;
}

export function GetCategoryImageSmall(category) {
  let image = GetCategory(category);
  return <img src={image} className="category30" />;
}

export const Categories = props => {
  const [category, setCategory] = useState("")
  return (
    <Div
      style={{
        display: "flex",
        padding: "0px"
      }}
    >
      <Div
        style={{
          display: "flex",
          alignContent: "flex-end",
          alignItems: "flex-end",
          marginBottom:"10%",
          padding: "0"
        }}
      >
        {GetCategoryImageSmall(category)}
      </Div>
      <FormLayout>
        <Select
          onClick={e => {
            const { _, value } = e.currentTarget;
            props.choose(value);
            setCategory(value)
          }}
          top="Категория"
          placeholder="Не указана"
        >
          <option value={CategoryAnimals}>Животные</option>
          <option value={CategoryAnother}>Другое</option>
          <option value={CategoryBooks}>Книги</option>
          <option value={CategoryBuild}>Стройматериалы и инструменты</option>
          <option value={CategoryChildren}>Товары для детей</option>
          <option value={CategoryClothers}>Одежда, обувь и сумки</option>
          <option value={CategoryCosmetic}>Косметика, бижутерия, парфюмерия</option>
          <option value={CategoryElectronics}>Бытовая техника и электроника</option>
          <option value={CategoryFlora}>Растения</option>
          <option value={CategoryFood}>Продукты питания</option>
          <option value={CategoryFurniture}>Мебель</option>
          <option value={CategoryMusic}>Музыкальные инструменты</option>
          <option value={CategoryOld}>Средства реабилитации</option>
          <option value={CategoryPencil}>Канцтовары</option>
          <option value={CategoryPlay}>Игры и развлечения</option>
          <option value={CategorySport}>Спортивный инвентарь</option>
        </Select>
      </FormLayout>
    </Div>
  );
};
