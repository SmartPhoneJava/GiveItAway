import React, { useState, useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";
import {
  View,
  Panel,
  PanelHeader,
  Epic,
  Tabbar,
  TabbarItem,
  Radio,
  SelectMimicry,
  FormLayoutGroup,
  FormLayout,
  ModalRoot,
  ModalPage,
  ModalPageHeader,
  PanelHeaderButton,
  IS_PLATFORM_ANDROID,
  IS_PLATFORM_IOS,
  ScreenSpinner,
  Input,
  Select,
  Checkbox,
  Link,
  Button,
  Textarea,
  Card,
  Group,
  Header,
  CardGrid,
  Div,
  Counter,
  Cell,
  List,
  PanelHeaderBack,
  PanelHeaderSimple
} from "@vkontakte/vkui";

import AddsTabs from "./story/adds/AddsTabs";
import CreateAdd from "./story/create/CreateAdd";

import Icon28User from "@vkontakte/icons/dist/28/user";
import Icon28NewsfeedOutline from "@vkontakte/icons/dist/28/newsfeed_outline";
import Icon28Add from "@vkontakte/icons/dist/28/add_outline";
import Icon24Done from "@vkontakte/icons/dist/24/done";
import Icon24CommentOutline from "@vkontakte/icons/dist/24/comment_outline";
import Icon24Cancel from "@vkontakte/icons/dist/24/cancel";

import { store } from "./../user/store";

const ads = "ads";
const adsText = "Объявления";

const add = "add";
const addText = "Создать";

const profile = "profile";
const profileText = "Профиль";

const Main = () => {
  const [popout, setPopout] = useState(<ScreenSpinner size="large" />);

  const [activeStory, setActiveStory] = useState(ads);

  const onStoryChange = e => {
    setActiveStory(e.currentTarget.dataset.story);
  };

  const [activePanel, setActivePanel] = useState("header-search");
  const [activeModal, setActiveModal] = useState(null);
  const [snackbar, setSnackbar] = useState(null);

  function goSearch() {
    setActivePanel("search");
  }
  function hideModal() {
    setActiveModal(null);
  }
  function goToAds(snack) {
    setActiveStory(ads);
    setSnackbar(snack);
  }

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
          store.dispatch({ type: "set", new_state: data });
          console.log(
            "Request successful",
            data.name,
            data.surname,
            data.photo_url,
            data.carma
          );
          console.log("loook at me", store.getState());
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

  return (
    <Epic
      activeStory={activeStory}
      tabbar={
        <Tabbar>
          <TabbarItem
            onClick={onStoryChange}
            selected={activeStory === ads}
            data-story={ads}
            text={adsText}
          >
            <Icon28NewsfeedOutline />
          </TabbarItem>

          <TabbarItem
            onClick={onStoryChange}
            selected={activeStory === add}
            data-story={add}
            text={addText}
          >
            <Icon28Add />
          </TabbarItem>
          <TabbarItem
            onClick={onStoryChange}
            selected={activeStory === profile}
            data-story={profile}
            text={profileText}
          >
            <Icon28User />
          </TabbarItem>
        </Tabbar>
      }
    >
      <View
        popout={popout}
        id={ads}
        activePanel={activePanel}
        modal={
          <ModalRoot activeModal={activeModal}>
            <ModalPage
              id="filters"
              onClose={hideModal}
              header={
                <ModalPageHeader
                  left={
                    IS_PLATFORM_ANDROID && (
                      <PanelHeaderButton onClick={hideModal}>
                        <Icon24Cancel />
                      </PanelHeaderButton>
                    )
                  }
                  right={
                    <PanelHeaderButton onClick={hideModal}>
                      {IS_PLATFORM_IOS ? "Готово" : <Icon24Done />}
                    </PanelHeaderButton>
                  }
                >
                  Фильтры
                </ModalPageHeader>
              }
            >
              <FormLayout>
                <SelectMimicry top="Страна" placeholder="Не выбрана" />
                <SelectMimicry top="Город" placeholder="Не выбран" />
                <FormLayoutGroup top="Пол">
                  <Radio name="sex" value="male" defaultChecked>
                    Любой
                  </Radio>
                  <Radio name="sex" value="male">
                    Мужской
                  </Radio>
                  <Radio name="sex" value="female">
                    Женский
                  </Radio>
                </FormLayoutGroup>
              </FormLayout>
            </ModalPage>
          </ModalRoot>
        }
        header={false}
      >
        <Panel id="header-search" separator={false}>
          <AddsTabs
            onFiltersClick={() => setActiveModal("filters")}
            goSearch={goSearch}
          />
          {snackbar}
        </Panel>
      </View>

      <View id={add} activePanel={add} popout={popout}>
        <Panel id={add}>
          <PanelHeader>{addText}</PanelHeader>
          <CreateAdd setPopout={setPopout} goToAds={goToAds} />
          {snackbar}
        </Panel>
      </View>
      <View id={profile} activePanel={profile} popout={popout}>
        <Panel id={profile}>
          <PanelHeader>{profileText} </PanelHeader>
          {snackbar}
        </Panel>
      </View>
    </Epic>
  );
};

export default Main;
