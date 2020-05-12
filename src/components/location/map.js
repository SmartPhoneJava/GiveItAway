import React, { useState, useEffect, useRef } from 'react';
import { YMaps, Map, YMapsApi, Placemark } from 'react-yandex-maps';

import {  GEO_DATA } from '../../store/create_post/types';
import { getGeodata } from '../../services/VK';
import { getAdress, getMetro } from '../../services/geodata';

const AdMap = (props) => {
	const {
        setGeoData,
        setGeoDataString,
		inputData,
	} = props;
	const geodata =
		inputData && inputData[GEO_DATA] && inputData[GEO_DATA].geodata && inputData[GEO_DATA].geodata.lat
			? inputData[GEO_DATA].geodata
			: { lat: 55.75, long: 37.57 };

	const geodata_string = inputData[GEO_DATA] && inputData[GEO_DATA].geodata_string ? inputData[GEO_DATA].geodata_string : ""

	console.log('geodata geodata', geodata);
    
	useEffect(() => {
		const { v, header, text } = props.isValid(inputData);
		setValid(v);
		setErrorHeader(header);
		setErrorText(text);
	}, [inputData]);

	const ON_REFRESH_CLICK = 'ON_REFRESH_CLICK';
	const ON_SUGGESTION_CLICK = 'ON_SUGGESTION_CLICK';
	const NO_CLICK = 'NO_CLICK';

	const [mapState, setMapState] = useState({ center: [2.75, 2.57], zoom: 9 });
	const [place, setPlace] = useState([2.75, 2.57]);
	const [dadataB, setDadataB] = useState(ON_REFRESH_CLICK);

	useEffect(() => {
		if (dadataB == NO_CLICK) {
			return;
		} else if (dadataB == ON_SUGGESTION_CLICK) {
			setTimeout(() => {
				setDadataB(NO_CLICK);
			}, 1000);
			return;
		}
		console.log('сбой ', dadataB);
		getGeodata(
			(data) => {
				console.log('go deeper', data);
				const center = [data.lat, data.long];
				setMapState({ ...mapState, center });
				setPlace(center);
				getAdress(
					data,
					(data_string) => {
                        setGeoDataString(data_string)
						// dadata.current.address = 'sssss';
						console.log('go deeper 2', data_string);
						setDadataB(NO_CLICK);
						// getMetro((l) => {
						// 	console.log('go deeper 3', l);
						// });
					},
					(e) => {
						setDadataB(NO_CLICK);
					}
				);
			},
			(e) => {
				setDadataB(NO_CLICK);
			}
		);
	}, [dadataB]);

	function findMetro(ymaps) {
		ymaps
			.geocode(geodata_string)
			.then((result) => {
				const lom = result.geoObjects.get(0).geometry.getCoordinates();

				const center = [lom[0], lom[1]];
				setGeoData({ lat: lom[0], long: lom[1] });
				setPlace(center);
				setMapState({ center, zoom: 9 });
			})
			.catch((e) => {
				console.log('hey hey hey errr', result.geoObjects.get(0).geometry.getCoordinates());
			});
		ymaps
			.geocode([geodata.lat, geodata.long], {
				/**
				 * Опции запроса
				 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/geocode.xml
				 */
				// Ищем только станции метро.
				kind: 'metro',
				// Запрашиваем не более 20 результатов.
				results: 20,
				apikey: '7f6269fb-0f48-4182-bd23-13b3cb155a06',
			})
			.then(function (res) {
				const coords = res.geoObjects[0];
				console.log('reeees findMetro', coords, res);
			})
			.catch((e) => {
				console.log('error findMetro', e);
			});
	}

    const width = document.body.clientWidth - 40;
    const height = document.body.clientHeight - 40;

	return (
		<YMaps query={{ apikey: '7f6269fb-0f48-4182-bd23-13b3cb155a06' }}>
			<Map width={width} state={mapState} modules={['geocode']} onLoad={(ymaps) => findMetro(ymaps)}>
				<Placemark geometry={place} />
			</Map>
		</YMaps>
	);
};

export default AdMap;
