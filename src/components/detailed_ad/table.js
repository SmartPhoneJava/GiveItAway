import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { MiniInfoCell, Placeholder, Cell } from '@vkontakte/vkui';

import Icon24View from '@vkontakte/icons/dist/24/view';
import Icon24Similar from '@vkontakte/icons/dist/24/similar';
import Icon24Place from '@vkontakte/icons/dist/24/place';
import Icon24Chevron from '@vkontakte/icons/dist/24/chevron';

import { AnimateOnChange } from 'react-animation';

import { isFinished } from './faq';
import { PANEL_MAP } from '../../store/router/panelTypes';
import { setPage } from '../../store/router/actions';
import { CategoryOnline } from '../categories/const';

const AdMainInfoInner = (props) => {
	if (!props.activeContext[props.activeStory]) {
		return null;
	}
	if (props.activeContext[props.activeStory].hidden && !props.activeContext[props.activeStory].isAuthor) {
		return null;
	}
	function tableElement(Icon, text, value, After, onClick) {
		return (
			<MiniInfoCell
				multiline
				style={{ padding: '4px', cursor: onClick ? 'pointer' : null }}
				onClick={onClick}
				mode={onClick ? 'more' : null}
				before={<Icon width={20} height={20} />}
				after={
					After ? (
						<After
							width={22}
							height={22}
							className="details-table-element"
							style={{ color: onClick ? 'var(--accent)' : 'var(--text_secondary)' }}
						/>
					) : null
				}
			>
				{text}
				{':'}&nbsp;
				{value}
			</MiniInfoCell>
		);
	}

	function openMap() {
		props.setPage(PANEL_MAP);
	}

	function getGeoPosition(region, district) {
		let r = region != undefined ? region : null || '';
		let d = district != undefined ? district : null || '';
		var place = r && d ? r + ', ' + d : r + d;
		if (place == '') {
			place = 'Россия';
		}
		console.log('region isss', r, d);
		return place;
	}

	const [componentItemTable, setComponentItemTable] = useState(<></>);
	useEffect(() => {
		const { views_count, status, region, district, category } = props.activeContext[props.activeStory];
		let subscribers_num = props.activeContext[props.activeStory].subscribers_num || '0';

		setComponentItemTable(
			<div className="details-table-outter">
				{tableElement(Icon24View, 'Просмотров', <AnimateOnChange>{views_count}</AnimateOnChange>)}
				{!isFinished(status)
					? tableElement(Icon24Similar, 'Откликнулось', <AnimateOnChange>{subscribers_num}</AnimateOnChange>)
					: null}
				{category != CategoryOnline &&
					tableElement(Icon24Place, 'Где забрать', getGeoPosition(region, district), Icon24Chevron, openMap)}
			</div>
		);
	}, [props.activeContext[props.activeStory]]);

	return componentItemTable;
};

const mapStateToProps = (state) => {
	return {
		activeStory: state.router.activeStory,
		activeContext: state.router.activeContext,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		dispatch,
		...bindActionCreators(
			{
				setPage,
			},
			dispatch
		),
	};
};

export const AdMainInfo = connect(mapStateToProps, mapDispatchToProps)(AdMainInfoInner);
