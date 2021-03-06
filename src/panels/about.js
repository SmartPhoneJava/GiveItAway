import React, { useState, useEffect } from 'react';
import { PanelHeader, PanelHeaderBack, Cell, Group, Header } from '@vkontakte/vkui';

import { PANEL_FAQ, PANEL_ADVICES, PANEL_LICENCE } from '../store/router/panelTypes';

import { connect } from 'react-redux';
import { goBack, setPage } from '../store/router/actions';

import Icon28MessagesOutline from '@vkontakte/icons/dist/28/messages_outline';
import Icon28ArticleOutline from '@vkontakte/icons/dist/28/article_outline';
import Icon28InfoOutline from '@vkontakte/icons/dist/28/info_outline';
import Icon28MoneyCircleOutline from '@vkontakte/icons/dist/28/money_circle_outline';
import Icon28Users3Outline from '@vkontakte/icons/dist/28/users_3_outline';
import Icon28HelpOutline from '@vkontakte/icons/dist/28/help_outline';

import Icon24ShareExternal from '@vkontakte/icons/dist/24/share_external';
import Icon24Newsfeed from '@vkontakte/icons/dist/24/newsfeed';
import Icon24StoryOutline from '@vkontakte/icons/dist/24/story_outline';

import { shareApp, postApp, postStoryApp } from '../services/VK';
import { openTab } from '../services/_functions';

const AboutPanel = (props) => {
	const { goBack, setPage } = props;
	return (
		<>
			<PanelHeader left={<PanelHeaderBack style={{ cursor: 'pointer' }} onClick={goBack} />}>
				<p className="panel-header">О сервисе</p>
				{/* {choosen ? <p className="panel-header">{choosen.header}</p> : 'Произошла ошибка'} */}
			</PanelHeader>

			<Group header={<Header mode="secondary"> Общая информация </Header>}>
				<Cell
					style={{ cursor: 'pointer' }}
					expandable
					before={<Icon28HelpOutline />}
					onClick={() => {
						setPage(PANEL_FAQ);
					}}
					description="Как пользоваться сервисом"
				>
					Ответы на вопросы
				</Cell>
				<Cell
					style={{ cursor: 'pointer' }}
					expandable
					before={<Icon28InfoOutline />}
					onClick={() => {
						setPage(PANEL_ADVICES);
					}}
					description="Как отдавать и получать"
				>
					Полезные советы
				</Cell>
				<Cell
					style={{ cursor: 'pointer' }}
					expandable
					before={<Icon28ArticleOutline />}
					description="Пользовательское соглашение"
					onClick={() => {
						setPage(PANEL_LICENCE);
					}}
				>
					Условия использования
				</Cell>
			</Group>
			<Group header={<Header mode="secondary"> Обратная связь </Header>}>
				<Cell
					style={{ cursor: 'pointer' }}
					expandable
					before={<Icon28Users3Outline />}
					onClick={() => {
						openTab('https://vk.com/public194671970');
					}}
					description="Наша группа ВКонтакте"
				>
					Официальное сообщество
				</Cell>
				<Cell
					style={{ cursor: 'pointer' }}
					expandable
					before={<Icon28MessagesOutline />}
					onClick={() => {
						openTab('https://vk.com/im?sel=-194671970');
					}}
					description="Любые вопросы, жалобы и предложения"
				>
					Написать разработчикам
				</Cell>
				<Cell
					style={{ cursor: 'pointer' }}
					expandable
					before={<Icon28MoneyCircleOutline />}
					onClick={() => {
						openTab('https://vk.com/public194671970?w=app5727453_-194671970');
					}}
					description="Пожертвовать на развитие сервиса"
				>
					Поддержать проект
				</Cell>
			</Group>
			<Group header={<Header mode="secondary"> Поделиться с друзьями </Header>}>
				<Cell
					style={{ cursor: 'pointer' }}
					multiline
					expandable
					before={<Icon24ShareExternal />}
					onClick={shareApp}
					description="Рассказать друзьям, опубликовать в сообществе или отправить сообщением другу"
				>
					Поделиться ссылкой на сервис
				</Cell>
				<Cell
					style={{ cursor: 'pointer' }}
					multiline
					expandable
					before={<Icon24Newsfeed />}
					onClick={postApp}
					description="Добавить запись с кратким описанием сервиса у себя на стене"
				>
					Создать запись на стене
				</Cell>
				{props.platform != 'mobile_web' && (
					<Cell
						style={{ cursor: 'pointer' }}
						multiline
						expandable
						before={<Icon24StoryOutline />}
						onClick={postStoryApp}
						description="Поделиться историей с друзьями!"
					>
						Опубликовать историю
					</Cell>
				)}
			</Group>
		</>
	);
};

const mapStateToProps = (state) => {
	return {
		platform: state.vkui.platform,
	};
};

const mapDispatchToProps = {
	goBack,
	setPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(AboutPanel);
