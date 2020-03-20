import React, { useState } from "react";
import { Group, Cell, List, Select, FormLayout } from "@vkontakte/vkui";

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

export function GetCategoryImage(category) {
    let image = Another;
    switch (category) {
      case "animals":
        image = Animal;
        break;
      case "books":
        image = Book;
        break;
      case "build":
        image = Build;
        break;
      case "children":
        image = Child;
        break;
      case "clothers":
        image = Clothers;
        break;
      case "cosmetic":
        image = Cosmetic;
        break;
      case "electronics":
        image = Electronics;
        break;
      case "flora":
        image = Flora;
        break;
      case "food":
        image = Food;
        break;
      case "furniture":
        image = Furniture;
        break;
      case "music":
        image = Music;
        break;
      case "old":
        image = Old;
        break;
      case "pencil":
        image = Pencil;
        break;
      case "play":
        image = Play;
        break;
      case "sport":
        image = Sport;
        break;
    }
    return <img src={image} className="category" />;
  }

export const Categories = props => {
  return (
    <FormLayout>
    <Select onClick={
      e => {
        const { _, value } = e.currentTarget;
        props.choose(value)
      }
    } top="Обычный Select" placeholder="Выберите пол" >
      <option value="m">Мужской</option>
      <option value="f">Женский</option>
      
    </Select>
  </FormLayout>
  );
};
