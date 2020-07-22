import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
	PanelHeader,
	List,
	Cell,
	PanelHeaderButton,
	PanelHeaderContext,
	TabsItem,
	Tabs,
	TabbarItem,
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
import { setFormData } from '../../../store/create_post/actions';
import { ADS_FILTERS } from '../../../store/create_post/types';
import { TAB_ADS, TAB_NOTIFICATIONS, MODE_ALL, MODE_WANTED, MODE_GIVEN } from '../../../const/ads';
import { setTab, openModal } from '../../../store/router/actions';
import { MODAL_ADS_FILTERS, MODAL_ADS_SUBS } from '../../../store/router/modalTypes';

const AddsTabs = (props) => {
	const { setFormData, setTab, openModal, inputData, activeTabs, activeStory } = props;
	const mode = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].mode : null) || MODE_ALL;
	const activeTab = activeTabs[activeStory] || TAB_ADS;
	const [contextOpened, setContextOpened] = useState(false);

	const [activeComponent, setActiveComponent] = useState(null);
	useEffect(() => {
		console.log('oNMECLICK', activeTab);
		let v = null;
		if (activeTab == TAB_NOTIFICATIONS) {
			v = (
				<Notifications
					zeroNots={props.zeroNots}
					openUser={props.openUser}
					openAd={props.openAd}
					goToAds={() => {
						setTab(TAB_ADS);
					}}
				/>
			);
		} else {
			v = (
				<AddsTab
					openAd={props.openAd}
					dropFilters={props.dropFilters}
					deleteID={props.deleteID}
					openUser={props.openUser}
					refresh={props.refresh}
					onFiltersClick={() => {
						openModal(MODAL_ADS_FILTERS);
					}}
					onCloseClick={() => {
						openModal(MODAL_ADS_SUBS);
					}}
				/>
			);
		}
		setActiveComponent(v);
	}, []);

	function select(e) {
		props.dropFilters();
		setFormData(ADS_FILTERS, {
			...inputData,
			mode: e.currentTarget.dataset.mode,
		});
		setContextOpened(false);
	}

	function onTabAdsClick() {
		if (activeTab === TAB_ADS) {
			setContextOpened(!contextOpened);
		}
		setTab(TAB_ADS);
	}

	function onTabNotsClick() {
		setTab(TAB_NOTIFICATIONS);
		console.log('onTabNotsClick');
		setContextOpened(false);
	}

	return (
		<React.Fragment>
			<PanelHeader left={<PanelHeaderButton />} separator={false}>
				<Tabs>
					<TabsItem
						onClick={onTabAdsClick}
						selected={activeTab === TAB_ADS}
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
						{mode == MODE_ALL ? 'Все' : mode == MODE_WANTED ? 'Хочу забрать' : 'Отдаю'}
					</TabsItem>
					<TabsItem
						// label={props.notsCounter == 0 ? null : props.notsCounter}
						onClick={onTabNotsClick}
						selected={activeTab === TAB_NOTIFICATIONS}
					>
						<TabbarItem label={props.notsCounter == 0 ? null : props.notsCounter}>
							<Icon28Notifications />
						</TabbarItem>
					</TabsItem>
				</Tabs>
			</PanelHeader>
			<PanelHeaderContext
				opened={contextOpened}
				onClose={() => {
					setContextOpened(false);
				}}
			>
				<List>
					<Cell
						before={<Icon28LiveOutline />}
						asideContent={mode === MODE_ALL ? <Icon24Done fill="var(--accent)" /> : null}
						onClick={select}
						key={MODE_ALL}
						data-mode={MODE_ALL}
					>
						Все
					</Cell>
					<Cell
						before={<Icon28UserCircleOutline />}
						asideContent={mode === MODE_GIVEN ? <Icon24Done fill="var(--accent)" /> : null}
						onClick={select}
						key={MODE_GIVEN}
						data-mode={MODE_GIVEN}
					>
						Отдаю
					</Cell>
					<Cell
						before={<Icon28CubeBoxOutline />}
						asideContent={mode === { MODE_WANTED } ? <Icon24Done fill="var(--accent)" /> : null}
						onClick={select}
						key={MODE_WANTED}
						data-mode={MODE_WANTED}
					>
						Хочу забрать
					</Cell>
				</List>
			</PanelHeaderContext>
			{activeComponent}
		</React.Fragment>
	);
};

const mapStateToProps = (state) => {
	return {
		inputData: state.formData.forms,
		activeTabs: state.router.activeTabs,
		activeStory: state.router.activeStory,
	};
};

const mapDispatchToProps = {
	setFormData,
	setTab,
	openModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddsTabs);

// 184
