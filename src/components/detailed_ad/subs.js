import React, { useState, useEffect } from 'react';
import { InfoRow, Header, Cell, SimpleCell, UsersStack, Group, Link } from '@vkontakte/vkui';

import { connect } from 'react-redux';

import { AnimateOnChange } from 'react-animation';
import Icon24Users from '@vkontakte/icons/dist/24/users';
import { setPage } from '../../store/router/actions';
import { PANEL_SUBS } from '../../store/router/panelTypes';

const SubsLabelInner = (props) => {
	const [componentSubs, setComponentSubs] = useState(<></>);

	function openSubs() {
		props.setPage(PANEL_SUBS);
	}

	useEffect(() => {
		const subs = props.ad.subs;
		const photos = subs.map((v) => v.photo_url);
		console.log('subs are', subs);
		setComponentSubs(
			subs.length == 0 ? (
				<Cell multiline={true} before={<Icon24Users />}>
					Никто еще не откликнулся
				</Cell>
			) : (
				<Group
					header={
						<Header mode="secondary" aside={<Link onClick={openSubs}>Показать всех</Link>}>
							Отликнулись
						</Header>
					}
				>
					<UsersStack onClick={openSubs} visibleCount={3} photos={photos} size="m">
						{subs.length == 1
							? subs[0].name + ' ' + subs[0].surname
							: subs.length == 2
							? subs[0].name + ' и ' + subs[1].name
							: subs.length == 3
							? subs[0].name + ', ' + subs[1].name + ' и ' + subs[2].name
							: subs[0].name +
							  ', ' +
							  subs[1].name +
							  ', ' +
							  subs[2].name +
							  'и еще ' +
							  (subscribers_num - 3) +
							  ' человек'}
					</UsersStack>
				</Group>
			)
		);
	}, [props.ad.subs]);
	return componentSubs;
};

const mapStateToPropsSubs = (state) => {
	return {
		ad: state.ad,
	};
};

const mapDispatchToPropsSubs = {
	setPage,
};

export const SubsLabel = connect(mapStateToPropsSubs, mapDispatchToPropsSubs)(SubsLabelInner);

// 55
