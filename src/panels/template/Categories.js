import React, { useState } from "react";
import {
  Div,
  Select,
  FormLayout,
  FormLayoutGroup,
  Radio,
  SelectMimicry
} from "@vkontakte/vkui";

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
import Question from "./../../img/question.png";

export const CategoryNo = "не определена";
export const CategoryAnimals = "animals";
export const CategoryAnother = "another";
export const CategoryBooks = "books";
export const CategoryBuild = "build";
export const CategoryChildren = "children";
export const CategoryClothers = "clothers";
export const CategoryCosmetic = "cosmetic";
export const CategoryElectronics = "electronics";
export const CategoryFlora = "flora";
export const CategoryFood = "food";
export const CategoryFurniture = "furniture";
export const CategoryMusic = "music";
export const CategoryOld = "old";
export const CategoryPencil = "pencil";
export const CategoryPlay = "play";
export const CategorySport = "sport";

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
    case CategoryNo:
      image = Question;
      break;
  }
  return image;
}

export function GetCategoryText(category) {
  switch (category) {
    case CategoryAnimals:
      return "Животные";
    case CategoryBooks:
      return "Книги";
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
    case CategoryNo:
      return "Не определена";
  }
  return "Другое";
}

export function GetCategoryImageBig(category) {
  let image = GetCategory(category);
  return <img src={image} className="category100" />;
}

export function GetCategoryImage(category) {
  let image = GetCategory(category);
  return <img src={image} className="category" />;
}

export function GetCategoryImageSmall(category) {
  let image = GetCategory(category);
  return <img src={image} className="category30" />;
}

export const categories = [
  CategoryNo,
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

export const CategoriesLabel = props => {
  return (
    <Div
      style={{
        display: "flex",
        padding: "0px"
      }}
    >
      <Div
        style={{
          alignContent: "flex-end",
          alignItems: "flex-end",
          padding: "10px"
        }}
      >
        {GetCategoryImage(props.category)}
      </Div>
      <FormLayout>
        <SelectMimicry
          top="Категория"
          placeholder={GetCategoryText(props.category)}
          onClick={() => props.open()}
        />
      </FormLayout>
    </Div>
  );
};

export const CategoriesRB = props => {
  return (
    <FormLayout>
      <FormLayoutGroup>
        {categories.map((cat, i) => {
          if (props.category != cat) {
            return (
              <Radio
                key={i}
                name="cat"
                value={cat}
                onClick={e => {
                  const { _, value } = e.currentTarget;
                  props.choose(value);
                }}
              >
                {GetCategoryText(cat)}
              </Radio>
            );
          }
          return (
            <Radio
              key={i}
              name="cat"
              value={cat}
              defaultChecked
              onClick={e => {
                const { _, value } = e.currentTarget;
                props.choose(value);
              }}
            >
              {GetCategoryText(cat)}
            </Radio>
          );
        })}
      </FormLayoutGroup>
    </FormLayout>
  );
};
