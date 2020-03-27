import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, Group, Placeholder, Button } from "@vkontakte/vkui";

import Icon24Filter from "@vkontakte/icons/dist/24/filter";
import Icon56UsersOutline from "@vkontakte/icons/dist/56/users_outline";
import Icon56ErrorOutline from "@vkontakte/icons/dist/56/error_outline";

import Add from "./../../../../template/Add";

import { User } from "./../../../../../store/user";
import { Addr } from "./../../../../../store/addr";
import { AdsPage } from "../../../../../store/activeModal";

import useAdSearch from "./useAdSearch";

import Error from "./../../../../placeholders/error";
import AdNotFound from "./../../../../placeholders/adNotFound";

const addsArrDD = [
  {
    ad_id: 3201,
    status: "offer",
    header: "Отдам котенка",
    anonymous: false,
    text:
      "Кому то нужны маленькие пушистики\nИм очень нужен дом\n......\nФотка старая котята ещё не роделись , просто показываю какие будут\n.. лучше же отдать в хорошие руки чем топить",
    creation_date: "12.12.2012",
    feedback_type: "comments",
    extra_field: "",
    category: "animals",
    location: "Барнаул, Яблочная улица",
    author: {
      vk_id: 1,
      name: "Семен",
      surname: "ефимов"
    }
  },
  {
    ad_id: 3202,
    status: "offer",
    header: "Отдам котёнка, мальчик",
    anonymous: false,
    text:
      "Отдам котёнка, мальчик. 1 месяц, кушает пока только молочко, к лотку приучается. Котёнок от кошки крысыловки и британского кота. У кошки второй помёт. Котёнком заниматься не когда, так как у меня грудной ребёнок. Возможна доставка по Ленинску",
    creation_date: "13.12.2012",
    feedback_type: "comments",
    extra_field: "Звоните по номеру 89268923412",
    category: "animals",
    location: "Барнаул, Яблочная улица",
    author: {
      vk_id: 2,
      name: "Алёна",
      surname: "Чернышева"
    }
  },
  {
    ad_id: 3203,
    status: "offer",
    header: "Меняю вещи",
    anonymous: false,
    text:
      "Отдам за сахар и растительное масло все вещи в хорошем состоянии. Джинсы размер 27, лосины размер 44, брюки размер 46, кофта размер М, Игрушки отдам за растительное масло. Не бронирую пишите кто действительно будет забирать.",
    creation_date: "14.12.2012",
    feedback: "comments",
    category: "clothers",
    pm: false,
    feedback_type: "comments",
    comments_counter: 4,
    extra_field: "",
    location: "Ленинский район.",
    author: {
      vk_id: 3,
      name: "Иришка",
      surname: "Воронина"
    }
  },
  {
    ad_id: 3204,
    status: "offer",
    header: "Ловите штукатурку",
    anonymous: false,
    text: `НАЗНАЧЕНИЕ:
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
    creation_date: "13.12.2012",
    feedback_type: "comments",
    extra_field:
      "Спрятала огромное полотно текста в контактах. Попробуйте правильно вывести это все. Ахахахахахаххаха. Кто что думает о фильме Джеентельмены? По моему там не хватает экшена :Р",
    category: "build",
    location: "Могилев, улица строителей",
    author: {
      vk_id: 4,
      name: "Ирина",
      surname: "Черыжкина"
    }
  },
  {
    ad_id: 3205,
    status: "offer",
    header: "Плэйстешн",
    anonymous: false,
    text: `Новый плэйстейшн купили сегодня в Sony center на меге на розыбакиева. Даже ни разу не подключали все абсолютно новое чек гарантийный талон...дали еще 2 купона на покупки в Еврика и Бош...нужны деньги срочно...купили за 128 790 отдаем за бесплатно но торг уместен...
      `,
    creation_date: "15.12.2012",
    feedback_type: "comments",
    comments_counter: 100,
    extra_field:
      "договоримся звоните...87479754978, 87075000804...плэйстешн, джостик, 3 диска все в наборе и с пакетом от sony и с чеком",
    category: "play",
    location: "Алматы",
    author: {
      vk_id: 5,
      name: "Нурмухаммед",
      surname: "Нурдаулет"
    }
  },
  {
    ad_id: 3206,
    status: "waiting",
    header: "Отдаю много всякого",
    anonymous: true,
    text: `Анон. Отдам чаи 500 тг. Роутер 10тыс тг, книга 500тг. Отдам даром туфли 37 размера
      `,
    creation_date: "15.12.2012",
    feedback_type: "comments",
    extra_field: "87016073540",
    category: "products, electronics, books, clothers",
    location: "",
    author: {
      vk_id: 6,
      name: "Петя",
      surname: "Сидоров"
    }
  }
];

const AddsTab = props => {
  const [search, setSearch] = useState("");

  const [items, setItems] = useState([]);

  const [pageNumber, setPageNumber] = useState(1);

  const { loading, error, ads, hasMore, newPage } = useAdSearch(
    search,
    props.category,
    props.mode,
    pageNumber,
    5
  );

  const observer = useRef();
  const lastAdElementRef = useCallback(
    node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber(prevPageNumber => newPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  function handleSearch(e) {
    setSearch(e.target.value);
    setPageNumber(1);
    props.setPopout(null);
  }

  return (
    <>
      <Search
        value={search}
        onChange={handleSearch}
        icon={<Icon24Filter />}
        onIconClick={props.onFiltersClick}
      />
      <Group>
        {ads.length > 0 ? (
          ads.map((ad, index) => {
            if (ads.length === index + 1) {
              return (
                <div key={ad.ad_id} ref={lastAdElementRef}>
                  <Add
                    category={ad.category}
                    name={ad.header}
                    description={ad.text}
                    date={ad.creation_date}
                    pm={ad.feedback_type == "ls"}
                    comments={ad.feedback_type == "comments"}
                    comments_counter={
                      !ad.comments_counter ? 0 : ad.comments_counter
                    }
                    contacts={ad.extra_field}
                    location={ad.location}
                    username={ad.author.name + " " + ad.author.surname}
                    ava={ad.author.photo_url}
                    status={ad.status}
                    anonymous={ad.anonymous}
                  />
                </div>
              );
            } else {
              return (
                <Add
                  key={ad.ad_id}
                  category={ad.category}
                  name={ad.header}
                  description={ad.text}
                  date={ad.creation_date}
                  pm={ad.feedback_type == "ls"}
                  comments={ad.feedback_type == "comments"}
                  comments_counter={
                    !ad.comments_counter ? 0 : ad.comments_counter
                  }
                  contacts={ad.extra_field}
                  location={ad.location}
                  username={ad.author.name + " " + ad.author.surname}
                  ava={ad.author.photo_url}
                  status={ad.status}
                  anonymous={ad.anonymous}
                />
              );
            }
          })
        ) : error ? (
          <Error />
        ) : (
          <AdNotFound dropFilters={props.dropFilters} />
        )}
      </Group>
    </>
  );
};

export default AddsTab;
