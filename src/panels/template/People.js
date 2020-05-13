import React, { useState, useEffect } from 'react';
import { Avatar, Cell, FormLayout, FormLayoutGroup, Radio, SelectMimicry } from '@vkontakte/vkui';
import { withModalRootContext } from '@vkontakte/vkui';

import { connect } from 'react-redux';

import { getSubscribers, Close } from './../../requests';

export const PeopleList = (subs) => {
	{
		subs.length > 0 ? (
			subs.map((v) => (
				<Cell key={v.vk_id} before={<Avatar size={36} src={v.photo_url} />}>
					{v.name + ' ' + v.surname}
				</Cell>
			))
		) : (
			<InfoRow style={{ paddingLeft: '16px' }}> пусто</InfoRow>
		);
	}
};

export const PeopleRBI = withModalRootContext((props) => {
	const [subs, setSubs] = useState([]);
	const { ad_id, ad_type } = props.ad;

	useEffect(() => {
		getSubscribers(
			ad_id,
			(s) => {
				setSubs(s);
				props.updateModalHeight();
			},
			(e) => {},
			10
		);
	}, [ad_id]);

	return (
		<>
			{subs.map((v, i) => {
				return (
					<Radio
						key={i}
						name="sub"
						value={v.vk_id}
						onClick={(e) => {
							const { value } = e.currentTarget;
							Close(ad_id, ad_type, value);
							props.back();
						}}
					>
						<Cell key={v.vk_id} before={<Avatar size={36} src={v.photo_url} />}>
							{v.name + ' ' + v.surname}
						</Cell>
					</Radio>
				);
			})}
		</>
	);
});

const mapStateToProps = (state) => {
	return {
		ad: state.ad,
	};
};

const mapDispatchToProps = {};

export const PeopleRB = connect(mapStateToProps, mapDispatchToProps)(PeopleRBI);
