import React, { useState, useEffect } from 'react';
import { PanelHeader, PanelHeaderBack, Footer, Link, Group, SimpleCell, InfoRow, Banner, Title } from '@vkontakte/vkui';

import background from './../img/backgrounds/1_dark.jpg';

import { connect } from 'react-redux';
import { goBack } from '../store/router/actions';

const width = document.body.clientWidth;
const FAQPanel = (props) => {
	const { goBack } = props;
	return (
		<>
			<PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
				<p className="panel-header">Ответы на вопросы</p>
				{/* {choosen ? <p className="panel-header">{choosen.header}</p> : 'Произошла ошибка'} */}
			</PanelHeader>

			<Banner
				mode="image"
				size="m"
				header={<span>Карма</span>}
				subheader="получай карму, отдавая ненужное · трать для получения необходимого"
				background={
					<div
						style={{
							backgroundImage: 'url(' + background + ')',
							backgroundPosition: 'right bottom',
							backgroundSize: width,
							backgroundRepeat: 'no-repeat',
						}}
					/>
				}
				asideMode="expand"
			/>
			<Group
				header={
					<Title level="2" weight="heavy" style={{ paddingLeft: 16, paddingRight: 16, fontSize: 16 }}>
						Зачем нужна Карма?
					</Title>
				}
			>
				<SimpleCell multiline>
					<InfoRow header="Для справедливости">
						Чем больше спрос на ваши вещи, тем больше получаешь за них Кармы от участников. Трать карму,
						получая вещи от других людей.
					</InfoRow>
				</SimpleCell>
				<SimpleCell multiline>
					<InfoRow header="Для оценки">
						Отдающий может отдать вещь именно Тебе, увидев, как много вещей Ты подарил другим.
					</InfoRow>
				</SimpleCell>
			</Group>
			<Group
				header={
					<Title level="2" weight="heavy" style={{ paddingLeft: 16, paddingRight: 16, fontSize: 16 }}>
						Как узнать сколько у меня Кармы?
					</Title>
				}
			>
				<SimpleCell multiline>
					<InfoRow header="Перейди в профиль">
						Посмотреть баланс Кармы можно в профиле. Жирное чёрное число обозначает Карму, которую можно
						использовать прямо сейчас. Ниже приведены числа серого цвета. Сверху карма, которая «заморожена»
						в лотах. По середине карма, которая была получена за все время. А внизу карма, потраченная за
						все время. Чтобы перейти в профиль, нажми на иконку в правом нижнем углу экрана.
					</InfoRow>
				</SimpleCell>
			</Group>
			<Group
				header={
					<Title level="2" weight="heavy" style={{ paddingLeft: 16, paddingRight: 16, fontSize: 16 }}>
						Как повысить Карму?
					</Title>
				}
			>
				<SimpleCell multiline>
					<InfoRow header="Отдавай вещи">
						Количество получаемой кармы зависит от типа объявления: <i>сделка</i>, <i>лотерея</i>,{' '}
						<i>аукцион</i>. Если выбрать <i>сделку</i> или <i>лотерею</i>, то за передачу вещи ты получишь
						столько кармы, сколько человек откликнулось на объявление. Если же тип объявления <i>аукцион</i>
						, то при передачи вещи ты получишь число кармы, равное максимальной ставки аукциона.{' '}
					</InfoRow>
				</SimpleCell>
				<SimpleCell multiline>
					<InfoRow>
						Начисление кармы происходит в тот момент, когда оба участника сделки подтвердят, что вещь
						передана.
					</InfoRow>
				</SimpleCell>
			</Group>
			<Banner
				mode="image"
				size="m"
				subheader="помощь тем, кто хочет отдать вещи"
				header={<span>Отдающим вещи</span>}
				background={
					<div
						style={{
							backgroundImage: 'url(' + background + ')',
							backgroundPosition: 'right bottom',
							backgroundSize: width,
							backgroundRepeat: 'no-repeat',
						}}
					/>
				}
				asideMode="expand"
			/>
			<Group
				header={
					<Title level="2" weight="heavy" style={{ paddingLeft: 16, paddingRight: 16, fontSize: 16 }}>
						Как создать объявление?
					</Title>
				}
			>
				<SimpleCell multiline>
					<InfoRow>
						Чтобы добавить объявление, нажми на иконку плюсика в центральной нижней части приложения. Выбери
						категорию, добавь снимков, название и описание. Укажи тип объявления и как пользователи могут
						связаться с тобой. Следуй правилам, описанным в лицензионном соглашении. Важно: честно описывай
						нюансы вещи, какую хочешь отдать.
					</InfoRow>
				</SimpleCell>
			</Group>
			<Group
				header={
					<Title level="2" weight="heavy" style={{ paddingLeft: 16, paddingRight: 16, fontSize: 16 }}>
						Какие виды объявлений существуют?
					</Title>
				}
			>
				<SimpleCell multiline>
					<InfoRow header="Сделка">
						Ты сам выбираешь, кому подарить вещь. После передачи, ты получишь столько кармы, сколько человек
						откликнулось.
					</InfoRow>
				</SimpleCell>
				<SimpleCell multiline>
					<InfoRow header="Лотерея">
						При нажатии <i>Отдать</i> получатель выбирается среди откливнушихся случайным образом. Принцип
						начисления кармы тот же, что и в сделке.
					</InfoRow>
				</SimpleCell>
				<SimpleCell multiline>
					<InfoRow header="Аукцион">
						Каждый пользователь, откликаясь на объявление, делает ставку, большую максимальной на 1 Карму.
						Когда ты нажмаешь <i>Отдать</i> получателем будет выбран тот, кто предложит наибольшую ставку.
						Дальнейшее ее повышение станет невозможным. После передачи вещи вы получите столько кармы,
						сколько предлагал получатель.
					</InfoRow>
				</SimpleCell>
			</Group>
			<Group
				header={
					<Title level="2" weight="heavy" style={{ paddingLeft: 16, paddingRight: 16, fontSize: 16 }}>
						Как определяется местоположение объявления при создании?
					</Title>
				}
			>
				<SimpleCell multiline>
					<InfoRow header="Автоматически">
						Если у тебя разрешен доступ к геолокации, то система автоматически определяет её при создании
						объявления.
					</InfoRow>
				</SimpleCell>
				<SimpleCell multiline>
					<InfoRow header="Вручную">
						Если доступ к геолокации не предоставлен, то текущим местоположением объявления становится центр
						города, который указан в вашем профиле ВКонтакте. Геоположение лота можно также указать вручную,
						если это необходимо. Изменить это значение после того, как объявление будет создано, невозможно.
					</InfoRow>
				</SimpleCell>
			</Group>
			<Group
				header={
					<Title level="2" weight="heavy" style={{ paddingLeft: 16, paddingRight: 16, fontSize: 16 }}>
						Могут ли другие пользователи, узнать мое точное местоположение?
					</Title>
				}
			>
				<SimpleCell multiline>
					<InfoRow header="Нет">
						Участникам сервиса доступно только примерное местоположение объявления. Точное месторасположение
						не разглашается. Вместо конкретной точки на карте, другие пользователи увидят область радиусом
						200 метров.
					</InfoRow>
				</SimpleCell>
			</Group>
			<Group
				header={
					<Title level="2" weight="heavy" style={{ paddingLeft: 16, paddingRight: 16, fontSize: 16 }}>
						Как подтвердить, что вещь передана?
					</Title>
				}
			>
				<SimpleCell multiline>
					<InfoRow header="Выбрите получателя">
						Зайди в свое объявление, нажми на кнопку <i>отдать</i>. Если объявление является <i>лотереей</i>{' '}
						или <i>аукционом</i>, то этого достаточно. Если же данное объявление является <i>сделкой</i>, то
						ты окажешься в панели выбора получателя. Найди и нажми по пользователю, которому ты отдал(или
						собираешься отдать) вещь. После чего нажми <i>выбрать</i>.
					</InfoRow>
				</SimpleCell>
			</Group>
			<Group
				header={
					<Title level="2" weight="heavy" style={{ paddingLeft: 16, paddingRight: 16, fontSize: 16 }}>
						Как связаться с потенциальными получателями?
					</Title>
				}
			>
				<SimpleCell multiline>
					<InfoRow header="Написать им в панели откликнувшихся">
						Перейди на страницу объявления. Над панелью действий и комментариев находится панель{' '}
						<i>Откликнулись</i>. В правой части есть кнопка <i>Показать всех</i>, нажми ее. Откроется список
						откливнушихся. Выбирай нужного пользователя, кликай по его имени и жми <i>Написать</i>, чтобы
						перейти в личные сообщения с этим пользователем ВКонтакте.{' '}
					</InfoRow>
				</SimpleCell>
			</Group>
			<Group
				header={
					<Title level="2" weight="heavy" style={{ paddingLeft: 16, paddingRight: 16, fontSize: 16 }}>
						Получатель вещи не выходит на связь или не хочет принимать вещь. Что делать?
					</Title>
				}
			>
				<SimpleCell multiline>
					<InfoRow header="Отмени запрос">
						Перейди в объявление и нажми на кнопку <i>Изменить получателя</i>. Она находится под снимками
						вещи. В графе <i>Получатель</i> указан выбранный тобой пользователь. Нажми по крестику справа от
						его имени и он потеряет статус получающего и станет одним из откликнувшихся. Не забудь написать
						ему в ЛС о своем решении, может быть он одумается!
					</InfoRow>
				</SimpleCell>
			</Group>
			<Group
				header={
					<Title level="2" weight="heavy" style={{ paddingLeft: 16, paddingRight: 16, fontSize: 16 }}>
						Я передумал отдавать вещь. Что делать?
					</Title>
				}
			>
				<SimpleCell multiline>
					<InfoRow header="Удали объявление">
						Перейди в объявление. В самом низу находятся кнопки действий, справа находится красная кнопка{' '}
						<i>Удалить</i>. Нажмите на нее, если вы <b>уверены</b>, что не хотите отдавать вещь, отменить
						данное действие будет <b>невозможно</b>.
					</InfoRow>
				</SimpleCell>
			</Group>
			<Banner
				mode="image"
				size="m"
				subheader="помощь тем, кто хочет получить вещи"
				header={<span>Получающим вещи</span>}
				background={
					<div
						style={{
							backgroundImage: 'url(' + background + ')',
							backgroundPosition: 'right bottom',
							backgroundSize: width,
							backgroundRepeat: 'no-repeat',
						}}
					/>
				}
				asideMode="expand"
			/>
			<Group
				header={
					<Title level="2" weight="heavy" style={{ paddingLeft: 16, paddingRight: 16, fontSize: 16 }}>
						Как подтвердить, что вещь получена?
					</Title>
				}
			>
				<SimpleCell multiline>
					<InfoRow>
						Свяжись с автором и убедись, что он выбрал тебя в качестве получателя. После чего зайди в
						уведомления. Для этого перейди во вкладку <i>Объявления</i> и нажми на иконку колокольчика в
						верхней части приложения. После чего найди уведомление, предлагающее подтвердить получение вещи.
						Нажав по нему, тебя перенесет в объявление. В верхней части будет предложение подтвердить
						получение вещи. Если ты <b>уже получил</b> вещь, то смело нажимай <i>Подтвердить</i>.{' '}
					</InfoRow>
				</SimpleCell>
			</Group>
			<Group
				header={
					<Title level="2" weight="heavy" style={{ paddingLeft: 16, paddingRight: 16, fontSize: 16 }}>
						Как связаться с автором объявления?
					</Title>
				}
			>
				<SimpleCell multiline>
					<InfoRow>
						Перейди на страницу объявления. Аватарка и фио автора указыватся под описанием и местоположением
						лота. Чтобы написать ему, нажми <i>Написать</i>. Эта кнопка находится правее его имени. Чтобы
						посмотреть статистику автора, нажми по его имени. Здесь также есть кнопка <i>Написать</i>. А ещё
						ты можешь кликнуть по аватарке человека, чтобы посмотреть его страницу в ВКонтакте{' '}
					</InfoRow>
				</SimpleCell>
			</Group>
			<Group
				header={
					<Title level="2" weight="heavy" style={{ paddingLeft: 16, paddingRight: 16, fontSize: 16 }}>
						Автор объявления не отвечает или не хочет отдавать вещь. Что делать?
					</Title>
				}
			>
				<SimpleCell multiline>
					<InfoRow>
						Откажись от лота, чтобы разморозить Карму. Хорошая новость — ты ничего не потеряешь. Для этого
						перейди в объявление и нажми на большую красную кнопку <i>Отказаться</i>{' '}
					</InfoRow>
				</SimpleCell>
			</Group>
			<Group
				header={
					<Title level="2" weight="heavy" style={{ paddingLeft: 16, paddingRight: 16, fontSize: 16 }}>
						Как узнать, где размещено объявление?
					</Title>
				}
			>
				<SimpleCell multiline>
					<InfoRow header="">
						Перейди в объявление. Под описанием рядом с иконкой геопозиции указывается страна и город, в
						котором было размещено объявление. Кликни по этой надписи и откроется карта с розовым кругом.
						200-метровый розовый круг - примерное местоположение объявление. Для того, чтобы узнать более
						точный адрес, свяжись с отдающим.
					</InfoRow>
				</SimpleCell>
			</Group>

			<Footer>
				<Link href="https://vk.com/topic-194671970_41809783" target="_blank">
					Остались вопросы?
				</Link>
			</Footer>
		</>
	);
};

const mapStateToProps = (state) => {
	return {};
};

const mapDispatchToProps = {
	goBack,
};

export default connect(mapStateToProps, mapDispatchToProps)(FAQPanel);
