import React, { useState } from "react";
import {
  View,
  Panel,
  PanelHeader,
  Epic,
  Tabbar,
  TabbarItem
} from "@vkontakte/vkui";

import Icon28User from "@vkontakte/icons/dist/28/user";
import Icon28NewsfeedOutline from "@vkontakte/icons/dist/28/newsfeed_outline";
import Icon28Add from "@vkontakte/icons/dist/28/add_outline";

const ads = "ads";
const adsText = "Объявления";

const add = "add";
const addText = "Создать";

const profile = "profile";
const profileText = "Профиль";

const Main = props => (
  <Epic
    activeStory={props.activeStory}
    tabbar={
      <Tabbar>
        <TabbarItem
          onClick={props.onStoryChange}
          selected={props.activeStory === ads}
          data-story={ads}
          text={adsText}
        >
          <Icon28NewsfeedOutline />
        </TabbarItem>

        <TabbarItem
          onClick={props.onStoryChange}
          selected={props.activeStory === add}
          data-story={add}
          text={addText}
        >
          <Icon28Add />
        </TabbarItem>
        <TabbarItem
          onClick={props.onStoryChange}
          selected={props.activeStory === profile}
          data-story={profile}
          text={profileText}
        >
          <Icon28User />
        </TabbarItem>
      </Tabbar>
    }
  >
    <View id={ads} activePanel={ads}>
      <Panel id={ads}>
        <PanelHeader>{adsText}</PanelHeader>
      </Panel>
    </View>
    <View id={add} activePanel={add}>
      <Panel id={add}>
        <PanelHeader>{addText}</PanelHeader>
      </Panel>
    </View>
    <View id={profile} activePanel={profile}>
      <Panel id={profile}>
        <PanelHeader>{profileText} </PanelHeader>
      </Panel>
    </View>
  </Epic>
);

export default Main;
