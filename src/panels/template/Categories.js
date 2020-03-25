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

const CategoryAnimals = "animals";
const CategoryAnother = "another";
const CategoryBooks = "books";
const CategoryBuild = "build";
const CategoryChildren = "children";
const CategoryClothers = "clothers";
const CategoryCosmetic = "cosmetic";
const CategoryElectronics = "electronics";
const CategoryFlora = "flora";
const CategoryFood = "food";
const CategoryFurniture = "furniture";
const CategoryMusic = "music";
const CategoryOld = "old";
const CategoryPencil = "pencil";
const CategoryPlay = "play";
const CategorySport = "sport";

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
  return image;
}

export function GetCategoryText(category) {
  switch (category) {
    case CategoryAnimals:
      return "Животные";
    case CategoryBooks:
      return "Книши";
    case CategoryBuild:
      return "Стройматериалы и инструменты";
    case CategoryChildren:
      return "Товары для детей";
    case CategoryClothers:
      return "Одежда, обувь и сумки";
    case CategoryCosmetic:
      return "Косметика, бижутерия, парфюмерия";
    case CategoryElectronics:
      return "Бытовая техника и электроника";
    case CategoryFlora:
      return "Растения";
    case CategoryFood:
      return "Продукты питания";
    case CategoryFurniture:
      return "Мебель";
    case CategoryMusic:
      return "Музыкальные инструменты";
    case CategoryOld:
      return "Средства реабилитации";
    case CategoryPencil:
      return "Канцтовары";
    case CategoryPlay:
      return "Игры и развлечения";
    case CategorySport:
      return "Спортивный инвентарь";
  }
  return "Другое";
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
  const categories = [
    "Не указана",
    CategoryAnimals,
    CategoryBooks,
    CategoryBuild,
    CategoryChildren,
    CategoryClothers,
    CategoryCosmetic,
    CategoryElectronics,
    CategoryFlora,
    CategoryFood,
    CategoryFurniture,
    CategoryMusic,
    CategoryOld,
    CategoryPencil,
    CategoryPlay,
    CategorySport,
    CategoryAnother
  ];
  const [category, setCategory] = useState(props.category);
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
          marginBottom: "10%",
          padding: "10px"
        }}
      >
        {GetCategoryImageSmall(category)}
      </Div>
      <FormLayout>
        <Select
          onClick={e => {
            const { _, value } = e.currentTarget;
            props.choose(value);
            setCategory(value);
          }}
          top="Категория"
          placeholder={GetCategoryText(category)}
        >
          {categories.map((cat, i) => {
            if (category != cat) {
              return <option key={i} value={cat}>{GetCategoryText(cat)}</option>;
            }
            return "";
          })}
        </Select>
      </FormLayout>
    </Div>
  );
};
