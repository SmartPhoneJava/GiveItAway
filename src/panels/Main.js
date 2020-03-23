import React, { useState } from "react";
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
import { setDisplayName } from "recompose";

const ads = "ads";
const adsText = "Объявления";

const add = "add";
const addText = "Создать";

const profile = "profile";
const profileText = "Профиль";

const categories = "categories";
const categoriesText = "Категория";

const Main = () => {
  const [activeStory, setActiveStory] = useState(ads);
  const [prevStory, setPrevStory] = useState(ads);

  const onStoryChange = e => {
    setActiveStory(e.currentTarget.dataset.story);
  };

  const [activePanel, setActivePanel] = useState("header-search");
  const [activeModal, setActiveModal] = useState(null);

  const [category, setCategory] = useState("");
  const [categoryID, setCategoryID] = useState("");

  function goSearch() {
    setActivePanel("search");
  }
  function hideModal() {
    setActiveModal(null);
  }

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
        </Panel>
      </View>

      <View id={add} activePanel={add}>
        <Panel id={add}>
          <PanelHeader>{addText}</PanelHeader>
          <CreateAdd
            openCategories={id => {
              setPrevStory(add);
              setActiveStory(categories);
              setCategoryID(id)
            }}
            id={categoryID}
            category={category}
          />
        </Panel>
      </View>
      <View id={profile} activePanel={profile}>
        <Panel id={profile}>
          <PanelHeader>{profileText} </PanelHeader>
        </Panel>
      </View>
    </Epic>
  );
};

export default Main;