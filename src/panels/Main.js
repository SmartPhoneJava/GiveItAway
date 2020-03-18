import React, { useState } from "react";
import {
  View,
  Panel,
  PanelHeader,
  Epic,
  Tabbar,
  TabbarItem,
  PanelHeaderSimple,
  Search,
  Radio,
  SelectMimicry,
  FormLayoutGroup,
  FormLayout,
  List,
  Cell,
  ModalRoot,
  ModalPage,
  ModalPageHeader,
  PanelHeaderButton,
  IS_PLATFORM_ANDROID,
  IS_PLATFORM_IOS,
  PanelHeaderContext,
  TabsItem,
  Tabs
} from "@vkontakte/vkui";

import Icon28User from "@vkontakte/icons/dist/28/user";
import Icon28NewsfeedOutline from "@vkontakte/icons/dist/28/newsfeed_outline";
import Icon28Add from "@vkontakte/icons/dist/28/add_outline";
import Icon24Done from "@vkontakte/icons/dist/24/done";
import Icon24Filter from "@vkontakte/icons/dist/24/filter";
import Icon24Cancel from "@vkontakte/icons/dist/24/cancel";
import Icon24Notification from "@vkontakte/icons/dist/24/notification";
import Icon16Dropdown from "@vkontakte/icons/dist/16/dropdown";


import Icon28UsersOutline from "@vkontakte/icons/dist/28/users_outline";
import Icon28SettingsOutline from "@vkontakte/icons/dist/28/settings_outline";

const ads = "ads";
const adsText = "Объявления";

const add = "add";
const addText = "Создать";

const profile = "profile";
const profileText = "Профиль";

const thematics = [
  { id: 3201, name: "Аренда автомобилей" },
  { id: 3273, name: "Автотовары" },
  { id: 3205, name: "Автосалон" },
  { id: 3282, name: "Автосервис" },
  { id: 3283, name: "Услуги для автовладельцев" },
  { id: 3284, name: "Велосипеды" },
  { id: 3285, name: "Мотоциклы и другая мототехника" },
  { id: 3286, name: "Водный транспорт" },
  { id: 3287, name: "Автопроизводитель" },
  { id: 3288, name: "Автомойка" },
  { id: 3117, name: "Автошкола" },
  { id: 3118, name: "Детский сад" },
  { id: 3119, name: "Гимназия" },
  { id: 3120, name: "Колледж" },
  { id: 3121, name: "Лицей" },
  { id: 3122, name: "Техникум" },
  { id: 3123, name: "Университет" },
  { id: 3124, name: "Школа" },
  { id: 3125, name: "Институт" },
  { id: 3126, name: "Обучающие курсы" },
  { id: 3276, name: "Дополнительное образование" },
  { id: 3275, name: "Тренинг, семинар" },
  { id: 3127, name: "Танцевальная школа" }
];



class HeaderSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      contextOpened: false,
      mode: 'all'
    };

    this.onChange = this.onChange.bind(this);
    this.select = this.select.bind(this);
  }

  select(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setState({ mode, contextOpened: false });
  }

  onChange(e) {
    this.setState({ search: e.target.value });
  }

  get thematics() {
    const search = this.state.search.toLowerCase();
    return thematics.filter(
      ({ name }) => name.toLowerCase().indexOf(search) > -1
    );
  }

  render() {
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
                    if (this.state.activeTab1 === 'news') {
                      this.setState({ contextOpened: !this.state.contextOpened });
                    }
                    this.setState({ activeTab1: 'news' })
                  }}
                  selected={this.state.activeTab1 === 'news'}
                  after={<Icon16Dropdown fill="var(--accent)" style={{
                    transform: `rotate(${this.state.contextOpened ? '180deg' : '0'})`
                  }}/>}
                >
                  Объявления
                </TabsItem>
                <TabsItem
                  onClick={() => {
                    this.setState({ activeTab1: 'recomendations', contextOpened: false })
                  }}
                  selected={this.state.activeTab1 === 'recomendations'}
                >
                  Уведомления
                </TabsItem>
              </Tabs>
        </PanelHeaderSimple>
        <PanelHeaderContext
              opened={this.state.contextOpened}
              onClose={() => { this.setState({ contextOpened: false }) }}
            >
              <List>
                <Cell
                  before={<Icon28UsersOutline />}
                  asideContent={this.state.mode === 'all' ? <Icon24Done fill="var(--accent)" /> : null}
                  onClick={this.select}
                  data-mode="all"
                >
                  Communities
                </Cell>
                <Cell
                  before={<Icon28SettingsOutline />}
                  asideContent={this.state.mode === 'managed' ? <Icon24Done fill="var(--accent)" /> : null}
                  onClick={this.select}
                  data-mode="managed"
                >
                  Managed Communities
                </Cell>
              </List>
            </PanelHeaderContext>
        <Search
            value={this.state.search}
            onChange={this.onChange}
            icon={<Icon24Filter />}
            onIconClick={this.props.onFiltersClick}
          />
        <List>
          {this.thematics.map(thematic => (
            <Cell key={thematic.id}>{thematic.name}</Cell>
          ))}
        </List>
      </React.Fragment>
    );
  }
}

const Main = () => {
  const [activeStory, setActiveStory] = useState(ads);

  const onStoryChange = e => {
    setActiveStory(e.currentTarget.dataset.story);
  };

  const [activePanel, setActivePanel] = useState("header-search");
  const [activeModal, setActiveModal] = useState(null);

  function goHeaderSearch() {
    setActivePanel("header-search");
  }
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
          <HeaderSearch
            onFiltersClick={() => setActiveModal("filters")}
            goSearch={goSearch}
          />
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
};

export default Main;
