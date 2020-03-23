import React, { useState, useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";
import { ScreenSpinner } from "@vkontakte/vkui";

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

    async function checkMe(user) {
      fetch(`http://localhost:8091/api/user/auth`, {
        method: "post",
        mode: "cors",
        body: JSON.stringify({
          Url: window.location.href,
          name: user.first_name,
          surname: user.last_name,
          photo_url: user.photo_100
        }),
        credentials: "include"
      })
        .then(function(response) {
          console.log("hello ", response);
          return response.json();
        })
        .then(function(data) {
          console.log("Request successful", data);
          return data;
        })
        .catch(function(error) {
          console.log("Request failed", error);
        });
    }

    async function fetchData() {
      const user = await bridge.send("VKWebAppGetUserInfo");
      setUser(user);
      setPopout(null);
      console.log("baza:", user);
      checkMe(user);
    }
    console.log("urll:", window.location.href);
    console.log("query:", window.location.query);
    fetchData();
  }, []);

  const go = e => {
    setActivePanel(e.currentTarget.dataset.to);
  };

  return <Main id="main" go={go} />;
};

export default App;
