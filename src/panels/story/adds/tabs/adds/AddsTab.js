import React, { useState, useRef } from "react";
import { useAnimation, Animate } from "react-rebound";
import {
  PanelHeaderSimple,
  Search,
  List,
  Cell,
  PanelHeaderButton,
  PanelHeaderContext,
  TabsItem,
  Tabs
} from "@vkontakte/vkui";


import Icon24Done from "@vkontakte/icons/dist/24/done";
import Icon24Filter from "@vkontakte/icons/dist/24/filter";
import Icon24Notification from "@vkontakte/icons/dist/24/notification";
import Icon16Dropdown from "@vkontakte/icons/dist/16/dropdown";

import Icon28UsersOutline from "@vkontakte/icons/dist/28/users_outline";
import Icon28SettingsOutline from "@vkontakte/icons/dist/28/settings_outline";

const addsArr = [
  { id: 3201, name: "Объявление1" },
  { id: 3273, name: "Объявление2" },
  { id: 3205, name: "Объявление3" },
  { id: 3282, name: "Объявление4" },
  { id: 3283, name: "Объявление5" },
  { id: 3284, name: "Объявление6" },
  { id: 3285, name: "Объявление7" }
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
      <List>
        {adds().map(thematic => (
          <Cell key={thematic.id}>{thematic.name}</Cell>
        ))}
      </List>
    </div>
  );
};

export default AddsTab;
