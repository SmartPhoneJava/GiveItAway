import React, { useState, useEffect } from 'react';
import { Avatar, Header, Group } from '@vkontakte/vkui';
import { RadialChart } from 'react-vis';

export const Statistics = (props) => {
    const {backuser} = props;
    const width = document.body.clientWidth;
	return backuser.total_received_ads + backuser.total_given_ads == 0 ? null : (
		<Group header={<Header mode="secondary">Статистика</Header>}>
			<div className="infographics-main">
				<div className="infographics-column">
					<div>Вещей</div>
					<RadialChart
						data={
							backuser.total_given_ads + backuser.total_received_ads == 0
								? [
										{ angle: 1, color: '#00CCFF' },
										{
											angle: 1,
											color: '#FFCC33',
										},
								  ]
								: [
										{ angle: backuser.total_given_ads, color: '#00CCFF' },
										{
											angle: backuser.total_received_ads,
											color: '#FFCC33',
										},
								  ]
						}
						showLabels={true}
						radius={40}
						innerRadius={30}
						width={width / 2}
						height={100}
						labelsAboveChildren={false}
						labelsRadiusMultiplier={2}
						colorType="literal"
					/>

					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<Avatar style={{ background: '#00CCFF', marginRight: '3px' }} size={14}></Avatar>
						<>Отдано</>
					</div>
					<div style={{ display: 'flex', paddingLeft: '15px', justifyContent: 'center' }}>
						<Avatar style={{ background: '#FFCC33', marginRight: '3px' }} size={14}></Avatar>
						<>Получено</>
					</div>
				</div>
				<div className="infographics-column">
					Обменов
					<RadialChart
						data={
							backuser.total_given_ads + backuser.total_received_ads + backuser.total_aborted_ads == 0
								? [
										{
											angle: 1,
											color: '#00CC66',
										},
										{
											angle: 1,
											color: '#FF9933',
										},
								  ]
								: [
										{
											angle: backuser.total_given_ads + backuser.total_received_ads,
											color: '#00CC66',
										},
										{
											angle: backuser.total_aborted_ads,
											color: '#FF9933',
										},
								  ]
						}
						colorType="literal"
						showLabels={true}
						radius={40}
						innerRadius={30}
						width={width / 2}
						height={100}
						labelsAboveChildren={false}
						labelsRadiusMultiplier={2}
					/>
					<div style={{ display: 'flex', paddingLeft: '18px', justifyContent: 'center' }}>
						<Avatar style={{ background: '#00CC66', marginRight: '3px' }} size={14}></Avatar>
						<>Проведено</>
					</div>
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<Avatar style={{ background: '#FF9933', marginRight: '3px' }} size={14}></Avatar>
						<>Сорвано</>
					</div>
				</div>
			</div>
		</Group>
	);
};
