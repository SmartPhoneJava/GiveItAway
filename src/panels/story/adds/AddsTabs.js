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
	PanelHeaderContent,
} from '@vkontakte/vkui';

import Icon28CubeBoxOutline from '@vkontakte/icons/dist/28/cube_box_outline';

import Icon28LiveOutline from '@vkontakte/icons/dist/28/live_outline';
import Icon28UserCircleOutline from '@vkontakte/icons/dist/28/user_circle_outline';

import Icon24Done from '@vkontakte/icons/dist/24/done';
import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';

import AddsTab from './tabs/adds/AddsTab';
import { setFormData } from '../../../store/create_post/actions';
import { ADS_FILTERS } from '../../../store/create_post/types';
import { TAB_ADS, TAB_NOTIFICATIONS, MODE_ALL, MODE_WANTED, MODE_GIVEN } from '../../../const/ads';
import { setTab, openModal, updateContext, goBack } from '../../../store/router/actions';
import { MODAL_ADS_FILTERS, MODAL_ADS_SUBS } from '../../../store/router/modalTypes';
import { scrollWindow } from '../../../App';

const AddsTabs = (props) => {
	const { setFormData, setTab, openModal, updateContext, goBack } = props;
	const { inputData, activeTabs, activeStory } = props;
	const mode = (inputData[activeStory + ADS_FILTERS] ? inputData[activeStory + ADS_FILTERS].mode : null) || MODE_ALL;
	const activeTab = activeTabs[activeStory] || TAB_ADS;
	const [contextOpened, setContextOpenedR] = useState(false);

	// Обработка хардверного нажатия назад
	useEffect(() => {
		updateContext({
			goBack: () => {
				if (contextOpened) {
					setContextOpened(false);
				} else {
					goBack();
				}
			},
		});
	}, [contextOpened]);

	function setContextOpened(value) {
		updateContext({ contextOpened: value });
		setContextOpenedR(value);
	}

	useEffect(() => {
		const listener = function () {
			setContextOpened(false);
		};
		window.addEventListener('scroll', listener);
		return () => {
			window.removeEventListener('scroll', listener);
		};
	}, []);

	function select(e) {
		props.dropFilters();
		setFormData(activeStory + ADS_FILTERS, {
			...inputData,
			mode: e.currentTarget.dataset.mode,
		});
		setContextOpened(false);
		scrollWindow(0);
	}

	function onTabAdsClick() {
		if (activeTab === TAB_ADS) {
			setContextOpened(!contextOpened);
		}
		setTab(TAB_ADS);
	}

	return (
		<React.Fragment>
			<PanelHeader left={<PanelHeaderButton />}>
				<PanelHeaderContent
					style={{ cursor: 'pointer' }}
					aside={
						<Icon16Dropdown
							fill="var(--accent)"
							style={{
								marginLeft: '15px',
								transition: '0.3s',
								transform: `rotate(${contextOpened ? '180deg' : '0'})`,
							}}
						/>
					}
					onClick={onTabAdsClick}
				>
					{mode == MODE_ALL ? 'Все' : mode == MODE_WANTED ? 'Хочу забрать' : 'Отдаю'}
				</PanelHeaderContent>
				{/* <Tabs>
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
				</Tabs> */}
			</PanelHeader>
			<PanelHeaderContext
				opened={contextOpened}
				onClose={() => {
					setContextOpened(false);
				}}
			>
				<List>
					<Cell
						style={{ cursor: 'pointer' }}
						before={<Icon28LiveOutline />}
						asideContent={mode === MODE_ALL ? <Icon24Done fill="var(--accent)" /> : null}
						onClick={select}
						key={MODE_ALL}
						data-mode={MODE_ALL}
					>
						Все
					</Cell>
					<Cell
						style={{ cursor: 'pointer' }}
						before={<Icon28UserCircleOutline />}
						asideContent={mode === MODE_GIVEN ? <Icon24Done fill="var(--accent)" /> : null}
						onClick={select}
						key={MODE_GIVEN}
						data-mode={MODE_GIVEN}
					>
						Отдаю
					</Cell>
					<Cell
						style={{ cursor: 'pointer' }}
						before={<Icon28CubeBoxOutline />}
						asideContent={mode === MODE_WANTED ? <Icon24Done fill="var(--accent)" /> : null}
						onClick={select}
						key={MODE_WANTED}
						data-mode={MODE_WANTED}
					>
						Хочу забрать
					</Cell>
				</List>
			</PanelHeaderContext>
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
	updateContext,
	goBack,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddsTabs);

// 184
