import React, { useState, useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";
import { ScreenSpinner } from "@vkontakte/vkui";

import "@vkontakte/vkui/dist/vkui.css";

import "@vkontakte/vkui/dist/vkui.css";

import Main from "./panels/Main";

export let User = {
  vk_id: "0"
};

const App = () => {
  const [activePanel, setActivePanel] = useState("home");
  const [user, setUser] = useState({
    vk_id: "0"
  });
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
          vk_id: user.id,
          Url: window.location.href,
          name: user.first_name,
          surname: user.last_name,
          photo_url: user.photo_100
        }),
        credentials: "include"
      })
        .then(function(response) {
          console.log("Вот ответ от бека на запрос регистрации ", response);
          return response.json();
        })
        .then(function(data) {
          User = data;
          console.log(
            "Request successful",
            data.name,
            data.surname,
            data.photo_url,
            data.carma
          );
          return data;
        })
        .catch(function(error) {
          console.log("Request failed", error);
        });
    }

    async function fetchData() {
      const us = await bridge.send("VKWebAppGetUserInfo");
      setPopout(null);
      checkMe(us);
    }
    fetchData();
  }, []);

  const go = e => {
    setActivePanel(e.currentTarget.dataset.to);
  };

  console.log("lvl1 props.user ", user);

  function getUser() {
    return user;
  }

  return <Main id="main" go={go} user={getUser} />;
};

export default App;
