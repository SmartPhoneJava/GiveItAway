import React, { useState } from 'react';
import { Radio, Group, Header } from '@vkontakte/vkui';

import { setFormData } from '../../store/create_post/actions';
import { connect } from 'react-redux';

import Icon24Favorite from '@vkontakte/icons/dist/24/favorite';
import { SNACKBAR_DURATION_DEFAULT } from '../../store/const';

import Icon24Message from '@vkontakte/icons/dist/24/message';
import Icon24Comment from '@vkontakte/icons/dist/24/comment';
import Icon24Note from '@vkontakte/icons/dist/24/note';

import { defaultInputData } from './default';

import { CREATE_AD_MAIN } from '../../store/create_post/types';

const ChooseType = (props) => {
	const [inputData, setInputData] = useState(props.inputData[CREATE_AD_MAIN] || defaultInputData);

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
		<Group separator="hide" header={<Header>Определение получателя</Header>}>
			<Radio
				name="radio"
				value="offer"
				onChange={handleChecked}
				description="Вы самостоятельно выбираете человека, которому отдадите вещь"
				checked={inputData.type == 'offer'}
			>
				Сделка
			</Radio>
			<Radio
				name="radio"
				value="lotereya"
				onChange={handleChecked}
				description="Получатель определяется случайным образом из списка откликнувшихся"
				checked={inputData.type == 'lotereya'}
			>
				Лотерея
			</Radio>
			<Radio
				name="radio"
				value="auction"
				onChange={handleChecked}
				description="Ваша вещь достанется тому, кто предложит больше всего Кармы"
				checked={inputData.type == 'auction'}
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
