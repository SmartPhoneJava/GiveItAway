import React, { useState, useEffect } from 'react';
import {
	PanelHeader,
	PanelHeaderBack,
	Footer,
	Link,
	Group,
	SimpleCell,
	InfoRow,
	Banner,
	Title,
	Div,
	Cell,
} from '@vkontakte/vkui';

const background = 'https://giveitaway.ru/img/backgrounds/1_dark.jpg'

import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';

import { connect } from 'react-redux';
import { goBack } from '../store/router/actions';
import { Collapse } from 'react-collapse';

const width = document.body.clientWidth;
const FAQPanel = (props) => {
	const { goBack } = props;

	const QuestionsGroupHeader = (props) => {
		const { header, subheader } = props;
		return (
			<Banner
				mode="image"
				size="m"
				header={<span>{header}</span>}
				subheader={subheader}
				background={
					<div
						className="faq"
						style={{
							backgroundImage: 'url(' + background + ')',
							backgroundSize: width,
						}}
					/>
				}
				asideMode="third"
			/>
		);
	};

	const Question = (props) => {
		const { header, answers } = props;
		const [isOpened, setIsOpened] = useState(false);
		return (
			<Group
				header={
					<Cell
						style={{ cursor: 'pointer' }}
						multiline
						onClick={() => {
							setIsOpened((prev) => !prev);
						}}
						asideContent={
							<Icon16Dropdown
								fill="var(--accent)"
								style={{
									marginLeft: '15px',
									transition: '0.3s',
									transform: `rotate(${isOpened ? '180deg' : '0'})`,
								}}
							/>
						}
					>
						<Title level="2" weight="heavy">
							{header}
						</Title>
					</Cell>
				}
			>
				<Collapse isOpened={isOpened}>{answers}</Collapse>
			</Group>
		);
	};

	const Answer = (props) => {
		const { header, text } = props;
		return (
			<SimpleCell multiline>
				<InfoRow header={header}>{text}</InfoRow>
			</SimpleCell>
		);
	};

	return (
		<>
			<PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
				<p className="panel-header">Ответы на вопросы</p>
				{/* {choosen ? <p className="panel-header">{choosen.header}</p> : 'Произошла ошибка'} */}
			</PanelHeader>
			<QuestionsGroupHeader
				header="Карма"
				subheader="получай карму, отдавая ненужное · трать для получения необходимого"
			/>
			<Question
				header="Зачем нужна Карма?"
				answers={[
					<Answer
						key="1"
						header={`Для справедливости`}
						text={`Чем больше спрос на твои вещи, тем больше получаешь за них Кармы от участников. Трать карму,
						получая вещи от других людей.`}
					/>,
					<Answer
						key="2"
						header={`Для оценки`}
						text={`Отдающий может отдать вещь именно Тебе, увидев, как много вещей Ты подарил другим.`}
					/>,
				]}
			/>
			<Question
				header="Как узнать, сколько у меня Кармы?"
				answers={
					<Answer
						header={`Перейди в профиль`}
						text={`Посмотреть баланс Кармы можно в профиле. Жирное чёрное число обозначает Карму, которую можно
						использовать прямо сейчас. Ниже приведены числа серого цвета. Сверху карма, которая «заморожена»
						в лотах. Посередине карма, которая была получена за все время. А внизу карма, потраченная за
						все время. Чтобы перейти в профиль, нажми на иконку в правом нижнем углу экрана.`}
					/>
				}
			/>
			<Question
				header="Как повысить Карму?"
				answers={[
					<Answer
						key="1"
						header={`Отдавай вещи`}
						text={
							<>
								Количество получаемой кармы зависит от типа объявления. Если выбрать <i>сделку</i> или{' '}
								<i>лотерею</i>, то за передачу вещи ты получишь столько кармы, сколько человек
								откликнулось на объявление. Если же тип объявления <i>аукцион</i>, то при передачи вещи
								ты получишь число кармы, равное максимальной ставки аукциона.
							</>
						}
					/>,
					<Answer
						key="2"
						text={`Начисление кармы происходит в тот момент, когда оба участника сделки подтвердят, что вещь
							передана.`}
					/>,
				]}
			/>
			<QuestionsGroupHeader header="Отдающим вещи" subheader="помощь тем, кто хочет отдать вещи" />
			<Question
				header="Как создать объявление?"
				answers={
					<Answer
						text={`Чтобы добавить объявление, нажми на иконку плюсика в центральной нижней части приложения. Выбери
				категорию, добавь снимков, название и описание. Укажи тип объявления и как пользователи могут
				связаться с тобой. Следуй правилам, описанным в лицензионном соглашении. Важно: честно описывай
				нюансы вещи, какую хочешь отдать.`}
					/>
				}
			/>
			<Question
				header="Какие виды объявлений существуют?"
				answers={[
					<Answer
						key="1"
						header={`Сделка`}
						text={
							<>
								Ты сам выбираешь, кому подарить вещь. После передачи ты получишь столько кармы, сколько
								человек откликнулось.
							</>
						}
					/>,
					<Answer
						key="2"
						header={`Лотерея`}
						text={
							<>
								При нажатии <i>Отдать</i> получатель выбирается среди откликвнушихся случайным образом.
								Принцип начисления кармы тот же, что и в сделке.
							</>
						}
					/>,
					<Answer
						key="3"
						header={`Аукцион`}
						text={
							<>
								Каждый пользователь, откликаясь на объявление, делает ставку, большую максимальной на 1
								Карму. Когда ты нажмаешь <i>Отдать</i> получателем будет выбран тот, кто предложит
								наибольшую ставку. Дальнейшее ее повышение станет невозможным. После передачи вещи вы
								получите столько кармы, сколько предлагал получатель.
							</>
						}
					/>,
				]}
			/>
			<Question
				header="Как определяется местоположение объявления при создании?"
				answers={[
					<Answer
						key="1"
						header={`Автоматически`}
						text={`Если у тебя разрешен доступ к геолокации, то система автоматически определяет её при создании
						объявления.`}
					/>,
					<Answer
						key="2"
						header={`Вручную`}
						text={`Если доступ к геолокации не предоставлен, то текущим местоположением объявления становится центр
						города, который указан в вашем профиле ВКонтакте. Геоположение лота можно также указать вручную,
						если это необходимо. Изменить это значение после того, как объявление будет создано, невозможно.`}
					/>,
				]}
			/>
			<Question
				header="Могут ли другие пользователи, узнать мое точное местоположение?"
				answers={
					<Answer
						header={`нет`}
						text={`Участникам сервиса доступно только примерное местоположение объявления. Точное месторасположение
					не разглашается. Вместо конкретной точки на карте, другие пользователи увидят область радиусом
					200 метров.`}
					/>
				}
			/>
			<Question
				header="Как подтвердить, что вещь передана?"
				answers={
					<Answer
						header={`Выбрите получателя`}
						text={
							<>
								Зайди в свое объявление, нажми на кнопку <i>отдать</i>. Если объявление является{' '}
								<i>лотереей</i> или <i>аукционом</i>, то этого достаточно. Если же данное объявление
								является <i>сделкой</i>, то ты окажешься в панели выбора получателя. Найди и нажми по
								пользователю, которому ты отдал(или собираешься отдать) вещь. После чего нажми{' '}
								<i>выбрать</i>.
							</>
						}
					/>
				}
			/>
			<Question
				header="Как связаться с потенциальными получателями?"
				answers={
					<Answer
						header={`Написать им в панели откликнувшихся`}
						text={
							<>
								Перейди на страницу объявления. Над панелью действий и комментариев находится панель{' '}
								<i>Откликнулись</i>. В правой части есть кнопка <i>Показать всех</i>, нажми ее.
								Откроется список откликвнушихся. Выбирай нужного пользователя, кликай по его имени и жми{' '}
								<i>Написать</i>, чтобы перейти в личные сообщения с этим пользователем ВКонтакте.{' '}
							</>
						}
					/>
				}
			/>
			<Question
				header="Получатель вещи не выходит на связь или не хочет принимать вещь. Что делать?"
				answers={
					<Answer
						header={`Отмени запрос`}
						text={
							<>
								Перейди в объявление и нажми на кнопку <i>Изменить получателя</i>. Она находится под
								снимками вещи. В графе <i>Получатель</i> указан выбранный тобой пользователь. Нажми по
								крестику справа от его имени и он потеряет статус получающего и станет одним из
								откликнувшихся. Не забудь написать ему в ЛС о своем решении, может быть он одумается!
							</>
						}
					/>
				}
			/>
			<Question
				header="Я передумал отдавать вещь. Что делать?"
				answers={
					<Answer
						header={`Удали объявление`}
						text={
							<>
								Перейди в объявление. В самом низу находятся кнопки действий, справа находится красная
								кнопка <i>Удалить</i>. Нажмите на нее, если вы <b>уверены</b>, что не хотите отдавать
								вещь, отменить данное действие будет <b>невозможно</b>.
							</>
						}
					/>
				}
			/>
			<QuestionsGroupHeader header="Получающим вещи" subheader="помощь тем, кто хочет получить вещи" />
			<Question
				header="Как подтвердить, что вещь получена?"
				answers={
					<Answer
						text={
							<>
								Свяжись с автором и убедись, что он выбрал тебя в качестве получателя. После чего зайди
								в уведомления. Для этого перейди во вкладку <i>Объявления</i> и нажми на иконку
								колокольчика в верхней части приложения. После чего найди уведомление, предлагающее
								подтвердить получение вещи. Нажав по нему, тебя перенесет в объявление. В верхней части
								будет предложение подтвердить получение вещи. Если ты <b>уже получил</b> вещь, то смело
								нажимай <i>Подтвердить</i>.{' '}
							</>
						}
					/>
				}
			/>
			<Question
				header="Как связаться с автором объявления?"
				answers={
					<Answer
						text={
							<>
								Перейди на страницу объявления. Аватарка и фио автора указыватся под описанием и
								местоположением лота. Чтобы написать ему, нажми <i>Написать</i>. Эта кнопка находится
								правее его имени. Чтобы посмотреть статистику автора, нажми по его имени. Здесь также
								есть кнопка <i>Написать</i>. А ещё ты можешь кликнуть по аватарке человека, чтобы
								посмотреть его страницу в ВКонтакте{' '}
							</>
						}
					/>
				}
			/>
			<Question
				header="Автор объявления не отвечает или не хочет отдавать вещь. Что делать?"
				answers={
					<Answer
						text={
							<>
								Откажись от лота, чтобы разморозить Карму. Хорошая новость — ты ничего не потеряешь. Для
								этого перейди в объявление и нажми на большую красную кнопку <i>Отказаться</i>{' '}
							</>
						}
					/>
				}
			/>
			<Question
				header="Как узнать, где размещено объявление?"
				answers={
					<Answer
						text={`Перейди в объявление. Под описанием рядом с иконкой геопозиции указывается страна и город, в
						котором было размещено объявление. Кликни по этой надписи и откроется карта с розовым кругом.
						200-метровый розовый круг - примерное местоположение объявление. Для того, чтобы узнать более
						точный адрес, свяжись с отдающим.`}
					/>
				}
			/>

			<Footer>
				<Link style={{ cursor: 'pointer' }} href="https://vk.com/topic-194671970_41809783" target="_blank">
					Не нашли ответа на свой вопрос?
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

// 358 -> 373
