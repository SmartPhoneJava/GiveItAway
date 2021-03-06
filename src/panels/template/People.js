import React, { useState, useEffect } from 'react';
import { Avatar, Cell, FormLayout, FormLayoutGroup, Radio, SelectMimicry } from '@vkontakte/vkui';
import { withModalRootContext } from '@vkontakte/vkui';

import { connect } from 'react-redux';

import { getSubscribers, Close } from './../../requests';

export const PeopleRBI = withModalRootContext((props) => {
	const [subs, setSubs] = useState([]);
	const { ad_id, ad_type } = props.activeContext[props.activeStory];

	useEffect(() => {
		console.log('fun are', props.activeContext[props.activeStory]);
	}, [props.activeContext[props.activeStory]]);

	useEffect(() => {
		let cancelFunc = false;
		getSubscribers(
			ad_id,
			(s) => {
				if (cancelFunc) {
					return;
				}
				setSubs(s);
				props.updateModalHeight();
			},
			(e) => {},
			10
		);
		return () => {
			cancelFunc = true;
		};
	}, [ad_id]);

	return (
		<>
			{subs.map((v, i) => {
				return (
					<Radio
						key={i}
						name="sub"
						value={v.vk_id}
						style={{ cursor: 'pointer' }}
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
		activeStory: state.router.activeStory,
		activeContext: state.router.activeContext,
	};
};

const mapDispatchToProps = {};

export const PeopleRB = connect(mapStateToProps, mapDispatchToProps)(PeopleRBI);
