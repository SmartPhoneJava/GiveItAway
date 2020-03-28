import React, { useState, useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";
import {
  View,
  Panel,
  PanelHeader,
  Epic,
  Tabbar,
  TabbarItem,
  Placeholder,
  Button
} from "@vkontakte/vkui";

import AddsTabs from "./story/adds/AddsTabs";
import CreateAdd from "./story/create/CreateAdd";

import Icon28User from "@vkontakte/icons/dist/28/user";
import Icon28NewsfeedOutline from "@vkontakte/icons/dist/28/newsfeed_outline";
import Icon28Add from "@vkontakte/icons/dist/28/add_outline";

import Icon56UsersOutline from "@vkontakte/icons/dist/56/users_outline";

import { User } from "../store/user";
import { VkUser } from "../store/vkUser";

import { Addr } from "../store/addr";
import { CategoryNo } from "./template/Categories";

import AddsModal, { MODAL_FILTERS, MODAL_CATEGORIES } from "./story/adds/AddsModal";
import CreateModal from "./story/create/CreateModal"

const ads = "ads";
const adsText = "Объявления";

const add = "add";
const addText = "Создать";

const profile = "profile";
const profileText = "Профиль";

const Main = () => {
  const [popout, setPopout] = useState(null); //<ScreenSpinner size="large" />

  const [activeStory, setActiveStory] = useState(ads);
  const [category, setCategory] = useState(CategoryNo);
  const [category2, setCategory2] = useState(CategoryNo);

  const onStoryChange = e => {
    setActiveStory(e.currentTarget.dataset.story);
  };

  const [activePanel, setActivePanel] = useState("header-search");
  const [activeModal, setActiveModal] = useState(null);
  const [activeModal2, setActiveModal2] = useState(null);
  const [snackbar, setSnackbar] = useState(null);

  function goSearch() {
    setActivePanel("search");
  }

  function goToAds(snack) {
    setActiveStory(ads);
    if (snack != undefined) {
      setSnackbar(snack);
    }
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
      console.log("secret:", window.location.href);
      console.log("user user:", user);
      fetch(Addr.getState() + `/api/user/auth`, {
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
          User.dispatch({ type: "set", new_state: data });
          console.log(
            "Request successful",
            data.name,
            data.surname,
            data.photo_url,
            data.carma
          );
          console.log("loook at me", User.getState());
          return data;
        })
        .catch(function(error) {
          console.log("Request failed", error);
        });
    }

    async function fetchData() {
      const us = await bridge.send("VKWebAppGetUserInfo");
      setPopout(null);
      VkUser.dispatch({ type: "set", new_state: us });
      
      const uss = await bridge.send("VKWebAppGetPersonalCard", {
        type: ["phone", "email", "address"]
      });
      console.log("hello:", uss);
      
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
          <AddsModal
            activeModal={activeModal}
            setActiveModal={setActiveModal}
            category={category}
            setCategory={setCategory}
          />
        }
        header={false}
      >
        <Panel id="header-search" separator={false}>
          <AddsTabs
            onFiltersClick={() => setActiveModal(MODAL_FILTERS)}
            goSearch={goSearch}
            setPopout={setPopout}
            category={category}
            dropFilters={() => setCategory(CategoryNo)}
          />
          {snackbar}
        </Panel>
      </View>

      <View id={add} activePanel={add} popout={popout} modal={
          <CreateModal
            activeModal={activeModal2}
            setActiveModal={setActiveModal2}
            category={category2}
            setCategory={setCategory2}
          />
        }>
        <Panel id={add}>
          <PanelHeader>{addText}</PanelHeader>
          <CreateAdd
            setPopout={setPopout}
            goToAds={goToAds}
            snackbar={snackbar}
            setSnackbar={setSnackbar}
            category={category2}
            VkUser={VkUser}
            chooseCategory={() => setActiveModal2(MODAL_CATEGORIES)}
          />
          {snackbar}
        </Panel>
      </View>
      <View id={profile} activePanel={profile} popout={popout}>
        <Panel id={profile}>
          <PanelHeader>{profileText} </PanelHeader>
          <Placeholder
            icon={<Icon56UsersOutline />}
            header="В разработке. Загляните позже &#128522;"
            action={
              <Button onClick={() => setActiveStory(ads)} size="l">
                Вернуться к ленте объявлений
              </Button>
            }
            stretched={true}
          >
            Мы упорно трудимся над вашим профилем!
          </Placeholder>
          {snackbar}
        </Panel>
      </View>
    </Epic>
  );
};

export default Main;
