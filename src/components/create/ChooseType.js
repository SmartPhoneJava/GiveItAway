import React, { useState } from 'react';
import { Radio, Group, Header, Cell } from '@vkontakte/vkui';

import { setFormData } from '../../store/create_post/actions';
import { connect } from 'react-redux';

import { defaultInputData } from './default';

import { CREATE_AD_MAIN, EDIT_MODE } from '../../store/create_post/types';
import { TYPE_CHOICE, TYPE_RANDOM, TYPE_AUCTION } from '../../const/ads';

const ChooseType = (props) => {
	const [inputData, setInputData] = useState(props.inputData[CREATE_AD_MAIN] || defaultInputData);
	const edited = props.inputData[EDIT_MODE] ? props.inputData[EDIT_MODE].mode : false;

	function handleChecked(e) {
		setInputData({
			...inputData,
			type: e.currentTarget.value,
		});
		props.setFormData(CREATE_AD_MAIN, {
			...inputData,
			type: e.currentTarget.value,
		});
	}

	return (
		<Group
			separator="hide"
			header={
				<Cell multiline description="Как будет проходить выбор получателя вещи?">
					<div style={{ fontWeight: 600 }}>Определение получателя</div>
				</Cell>
			}
		>
			<Radio
				style={{ cursor: !edited ? 'pointer' : null }}
				disabled={edited}
				name="radio"
				value={TYPE_CHOICE}
				onChange={handleChecked}
				description="Вы самостоятельно выбираете человека, которому отдадите вещь"
				checked={inputData.type == TYPE_CHOICE}
			>
				Сделка
			</Radio>
			<Radio
				style={{ cursor: !edited ? 'pointer' : null }}
				disabled={edited}
				name="radio"
				value={TYPE_RANDOM}
				onChange={handleChecked}
				description="Получатель определяется случайным образом из списка откликнувшихся"
				checked={inputData.type == TYPE_RANDOM}
			>
				Лотерея
			</Radio>
			<Radio
				style={{ cursor: !edited ? 'pointer' : null }}
				disabled={edited}
				name="radio"
				value={TYPE_AUCTION}
				onChange={handleChecked}
				description="Ваша вещь достанется тому, кто предложит больше всего Кармы"
				checked={inputData.type == TYPE_AUCTION}
			>
				Аукцион
			</Radio>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(ChooseType);
