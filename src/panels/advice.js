import React from 'react';
import { PanelHeader, PanelHeaderBack, Footer, Link, Group, SimpleCell, InfoRow, Title, Div } from '@vkontakte/vkui';

import { connect } from 'react-redux';
import { goBack } from '../store/router/actions';

const AdvicePanel = (props) => {
	const { goBack } = props;
	return (
		<>
			<PanelHeader left={<PanelHeaderBack style={{ cursor: 'pointer' }} onClick={goBack} />}>
				<p className="panel-header">Полезные советы</p>
				{/* {choosen ? <p className="panel-header">{choosen.header}</p> : 'Произошла ошибка'} */}
			</PanelHeader>

			<Group
				header={
					<Div>
						<Title level="2" weight="heavy">
							Что отдавать?
						</Title>
					</Div>
				}
			>
				<SimpleCell multiline>
					<InfoRow>Отдавай все, что не приносит тебе радость прямо сейчас — не храни лишнее.</InfoRow>
				</SimpleCell>
				<SimpleCell multiline>
					<InfoRow>Отдавай вещи, которые могут быть полезны другим.</InfoRow>
				</SimpleCell>
				<SimpleCell multiline>
					<InfoRow>Отдавай хорошие вещи, за которыми есть смысл приезжать — уважай других.</InfoRow>
				</SimpleCell>
			</Group>
			<Group
				header={
					<Div>
						<Title level="2" weight="heavy">
							Как лучше отдавать?
						</Title>
					</Div>
				}
			>
				<SimpleCell multiline>
					<InfoRow>Фотографируй лоты красиво. Используй светлый фон и снимай в освещенном месте.</InfoRow>
				</SimpleCell>
				<SimpleCell multiline>
					<InfoRow>Пиши о дефектах и состоянии вещей честно.</InfoRow>
				</SimpleCell>
				<SimpleCell multiline>
					<InfoRow>Указывай размер, если отдаешь одежду или обувь.</InfoRow>
				</SimpleCell>
			</Group>
			<Group
				header={
					<Div>
						<Title level="2" weight="heavy">
							Как лучше искать?
						</Title>
					</Div>
				}
			>
				<SimpleCell multiline>
					<InfoRow>
						Используй фильтры при поиске, чтобы искать интересуемые категории вещей, предлагамаемые
						поблизости.
					</InfoRow>
				</SimpleCell>
				<SimpleCell multiline>
					<InfoRow>
						Используй поле поиска. Мы будем искать введеный текст среди названий и описаний лота и
						обязательно найдём то, что тебе нужно!
					</InfoRow>
				</SimpleCell>
				<SimpleCell multiline>
					<InfoRow>
						Выбирай сортировку по расстоянию, если тебе очень важно, чтобы интересуемые вещи, как можно
						ближе. А чтобы увидеть наиболее свежие предложения, переключайся на сортировку во времени.
					</InfoRow>
				</SimpleCell>
			</Group>
			<Group
				header={
					<Div>
						<Title level="2" weight="heavy">
							Как лучше выбирать?
						</Title>
					</Div>
				}
			>
				<SimpleCell multiline>
					<InfoRow>
						Подписывайся только на то, что точно хочешь и можешь забрать. Не надо откликаться на всё подряд.
					</InfoRow>
				</SimpleCell>
				<SimpleCell multiline>
					<InfoRow>Нажми на местоположение объявления, чтобы посмотреть, где примерно его забирать.</InfoRow>
				</SimpleCell>
				<SimpleCell multiline>
					<InfoRow>
						Свяжись с автором, чтобы задать вопросы по искомой вещи. Отпишись от объявления, если
						предлагаемая вещь или условия передачи тебя чем то не устраивают.
					</InfoRow>
				</SimpleCell>
				<SimpleCell multiline>
					<InfoRow>Откажись от объявления, если предлагаемая в нём вещь тебе уже не нужна.</InfoRow>
				</SimpleCell>
				<SimpleCell multiline>
					<InfoRow>
						Используй комментарии для общения с другими участниками. Обсуждай вещи, связанные с данным
						объявлением, но не стоит флудить или провоцировать других пользователей отписаться от
						объявления.
					</InfoRow>
				</SimpleCell>
				<SimpleCell multiline>
					<InfoRow>
						Если информация, предоставляемая в описании или на снимках кажется тебе не полной или
						недостоверной, напиши об этом автору, чтобы он мог дополнить или исправить ее.
					</InfoRow>
				</SimpleCell>
				<SimpleCell multiline>
					<InfoRow>
						Если подозреваешь, что автор пытается обмануть тебя, смело нажимай <i>Пожаловаться</i>. Опишите
						суть проблемы и мы решим ее. Не стоит участвовать в сделках с людьми, которые не вызывают у тебя
						доверия.
					</InfoRow>
				</SimpleCell>
			</Group>
			<Group
				header={
					<Div>
						<Title level="2" weight="heavy">
							Как лучше забирать?
						</Title>
					</Div>
				}
			>
				<SimpleCell multiline>
					<InfoRow>
						Узнай где и когда забрать лот как только получил предложение подтвердить получения вещи.
						Откажись от него сразу, если не можешь забрать или передумал — уважай других участников.
					</InfoRow>
				</SimpleCell>
				<SimpleCell multiline>
					<InfoRow>Не забудь улыбнуться и поблагодарить при встрече.</InfoRow>
				</SimpleCell>
				<SimpleCell multiline>
					<InfoRow>
						Если автор долгое время не выходит на связь, отказывайся от вещи. Хорошая новость — вся Карма
						вернется назад.
					</InfoRow>
				</SimpleCell>
				<SimpleCell multiline>
					<InfoRow>Всегда подтверждай получение вещи в объявлении как только его забрал</InfoRow>
				</SimpleCell>
			</Group>
			<Group
				header={
					<Div>
						<Title level="2" weight="heavy">
							Что делать, если что то пошло не так?
						</Title>
					</Div>
				}
			>
				<SimpleCell multiline>
					<InfoRow>
						Относись терпимо, не расстраивайся по мелочам. Мир не идеален. Мы не идеальны. Но мы работаем
						над улучшением каждый день, чтобы даже самые необязательные люди, которые не умеют ценить чужое
						время и труд вели себя в нем хорошо.
					</InfoRow>
				</SimpleCell>
				<SimpleCell multiline>
					<InfoRow>Напиши нам все детали — мы постараемся помочь. </InfoRow>
				</SimpleCell>
			</Group>

			<Footer>
				<Link style={{ cursor: 'pointer' }} href="https://vk.com/public194671970" target="_blank">
					Перейти в наше сообщество
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

export default connect(mapStateToProps, mapDispatchToProps)(AdvicePanel);
