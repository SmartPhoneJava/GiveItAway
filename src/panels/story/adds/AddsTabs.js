import React, { useState } from 'react';
import { PanelHeaderSimple, List, Cell, PanelHeaderButton, PanelHeaderContext, TabsItem, Tabs } from '@vkontakte/vkui';

import Icon28LiveOutline from '@vkontakte/icons/dist/28/live_outline';
import Icon28UserCircleOutline from '@vkontakte/icons/dist/28/user_circle_outline';

import Icon24Done from '@vkontakte/icons/dist/24/done';
import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';

import AddsTab from './tabs/adds/AddsTab';

const tabAdds = 'adds';
const tabAddsText = 'Объявления';

const tabNotification = 'notification';
const tabNotificationText = 'Уведомления';

const AddsTabs = props => {
	const [contextOpened, setContextOpened] = useState(false);
	const [mode, setmode] = useState('all');
	const [activeTab, setActiveTab] = useState(tabAdds);

	function select(e) {
		setmode(e.currentTarget.dataset.mode);
		setContextOpened(false);
	}

	return (
		<React.Fragment>
			<PanelHeaderSimple left={<PanelHeaderButton />} separator={false}>
				<Tabs>
					<TabsItem
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
									transition: '0.3s',
									transform: `rotate(${contextOpened ? '180deg' : '0'})`,
								}}
							/>
						}
					>
						{tabAddsText}
					</TabsItem>
					<TabsItem
						onClick={() => {
							setActiveTab(tabNotification);
							setContextOpened(false);
						}}
						selected={activeTab === tabNotification}
					>
						{tabNotificationText}
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
						Мои
					</Cell>
				</List>
			</PanelHeaderContext>
			<AddsTab
				openAd={props.openAd}
				dropFilters={props.dropFilters}
				category={props.category}
				mode={mode}

				city={props.city}
				region={props.region}
				country={props.country}
				
				refresh={props.refresh}
				setPopout={props.setPopout}
				onFiltersClick={props.onFiltersClick}
				setSnackbar={props.setSnackbar}
			></AddsTab>
		</React.Fragment>
	);
};

export default AddsTabs;
