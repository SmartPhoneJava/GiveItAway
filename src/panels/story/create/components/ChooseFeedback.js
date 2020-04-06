import React, { useState } from 'react';
import { Textarea, Radio, Group, Header, Avatar, Snackbar, FormLayout } from '@vkontakte/vkui';

import Icon24Favorite from '@vkontakte/icons/dist/24/favorite';

const ChooseFeedback = (props) => {
	const [ft, setFt] = useState('Личные сообщения');
	console.log('props.pmOpenprops.pmOpen', props.pmOpen);
	return (
		<Group separator="show" header={<Header mode="secondary">Тип фидбека</Header>}>
			<div>
				<Radio
					name="radio"
					value={ft}
					onClick={() => {
						if (props.pmOpen) {
							props.setFeedbackType('ls');
						} else {
							props.setSnackbar(
								<Snackbar
									duration="1500"
									onClose={() => props.setSnackbar(null)}
									before={
										<Avatar size={24} style={{ background: 'orange' }}>
											<Icon24Favorite fill="#fff" width={14} height={14} />
										</Avatar>
									}
								>
									У вас закрыт доступ к ЛС
								</Snackbar>
							);
						}
					}}
					description={
						props.pmOpen
							? 'Любой желающий может написать вам в лс'
							: 'Недоступно, так как у вас закрыт доступ к ЛС'
					}
					disabled={!props.pmOpen}
				>
					Личные сообщения
				</Radio>
				<Radio
					name="radio"
					value={ft}
					onClick={() => {
						props.setFeedbackType('comments');
					}}
					description="Пользователи оставляют комментарии к вашему объявлению"
					defaultChecked
				>
					Комментарии
				</Radio>
				<Radio
					name="radio"
					value={ft}
					onClick={() => {
						props.setFeedbackType('other');
					}}
					description="Вы указываете контакты для связи, пользователи связываются с вами"
				>
					Контакты
				</Radio>
			</div>
			{props.feedbackType == 'other' ? (
				<FormLayout>
					<Textarea
						top="Контакты"
						name="Контакты"
						placeholder="Почта, номер телфона, мессенджеры и т.д."
						value={props.contacts}
						onChange={(e) => {
							const { _, value } = e.currentTarget;
							props.setContacts(value);
						}}
						status={props.contacts ? 'valid' : 'error'}
					/>
				</FormLayout>
			) : (
				<div />
			)}
		</Group>
	);
};

export default ChooseFeedback;
