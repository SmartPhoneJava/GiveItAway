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

import "@vkontakte/vkui/dist/vkui.css";

import "@vkontakte/vkui/dist/vkui.css";

import Main from "./panels/Main";

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

  return (
      <Main id="main" go={go} />
  );
};

export default App;
