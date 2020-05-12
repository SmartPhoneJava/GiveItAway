import React, { useState, useEffect, useRef } from 'react';
import { YMaps, Map, Circle, Placemark } from 'react-yandex-maps';
import { ScreenSpinner, Snackbar, Avatar } from '@vkontakte/vkui';

import { GEO_DATA } from '../../store/create_post/types';
import { getGeodata } from '../../services/VK';
import { getAdress, getMetro } from '../../services/geodata';

export const ON_REFRESH_CLICK = 'ON_REFRESH_CLICK';
export const ON_SUGGESTION_CLICK = 'ON_SUGGESTION_CLICK';
export const NO_CLICK = 'NO_CLICK';

const AdMap = (props) => {
	const { setGeoData, setGeoDataString, inputData, max, AD } = props;
	const geodata = (max
		? AD.geo_position
		: inputData && inputData[GEO_DATA] && inputData[GEO_DATA].geodata && inputData[GEO_DATA].geodata.lat
		? inputData[GEO_DATA].geodata
		: { lat: 55.75, long: 37.57 }) || { lat: 55.75, long: 37.57 };

	console.log('gleodata', geodata);

	const center = [geodata.lat, geodata.long];
	const [mapState, setMapState] = useState({ center: center, zoom: 15 });
	const [place, setPlace] = useState(center);
	const [loaded, setLoaded] = useState(false);

	const width = document.body.clientWidth - 40;
	const height = document.body.clientHeight - 150;

	return (
		<div style={{ alignItems: 'center', justifyContent: 'center' }}>
			{!loaded ? <ScreenSpinner size="large" /> : null}
			<YMaps>
				<Map
					width={width}
					height={max ? height : null}
					state={mapState}
					onLoad={() => {
						setLoaded(true);
					}}
				>
					{max ? (
						<Circle
							geometry={[center, 200]}
							options={{
								draggable: false,
								fillColor: '#DB709377',
								strokeColor: '#990066',
								strokeOpacity: 0.5,
								strokeWidth: 1,
							}}
						/>
					) : (
						<Placemark geometry={place} />
					)}
				</Map>
			</YMaps>
		</div>
	);
};

export default AdMap;
