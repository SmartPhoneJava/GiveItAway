import React, { useState } from "react";
import {
  PanelHeaderSimple,
  Search,
  List,
  Cell,
  PanelHeaderButton,
  PanelHeaderContext,
  TabsItem,
  Tabs
} from "@vkontakte/vkui";

import Icon24Done from "@vkontakte/icons/dist/24/done";
import Icon24Filter from "@vkontakte/icons/dist/24/filter";
import Icon24Notification from "@vkontakte/icons/dist/24/notification";
import Icon16Dropdown from "@vkontakte/icons/dist/16/dropdown";


import Icon28UsersOutline from "@vkontakte/icons/dist/28/users_outline";
import Icon28SettingsOutline from "@vkontakte/icons/dist/28/settings_outline";

const thematics = [
  { id: 3201, name: "Объявление1" },
  { id: 3273, name: "Объявление2" },
  { id: 3205, name: "Объявление3" },
  { id: 3282, name: "Объявление4" },
  { id: 3283, name: "Объявление5" },
  { id: 3284, name: "Объявление6" },
  { id: 3285, name: "Объявление7" },
];

class AddsTab extends React.Component {
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

export default AddsTab;
