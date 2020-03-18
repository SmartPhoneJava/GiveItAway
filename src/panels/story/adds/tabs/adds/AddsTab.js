import React, { useState, useRef } from "react";
import {
  Search,
  List,
  Cell,
} from "@vkontakte/vkui";


import Icon24Filter from "@vkontakte/icons/dist/24/filter";

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
