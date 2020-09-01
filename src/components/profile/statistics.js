import React, { useState, useEffect } from 'react';
import { Avatar, Header, Group, Cell, SimpleCell, Title, Subhead, Counter } from '@vkontakte/vkui';
import { RadialChart } from 'react-vis';

const COLOR_GIVEN = '#00CCFF';
const COLOR_RECEIVED = '#FFCC33';
const COLOR_SUCCESS = '#00CC66';
const COLOR_FAILED = '#FF9933';

export const Statistics = (props) => {
	const { backuser } = props;
	const width = document.body.clientWidth;
	const smallWidth = width < 330

	function counter(background, text, value) {
		return (
			<SimpleCell before={<Avatar style={{ background }} size={24} />}>
				<Title weight="regular" level="3">
					{text}: <b>{`${value}`}</b>
				</Title>
			</SimpleCell>
		);
	}

	function radialChart(data) {
		return (
			<div style={{paddingLeft: smallWidth ? width / 4 : null}}>
			<RadialChart
				data={data}
				showLabels={true}
				radius={60}
				innerRadius={55}
				width={width / 2}
				height={160}
				labelsAboveChildren={false}
				labelsRadiusMultiplier={2}
				colorType="literal"
			/>
			</div>
		);
	}

	const dataGivenReceived =
		backuser.total_given_ads + backuser.total_received_ads == 0
			? [
					{ angle: 1, color: COLOR_GIVEN },
					{
						angle: 1,
						color: COLOR_RECEIVED,
					},
			  ]
			: [
					{ angle: backuser.total_given_ads, color: COLOR_GIVEN },
					{
						angle: backuser.total_received_ads,
						color: COLOR_RECEIVED,
					},
			  ];

	const dataSuccessFail =
		backuser.total_given_ads + backuser.total_received_ads + backuser.total_aborted_ads == 0
			? [
					{
						angle: 1,
						color: COLOR_SUCCESS,
					},
					{
						angle: 1,
						color: COLOR_FAILED,
					},
			  ]
			: [
					{
						angle: backuser.total_given_ads + backuser.total_received_ads - backuser.total_aborted_ads,
						color: COLOR_SUCCESS,
					},
					{
						angle: backuser.total_aborted_ads,
						color: COLOR_FAILED,
					},
			  ];

	// добавить ползунок к просмотру отданных полученных, проверить, что на айфонах все умещается везде
	return backuser.total_received_ads + backuser.total_given_ads == 0 ? null : (
		<Group header={<Header mode="secondary">Статистика</Header>}>
			<div style={{ textAlign: 'center', display: smallWidth ? 'block' : 'flex' }}>
				<div className="infographics-column">
					<div style={{ position: 'relative' }}>
						{radialChart(dataGivenReceived)}
						<div className="infographics-column-header">
							<Title level="2">Вещей</Title>
						</div>
					</div>

					{counter(COLOR_GIVEN, 'Отдано', backuser.total_given_ads)}
					{counter(COLOR_RECEIVED, 'Получено', backuser.total_received_ads)}
				</div>
				<div className="infographics-column">
					<div style={{ position: 'relative' }}>
						{radialChart(dataSuccessFail)}
						<div className="infographics-column-header">
							<Title level="2">Обменов</Title>
						</div>
					</div>
					{counter(
						COLOR_SUCCESS,
						'Проведено',
						backuser.total_given_ads + backuser.total_received_ads - backuser.total_aborted_ads
					)}
					{counter(COLOR_FAILED, 'Сорвано', backuser.total_aborted_ads)}
				</div>
			</div>
		</Group>
	);
};

// 124
