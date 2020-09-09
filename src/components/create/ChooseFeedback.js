import React, { useState } from 'react';
import { Group, Cell, Avatar, Snackbar, Switch } from '@vkontakte/vkui';

import { setFormData } from './../../store/create_post/actions';
import { connect } from 'react-redux';

import Icon24Favorite from '@vkontakte/icons/dist/24/favorite';
import { SNACKBAR_DURATION_DEFAULT } from '../../store/const';

import Icon24Comment from '@vkontakte/icons/dist/24/comment';

import { CREATE_AD_MAIN } from './../../store/create_post/types';

import { defaultInputData } from './default';
import { closeSnackbar, openSnackbar } from '../../store/router/actions';

const ChooseFeedback = (props) => {
	const { closeSnackbar, openSnackbar, activeStory } = props;
	const [inputData, setInputData] = useState(props.inputData[activeStory + CREATE_AD_MAIN] || defaultInputData);

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
		props.setFormData(activeStory + CREATE_AD_MAIN, {
			...props.inputData[activeStory + CREATE_AD_MAIN],
			[e.currentTarget.name]: e.currentTarget.checked,
		});
	}

	return (
		<Group
			separator="hide"
			header={
				<Cell multiline description="Как откликнувшиеся смогут связаться с вами?">
					<div style={{ fontWeight: 600 }}>Обратная связь</div>
				</Cell>
			}
		>
			{/* <Cell
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
			</Cell> */}
			<Cell
				before={<Icon24Comment fill="var(--header_tab_inactive_text)" />}
				multiline
				asideContent={
					<Switch
						style={{ cursor: 'pointer' }}
						name="comments_enabled"
						checked={inputData.comments_enabled}
						onChange={handleChecked}
					/>
				}
				description="Пользователи могут оставлять комментарии в объявлении"
			>
				Комментарии
			</Cell>
		</Group>
	);
};

const mapStateToProps = (state) => {
	return {
		inputData: state.formData.forms,
		activeStory: state.router.activeStory,
	};
};

const mapDispatchToProps = {
	setFormData,
	closeSnackbar,
	openSnackbar,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChooseFeedback);
