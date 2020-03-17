import React, { useState, useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";
import {
  View,
  Panel,
  PanelHeader,
  Header,
  Group,
  Cell,
  CellButton,
  ScreenSpinner,
  Root,
  Epic,
  Tabbar,
  TabbarItem
} from "@vkontakte/vkui";

import Icon28More from "@vkontakte/icons/dist/28/more";
import Icon28MessageOutline from "@vkontakte/icons/dist/28/message_outline";
import Icon28NewsfeedOutline from "@vkontakte/icons/dist/28/newsfeed_outline";
import Icon28Notifications from "@vkontakte/icons/dist/28/notifications";
import Icon28SearchOutline from "@vkontakte/icons/dist/28/search_outline";

import "@vkontakte/vkui/dist/vkui.css";

import "@vkontakte/vkui/dist/vkui.css";
import { Greetings, withTextFieldState } from "./panels/logic/Greetings";
import SimpleForm from "./panels/logic/SimpleForm";

import Main from "./panels/Main";

import Home from "./panels/Home";
import Persik from "./panels/Persik";

const App = () => {
  const [activePanel, setActivePanel] = useState("home");
  const [fetchedUser, setUser] = useState(null);
  const [popout, setPopout] = useState(<ScreenSpinner size="large" />);

  useEffect(() => {
    bridge.subscribe(({ detail: { type, data } }) => {
      if (type === "VKWebAppUpdateConfig") {
        const schemeAttribute = document.createAttribute("scheme");
        schemeAttribute.value = data.scheme ? data.scheme : "client_light";
        document.body.attributes.setNamedItem(schemeAttribute);
      }
    });
    async function fetchData() {
      const user = await bridge.send("VKWebAppGetUserInfo");
      setUser(user);
      setPopout(null);
    }
    fetchData();
  }, []);

  const go = e => {
    setActivePanel(e.currentTarget.dataset.to);
  };

  const [activeStory, setActiveStory] = useState("more");

const onStoryChange = e => {
  setActiveStory(e.currentTarget.dataset.story);
};

  return (
      <Main id="main" go={go} activeStory={activeStory} onStoryChange={onStoryChange} />
    /*
    <Epic
      activeStory={activeStory}
      tabbar={
        <Tabbar>
          <TabbarItem
            onClick={onStoryChange}
            selected={activeStory === "feed"}
            data-story="feed"
            text="Новости"
          >
            <Icon28NewsfeedOutline />
          </TabbarItem>
          <TabbarItem
            onClick={onStoryChange}
            selected={activeStory === "discover"}
            data-story="discover"
            text="Поиск"
          >
            <Icon28SearchOutline />
          </TabbarItem>
          <TabbarItem
            onClick={onStoryChange}
            selected={activeStory === "messages"}
            data-story="messages"
            label="12"
            text="Сообщения"
          >
            <Icon28MessageOutline />
          </TabbarItem>
          <TabbarItem
            onClick={onStoryChange}
            selected={activeStory === "notifications"}
            data-story="notifications"
            text="Уведомлен."
          >
            <Icon28Notifications />
          </TabbarItem>
          <TabbarItem
            onClick={onStoryChange}
            selected={activeStory === "more"}
            data-story="more"
            text="Ещё"
          >
            <Icon28More />
          </TabbarItem>
        </Tabbar>
      }
    >
      <View id="feed" activePanel="feed">
        <Panel id="feed">
          <PanelHeader>Объявления</PanelHeader>
        </Panel>
      </View>
      <View id="discover" activePanel="discover">
        <Panel id="discover">
          <PanelHeader>Поиск</PanelHeader>
        </Panel>
      </View>
      <View id="messages" activePanel="messages">
        <Panel id="messages">
          <PanelHeader>Сообщения</PanelHeader>
        </Panel>
      </View>
      <View id="notifications" activePanel="notifications">
        <Panel id="notifications">
          <PanelHeader>Уведомления</PanelHeader>
        </Panel>
      </View>
      <View id="more" activePanel="more">
        <Panel id="more">
          <PanelHeader>Ещё</PanelHeader>
        </Panel>
      </View>
    </Epic>*/
    /*
		<View activePanel="main">
		<Panel id="main">
		  <PanelHeader>VKUI</PanelHeader>
		  <Group header={<Header mode="secondary">Items</Header>}>
			<Cell>Hello</Cell>
			<Cell>World</Cell>
		  </Group>
		</Panel>
	  </View>*/

    /*
    <Root activeView={v}>
      <View activePanel={a} id="view1">
        <Panel id="panel1">
          <PanelHeader>View 1</PanelHeader>
          <Group>
            <CellButton onClick={() => va("view2")}>
              Open View 2
            </CellButton>
            <CellButton onClick={() => sa("panel2")}>Go to panel 2</CellButton>
          </Group>
        </Panel>
        <Panel id="panel2">
          <PanelHeader>Panel 2</PanelHeader>
          <Group>
            <CellButton onClick={() => sa("panel3")}>Go to panel 3</CellButton>
          </Group>
        </Panel>
        <Panel id="panel3">
          <PanelHeader>Panel 3</PanelHeader>
          <Group>
            <CellButton onClick={() => sa("panel1")}>Go to panel 3</CellButton>
          </Group>
        </Panel>
      </View>
      <View header activePanel="panel2.1" id="view2">
        <Panel id="panel2.1">
          <PanelHeader>View 2</PanelHeader>
          <Group>
            <CellButton onClick={() => va("view1")}>
              Back to View 1
            </CellButton>
          </Group>
        </Panel>
      </View>
    </Root>*/

    // 	<div>
    //     <SimpleForm />
    //   </div>
    /*
		<View activePanel={activePanel} popout={popout}>
			<Home id='home' fetchedUser={fetchedUser} go={go} />
			<Persik id='persik' go={go} />
		</View>*/
  );
};

export default App;
