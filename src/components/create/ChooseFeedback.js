import React, { useState } from 'react';
import { Textarea, Radio, Group, Header, Cell, Avatar, Checkbox, Snackbar, FormLayout, Switch } from '@vkontakte/vkui';

import { setFormData } from './../../store/create_post/actions';
import { connect } from 'react-redux';

import Icon24Favorite from '@vkontakte/icons/dist/24/favorite';
import { SNACKBAR_DURATION_DEFAULT } from '../../store/const';

import Icon24Message from '@vkontakte/icons/dist/24/message';
import Icon24Comment from '@vkontakte/icons/dist/24/comment';
import Icon24Note from '@vkontakte/icons/dist/24/note';

import { CREATE_AD_MAIN } from './../../store/create_post/types';

import { defaultInputData } from './default';
import { closeSnackbar, openSnackbar } from '../../store/router/actions';

const ChooseFeedback = (props) => {
	const [inputData, setInputData] = useState(props.inputData[CREATE_AD_MAIN] || defaultInputData);

	const { closeSnackbar, openSnackbar } = props;
	function warningClosedProfile() {
		openSnackbar(
			<Snackbar
				duration={SNACKBAR_DURATION_DEFAULT}
				onClose={closeSnackbar}
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

	function handleChecked(e) {
		setInputData({
			...inputData,
			[e.currentTarget.name]: e.currentTarget.checked,
		});
		console.log('debuuug', e.currentTarget.name, e.currentTarget.checked);
		props.setFormData(CREATE_AD_MAIN, {
			...inputData,
			[e.currentTarget.name]: e.currentTarget.checked,
		});
	}

	return (
		<Group separator="hide" header={<Header>Обратная связь</Header>}>
			<Cell
				before={<Icon24Message fill="var(--header_tab_inactive_text)" />}
				multiline
				disabled={!props.pmOpen}
				asideContent={
					<Switch
						checked={inputData.ls_enabled}
						name="ls_enabled"
						onChange={(e) => {
							if (props.pmOpen) {
								handleChecked(e);
							} else {
								warningClosedProfile();
							}
						}}
					/>
				}
				description="Любой желающий может написать вам в ЛС"
			>
				Личные сообщения
			</Cell>
			<Cell
				before={<Icon24Comment fill="var(--header_tab_inactive_text)" />}
				multiline
				asideContent={
					<Switch name="comments_enabled" checked={inputData.comments_enabled} onChange={handleChecked} />
				}
				description="Пользователи могут оставлять коментарии в обьявлении"
			>
				Комментарии
			</Cell>
		</Group>
	);
};

const mapStateToProps = (state) => {
	return {
		inputData: state.formData.forms,
	};
};

const mapDispatchToProps = {
	setFormData,
	closeSnackbar,
	openSnackbar,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChooseFeedback);
