import React, { useState } from "react";
import {
  PanelHeaderSimple,
  List,
  Cell,
  PanelHeaderButton,
  PanelHeaderContext,
  TabsItem,
  Tabs
} from "@vkontakte/vkui";

import Animal24 from "./../../../img/animal30.png";
import "./addsTab.css";

import Icon24Done from "@vkontakte/icons/dist/24/done";
import Icon24Notification from "@vkontakte/icons/dist/24/notification";
import Icon16Dropdown from "@vkontakte/icons/dist/16/dropdown";

import Icon28SettingsOutline from "@vkontakte/icons/dist/28/settings_outline";

import AddsTab from "./tabs/adds/AddsTab";

const tabAdds = "adds";
const tabAddsText = "Объявления";

const tabNotification = "notification";
const tabNotificationText = "Уведомления";

const AddsTabs = () => {
  const [contextOpened, setContextOpened] = useState(false);
  const [mode, setmode] = useState("all");
  const [activeTab, setActiveTab] = useState(tabAdds);

  function select(e) {
    setmode(e.currentTarget.dataset.mode);
    setContextOpened(false);
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
                  transition: "0.3s",
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
            before={<img src={Animal24} alt="logo" className="wrapper" />}
            asideContent={
              mode === "all" ? <Icon24Done fill="var(--accent)" /> : null
            }
            onClick={select}
            data-mode="all"
          >
            Все
          </Cell>
          <Cell
            before={<Icon28SettingsOutline />}
            asideContent={
              mode === "managed" ? <Icon24Done fill="var(--accent)" /> : null
            }
            onClick={select}
            data-mode="managed"
          >
            Мои
          </Cell>
        </List>
      </PanelHeaderContext>
      <AddsTab></AddsTab>
    </React.Fragment>
  );
};

export default AddsTabs;
