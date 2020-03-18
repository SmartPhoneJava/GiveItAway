import React, { useState } from "react";
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

const tabAdds = "adds";
const tabAddsText = "Объявления";

const tabNotification = "notification";
const tabNotificationText = "Уведомления";

const AddsTab = props => {
  const [search, setSearch] = useState("");
  const [contextOpened, setContextOpened] = useState(false);
  const [mode, setmode] = useState("all");
  const [activeTab, setActiveTab] = useState(tabAdds);

  function select(e) {
    setmode(e.currentTarget.dataset.mode);
    setContextOpened(false);
  }

  function onChange(e) {
    setSearch(e.target.value);
  }

  function adds() {
    const s = search.toLowerCase();
    return addsArr.filter(
      ({ name }) => name.toLowerCase().indexOf(s) > -1
    );
  }

  return (
    <React.Fragment>
      <PanelHeaderSimple
        left={<PanelHeaderButton />}
        separator={false}
        right={
          <PanelHeaderButton>
            <Icon24Notification />
          </PanelHeaderButton>
        }
      >
        <Tabs>
          <TabsItem
            onClick={() => {
              if (activeTab === tabAdds) {
                setContextOpened(!contextOpened);
              }
              setActiveTab(tabAdds);
            }}
            selected={activeTab === tabAdds}
            after={
              <Icon16Dropdown
                fill="var(--accent)"
                style={{
                  transform: `rotate(${contextOpened ? "180deg" : "0"})`
                }}
              />
            }
          >
            {tabAddsText}
          </TabsItem>
          <TabsItem
            onClick={() => {
              setActiveTab(tabNotification);
              setContextOpened(false);
            }}
            selected={activeTab === tabNotification}
          >
            {tabNotificationText}
          </TabsItem>
        </Tabs>
      </PanelHeaderSimple>
      <PanelHeaderContext
        opened={contextOpened}
        onClose={() => {
          setContextOpened(false);
        }}
      >
        <List>
          <Cell
            before={<Icon28UsersOutline />}
            asideContent={
              mode === "all" ? (
                <Icon24Done fill="var(--accent)" />
              ) : null
            }
            onClick={select}
            data-mode="all"
          >
            Communities
          </Cell>
          <Cell
            before={<Icon28SettingsOutline />}
            asideContent={
              mode === "managed" ? (
                <Icon24Done fill="var(--accent)" />
              ) : null
            }
            onClick={select}
            data-mode="managed"
          >
            Managed Communities
          </Cell>
        </List>
      </PanelHeaderContext>
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
    </React.Fragment>
  );
};

export default AddsTab;
