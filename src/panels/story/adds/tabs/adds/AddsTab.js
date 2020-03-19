import React, { useState } from "react";
import { Search, Group, Header } from "@vkontakte/vkui";

import Icon24Filter from "@vkontakte/icons/dist/24/filter";

import Add from "./../../../../template/Add";

const myID = 3;

const addsArr = [
  {
    id: 3201,
    status: "active",
    name: "Отдам котенка",
    anonymous: false,
    description:
      "Кому то нужны маленькие пушистики\nИм очень нужен дом\n......\nФотка старая котята ещё не роделись , просто показываю какие будут\n.. лучше же отдать в хорошие руки чем топить",
    date: "12.12.2012",
    pm: true,
    comments: false,
    contacts: "",
    category: "animals",
    location: "Барнаул, Яблочная улица",
    user: {
      id: 1,
      name: "Семен Ефимов"
    }
  },
  {
    id: 3202,
    status: "active",
    name: "Отдам котёнка, мальчик",
    anonymous: false,
    description:
      "Отдам котёнка, мальчик. 1 месяц, кушает пока только молочко, к лотку приучается. Котёнок от кошки крысыловки и британского кота. У кошки второй помёт. Котёнком заниматься не когда, так как у меня грудной ребёнок. Возможна доставка по Ленинску",
    date: "13.12.2012",
    pm: false,
    comments: false,
    contacts: "Звоните по номеру 89268923412",
    category: "animals",
    location: "Барнаул, Яблочная улица",
    user: {
      id: 2,
      name: "Алёна Чернышева"
    }
  },
  {
    id: 3203,
    status: "active",
    name: "Меняю вещи",
    anonymous: false,
    description:
      "Отдам за сахар и растительное масло все вещи в хорошем состоянии. Джинсы размер 27, лосины размер 44, брюки размер 46, кофта размер М, Игрушки отдам за растительное масло. Не бронирую пишите кто действительно будет забирать.",
    date: "14.12.2012",
    feedback: "comments",
    category: "clothers",
    pm: false,
    comments: true,
    comments_counter: 4,
    contacts: "",
    location: "Ленинский район.",
    user: {
      id: 3,
      name: "Иришка воронина"
    }
  },
  {
    id: 3204,
    status: "active",
    name: "Ловите штукатурку",
    anonymous: false,
    description:
      `НАЗНАЧЕНИЕ:
      Для высококачественного оштукатуривания вручную потолков и стен с обычным твердым основанием (бетон, кирпич, цементная штукатурка), а также поверхностей из пенополистирола, ЦСП;
      Для внутренних работ;
      Для гладких бетонных потолочных и стеновых поверхностей.
      ПРЕИМУЩЕСТВА:
      Гладкая поверхность;
      Не трескается даже при толстом слое;
      Универсальность материала — одновременное оштукатуривание и шпаклевание, изготовление декоративных элементов, Ремонтные и реставрационные работы;
      Высокая водоудерживающая способность;
      Регулирует влажностный режим в помещении — «дышит», создавая благоприятный микроклимат в помещении;
      Материал изготовлен из экологически чистого природного минерала (гипса) и не содержит вредных для здоровья человека веществ.
      `,
    date: "13.12.2012",
    pm: false,
    comments: false,
    contacts: "Спрятала огромное полотно текста в контактах. Попробуйте правильно вывести это все. Ахахахахахаххаха. Кто что думает о фильме Джеентельмены? По моему там не хватает экшена :Р",
    category: "build",
    location: "Могилев, улица строителей",
    user: {
      id: 4,
      name: "Ирина Черыжкина"
    }
  },
  {
    id: 3205,
    status: "active",
    name: "Плэйстешн",
    anonymous: false,
    description:
      `Новый плэйстейшн купили сегодня в Sony center на меге на розыбакиева. Даже ни разу не подключали все абсолютно новое чек гарантийный талон...дали еще 2 купона на покупки в Еврика и Бош...нужны деньги срочно...купили за 128 790 отдаем за бесплатно но торг уместен...
      `,
    date: "15.12.2012",
    pm: true,
    comments: true,
    comments_counter: 100, 
    contacts: "договоримся звоните...87479754978, 87075000804...плэйстешн, джостик, 3 диска все в наборе и с пакетом от sony и с чеком",
    category: "play",
    location: "Алматы",
    user: {
      id: 5,
      name: "Нурмухаммед Нурдаулет"
    }
  },
  {
    id: 3206,
    status: "waiting",
    name: "Отдаю много всякого",
    anonymous: true,
    description:
      `Анон. Отдам чаи 500 тг. Роутер 10тыс тг, книга 500тг. Отдам даром туфли 37 размера
      `,
    date: "15.12.2012",
    pm: false,
    comments: false,
    contacts: "87016073540",
    category: "products, electronics, books, clothers",
    location: "",
    user: {
      id: 6,
      name: "Петя Сидоров"
    }
  },
];

const AddsTab = props => {
  const [search, setSearch] = useState("");

  function onChange(e) {
    setSearch(e.target.value);
  }

  function adds() {
    const s = search.toLowerCase();
    return addsArr.filter(({ name }) => name.toLowerCase().indexOf(s) > -1);
  }

  return (
    <div>
      <Search
        value={search}
        onChange={onChange}
        icon={<Icon24Filter />}
        onIconClick={props.onFiltersClick}
      />
      <Group
        separator="hide"
        header={<Header mode="secondary">Дефолтный стиль</Header>}
      >
        {adds().map(add => (
          <Add
            key={add.id}
            category={add.category}
            name={add.name}
            description={add.description}
            date={add.date}
            pm={add.pm}
            comments={add.comments}
            comments_counter={add.comments_counter}
            contacts={add.contacts}
            location={add.location}
            username={add.user.name}
            status={add.status}
            anonymous={add.anonymous}
          ></Add>
        ))}
      </Group>
    </div>
  );
};

export default AddsTab;
