import React from "react";
import {
  Cell,
  Avatar,
  Button,
  Div,
  Card,
  CardGrid,
  Counter
} from "@vkontakte/vkui";

import Icon24MoreHorizontal from "@vkontakte/icons/dist/24/more_horizontal";
import Icon24CommentOutline from "@vkontakte/icons/dist/24/comment_outline";

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

import "./addsTab.css";

const Add = props => {
  function getContacts(contacts) {
    if (contacts != "") {
      return (
        <div>
          <Cell description={contacts}></Cell>
        </div>
      );
    }
    return <div></div>;
  }

  function getPM(pm) {
    if (pm) {
      return <Button size="m">Пишите в ЛС</Button>;
    }
    return <div></div>;
  }

  function getComments(comments, comments_counter) {
    if (comments) {
      return (
        <Div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center"
          }}
        >
          <Button size="m" mode="secondary">
            {" "}
            Пишите в Комментарии
          </Button>
          <Cell
            indicator={<Counter mode="primary">{comments_counter}</Counter>}
          >
            <Icon24CommentOutline />
          </Cell>
        </Div>
      );
    }
    return <div></div>;
  }

  function getFeedback(pm, comments, comments_counter, contacts, status) {
    if (status === "active") {
      return (
        <div>
          {getPM(pm)}

          {getComments(comments, comments_counter)}

          {getContacts(contacts)}
        </div>
      );
    }
    return <div>Обсуждение закрыто</div>;
  }

  // function Animals(str) {
  //   if (str.search("animals") > 0) {
  //     return <img src={Animal} className="category" />;
  //   }
  // }

  // function Books(str) {
  //   if (str.search("books") > 0) {
  //     return <img src={Book} className="category" />;
  //   }
  // }

  // function getCategory(category) {
  //   return (
  //     <Div style={{ paddingTop: 0, paddingBottom: 0, color: "black" }}>
  //       {Animals(category)} {Books(category)}
  //     </Div>
  //   );
  // }

  function getCategory(category) {
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

  function getName(anonymous) {
    if (anonymous) {
      return;
    }
    return;
  }

  return (
    <CardGrid>
      <Card size="l" mode={props.status === "active" ? "shadow" : "tint"}>
        <Cell
          before={getCategory(props.category)}
          size="m"
          description={props.date}
          asideContent={<Icon24MoreHorizontal />}
        >
          {props.name}
        </Cell>
        <Div style={{ paddingTop: 0, paddingBottom: 0, color: "black" }}>
          {props.description}
        </Div>
        <Cell
          before={!props.anonymous ? <Avatar size={36} /> : <div />}
          description={props.location}
          size="l"
          multiline="true"
          asideContent={getFeedback(
            props.pm,
            props.comments,
            props.comments_counter,
            props.contacts,
            props.status
          )}
        >
          {!props.anonymous ? props.username : ""}
        </Cell>
      </Card>
    </CardGrid>
  );
};

export default Add;
