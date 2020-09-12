import React, { useState } from 'react';
import { YMaps, Map, Circle, Placemark } from 'react-yandex-maps';
import { ScreenSpinner, Placeholder } from '@vkontakte/vkui';
import Icon56ErrorOutline from '@vkontakte/icons/dist/56/error_outline';

import { GEO_DATA } from '../../store/create_post/types';

export const ON_REFRESH_CLICK = 'ON_REFRESH_CLICK';
export const ON_SUGGESTION_CLICK = 'ON_SUGGESTION_CLICK';
export const NO_CLICK = 'NO_CLICK';

const AdMap = (props) => {
	const AD = props.activeContext[props.activeStory];
	const { inputData, max } = props;
	const geodata = (max
		? AD.geo_position && AD.geo_position.lat
			? AD.geo_position
			: null
		: inputData && inputData[GEO_DATA] && inputData[GEO_DATA].geodata && inputData[GEO_DATA].geodata.lat
		? inputData[GEO_DATA].geodata
		: null) || { lat: 1, long: 1 };

	const center = [geodata.lat, geodata.long];
	const [mapState, setMapState] = useState({ center: center, zoom: 15 });
	const [place, setPlace] = useState(center);
	const [loaded, setLoaded] = useState(false);
	const [loadedFailed, setLoadedFailed] = useState(false);

	const width = document.body.clientWidth - 40;
	const height = document.body.clientHeight - 110;

	if (max && geodata.lat == 1 && geodata.long == 1) {
		return <Placeholder icon={<Icon56ErrorOutline/>}>Положение на карте не указано</Placeholder>;
	}

	return (
		<>
			{!loaded ? <ScreenSpinner style={{ paddingTop: `${height / 2}px` }} size="large" /> : null}
			{loadedFailed ? (
				<Placeholder icon={<Icon56ErrorOutline/>}>Не удалось загрузить карту</Placeholder>
			) : (
				<div className="ad-map">
					<YMaps>
						<Map
							width={max ? width + 40 : null}
							height={max ? height : null}
							state={mapState}
							onLoad={() => {
								setLoaded(true);
								setLoadedFailed(false);
							}}
							onError={() => {
								setLoaded(true);
								setLoadedFailed(true);
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
			)}
		</>
	);
};

export default AdMap;
