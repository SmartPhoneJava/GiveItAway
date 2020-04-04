import React, { useState, useEffect } from 'react';
import { Avatar, Cell, FormLayout, FormLayoutGroup, Radio, SelectMimicry } from '@vkontakte/vkui';
import { withModalRootContext } from '@vkontakte/vkui';

import Icon24Done from '@vkontakte/icons/dist/24/done';

import { getSubscribers } from './../../requests';

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

export const PeopleRB = withModalRootContext((props) => {
	const [subs, setSubs] = useState([]);
	const [sub, setSub] = useState({});

	useEffect(() => {
		async function get() {
			let { subscribers, err } = await getSubscribers(props.setPopout, props.setSnackbar, props.ad_id);
			subscribers = subscribers || [];
			console.log('subscribers2', subscribers);
			if (!err) {
				setSubs(subscribers);
			}
			props.updateModalHeight();
			return { subscribers, err };
		}
		get();
	}, [props.ad_id]);

	return (
		<>
			{subs.map((v, i) => {
				return (
					<Radio
						key={i}
						name="sub"
						value={v}
						onClick={(e) => {
							const { _, value } = e.currentTarget;
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
