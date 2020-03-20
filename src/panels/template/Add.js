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

import {GetCategoryImage} from "./Categories"

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
          before={GetCategoryImage(props.category)}
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
