import React, { useState, useEffect } from 'react';
import {
	PanelHeaderSimple,
	List,
	Counter,
	Cell,
	PanelHeaderButton,
	PanelHeaderContext,
	TabsItem,
	Tabs,
	TabbarItem,
	Avatar,
} from '@vkontakte/vkui';

import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';
import Icon28CubeBoxOutline from '@vkontakte/icons/dist/28/cube_box_outline';
import Icon28Notification from '@vkontakte/icons/dist/28/notification';

import Icon28LiveOutline from '@vkontakte/icons/dist/28/live_outline';
import Icon28UserCircleOutline from '@vkontakte/icons/dist/28/user_circle_outline';

import Icon24Done from '@vkontakte/icons/dist/24/done';
import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';

import Notifications from './tabs/notifications/notifications';

import AddsTab from './tabs/adds/AddsTab';

const tabAdds = 'adds';
const tabAddsText = 'Объявления';

const tabNotification = 'notification';
const tabNotificationText = 'Уведомления';

const AddsTabs = (props) => {
	const [contextOpened, setContextOpened] = useState(false);
	const [mode, setmode] = useState('all');
	const [activeTab, setActiveTab] = useState(props.savedAdState == '' ? tabAdds : props.savedAdState);

	useEffect(() => {
		if (props.adsMode == '') {
			return;
		}
		setmode(props.adsMode);
	}, [props.adsMode]);

	useEffect(() => {
		if (props.savedAdState != '') {
			setActiveTab(props.savedAdState);
		}
	}, [props.savedAdState]);
	function select(e) {
		setmode(e.currentTarget.dataset.mode);
		setContextOpened(false);
		props.dropFilters()
	}

	return (
		<React.Fragment>
			<PanelHeaderSimple left={<PanelHeaderButton />} separator={false}>
				<Tabs>
					<TabsItem
						label={100}
						onClick={() => {
							if (activeTab === tabAdds) {
								setContextOpened(!contextOpened);
							}
							setActiveTab(tabAdds);
						}}
						selected={activeTab === tabAdds}
						after={
							<Icon16Dropdown
								fill="var(--accent)"
								style={{
									marginLeft: '15px',
									transition: '0.3s',
									transform: `rotate(${contextOpened ? '180deg' : '0'})`,
								}}
							/>
						}
					>
						{mode == 'all' ? 'Все' : mode == 'wanted' ? 'Хочу забрать' : 'Отдаю'}
					</TabsItem>
					<TabsItem
						// label={props.notsCounter == 0 ? null : props.notsCounter}
						onClick={() => {
							setActiveTab(tabNotification);
							setContextOpened(false);
						}}
						selected={activeTab === tabNotification}
					>
						<TabbarItem data-story="feed" label={props.notsCounter == 0 ? null : props.notsCounter}>
							<Icon28Notifications />
						</TabbarItem>
					</TabsItem>
				</Tabs>
			</PanelHeaderSimple>
			<PanelHeaderContext
				opened={contextOpened}
				onClose={() => {
					setContextOpened(false);
				}}
			>
				<List>
					<Cell
						before={<Icon28LiveOutline />}
						asideContent={mode === 'all' ? <Icon24Done fill="var(--accent)" /> : null}
						onClick={select}
						data-mode="all"
					>
						Все
					</Cell>
					<Cell
						before={<Icon28UserCircleOutline />}
						asideContent={mode === 'managed' ? <Icon24Done fill="var(--accent)" /> : null}
						onClick={select}
						data-mode="managed"
					>
						Отдаю
					</Cell>
					<Cell
						before={<Icon28CubeBoxOutline />}
						asideContent={mode === 'wanted' ? <Icon24Done fill="var(--accent)" /> : null}
						onClick={select}
						data-mode="wanted"
					>
						Хочу забрать
					</Cell>
				</List>
			</PanelHeaderContext>
			{activeTab === tabNotification ? (
				<Notifications
					setSnackbar={props.setSnackbar}
					zeroNots={props.zeroNots}
					openUser={(u) => {
						props.openUser(u);
						props.setSavedAdState(tabNotification);
					}}
					openAd={(v) => {
						props.openAd(v);
						props.setSavedAdState(tabNotification);
					}}
					goToAds={() => {
						setActiveTab(tabAdds);
					}}
					setPopout={props.setPopout}
				/>
			) : (
				<AddsTab
					vkPlatform={props.vkPlatform}
					openAd={(v) => {
						props.openAd(v);
						props.setSavedAdState(tabAdds);
					}}
					dropFilters={() => {
						props.dropFilters();
						setmode('all');
					}}
					category={props.category}
					mode={mode}
					deleteID={props.deleteID}
					myID={props.myID}
					city={props.city}
					openUser={(u) => {
						props.openUser(u);
						setActiveTab(tabAdds);
					}}
					geodata={props.geodata}
					country={props.country}
					sort={props.sort}
					refresh={props.refresh}
					setPopout={props.setPopout}
					onFiltersClick={props.onFiltersClick}
					onCloseClick={props.onCloseClick}
					setSnackbar={props.setSnackbar}
					chooseAdd={props.chooseAdd}
				></AddsTab>
			)}
		</React.Fragment>
	);
};

export default AddsTabs;
