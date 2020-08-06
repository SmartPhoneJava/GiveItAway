import React, { useState, useEffect, useRef } from 'react';
import { YMaps, Map, YMapsApi, Placemark, FullscreenControl } from 'react-yandex-maps';
import {
	Button,
	Group,
	Header,
	Div,
	FormStatus,
	Link,
	Spinner,
	Snackbar,
	Avatar,
	PanelHeaderButton,
	Cell,
	Banner,
	Checkbox,
	FormLayout,
	SimpleCell,
} from '@vkontakte/vkui';
import { ReactDadata } from 'react-dadata';

import CreateItem from './CreateItem';
import ChooseFeedback from './../../../../components/create/ChooseFeedback';
import ChooseType from './../../../../components/create/ChooseType';

import Icon24Favorite from '@vkontakte/icons/dist/24/favorite';
import Icon24Place from '@vkontakte/icons/dist/24/place';

import { PANEL_CITIES, PANEL_CATEGORIES, PANEL_COUNTRIES } from './../../../../store/router/panelTypes';

import { Transition } from 'react-transition-group';

// import { canWritePrivateMessage } from '../../../../requests';
import { FORM_LOCATION_CREATE } from '../../../../components/location/redux';
import { SNACKBAR_DURATION_DEFAULT } from '../../../../store/const';
import { EDIT_MODE, CREATE_AD_ITEM, GEO_DATA } from '../../../../store/create_post/types';
import { getGeodata } from '../../../../services/VK';
import { getAdress, getMetro } from '../../../../services/geodata';
import { NoRegion } from '../../../../components/location/const';
import { CategoryNo, CategoryOnline } from '../../../../components/categories/const';
import { FORM_CREATE } from '../../../../components/categories/redux';
import { GetCategory400 } from '../../../../components/categories/Categories';

const duration = 300;

const defaultStyle = {
	// transition: `opacity ${duration}ms ease-in-out`,
	transition: '300ms',

	opacity: 0,
};

const transitionStyles = {
	entering: { opacity: 1 },
	entered: { opacity: 1 },
	exiting: {
		opacity: 0,
		transform: 'scale(0.1)',
	},
	exited: { opacity: 0, transform: 'scale(0.1)' },
};

const CreateAddRedux = (props) => {
	const { myUser, appID, apiVersion, snackbar, inputData } = props;

	const { openSnackbar, closeSnackbar, setGeoDataString, setGeoData, setFormData, setPage, openLicence } = props;

	const geodata =
		inputData && inputData[GEO_DATA] && inputData[GEO_DATA].geodata && inputData[GEO_DATA].geodata.lat
			? inputData[GEO_DATA].geodata
			: { lat: 55.75, long: 37.57 };
	const [geodata_string, set_geodata_string] = useState(
		inputData && inputData[GEO_DATA] && inputData[GEO_DATA].geodata_string
			? inputData[GEO_DATA].geodata_string
			: inputData[FORM_LOCATION_CREATE] &&
			  inputData[FORM_LOCATION_CREATE].city &&
			  inputData[FORM_LOCATION_CREATE].city.title
			? inputData[FORM_LOCATION_CREATE].city.title
			: 'Мой адрес'
	);

	// refs
	const addRef = useRef();
	const agreeRef = useRef();

	const [category, setCategory] = useState(CategoryNo);
	useEffect(() => {
		if (!inputData[FORM_CREATE]) {
			return;
		}
		setCategory(inputData[FORM_CREATE].category);
	}, [inputData[FORM_CREATE]]);

	const [pmOpen, setPmOpen] = useState(true);
	// useEffect(() => {
	// 	let cleanupFunction = false;
	// 	canWritePrivateMessage(
	// 		myUser.id,
	// 		appID,
	// 		apiVersion,
	// 		(isClosed) => {
	// 			if (!cleanupFunction) {
	// 				setPmOpen(!isClosed);
	// 			}
	// 		},
	// 		(e) => {}
	// 	);
	// 	return () => (cleanupFunction = true);
	// }, []);

	const [errorHeader, setErrorHeader] = useState('');
	const [errorText, setErrorText] = useState('');
	const [valid, setValid] = useState(false);
	const [addOffset, setAddOffset] = useState(0);
	const needEdit = inputData[EDIT_MODE] ? inputData[EDIT_MODE].mode : false;

	const [notShow, setNotShow] = useState(false);

	const [licenceAgree, setLicenceAgree] = useState(false);

	useEffect(() => {
		let cleanupFunction = false;
		let { v, header, text } = props.isValid(inputData);
		var l = needEdit ? true : licenceAgree;
		if (v && !l) {
			v = l;
			text = 'Прочтите и согласитель с правилами использования';
		}
		v = v && l;

		setValid(v);
		if (!v) {
			setErrorHeader(header);
			setErrorText(text);
			setNotShow(false);
		} else {
			if (!needEdit) {
				const h = agreeRef.current.clientHeight;
				setAddOffset(h);
				setTimeout(() => {
					if (cleanupFunction) {
						return;
					}
					setAddOffset(h);
				}, 1000);
			}
		}
		return () => (cleanupFunction = true);
	}, [inputData, licenceAgree]);

	const ON_REFRESH_CLICK = 'ON_REFRESH_CLICK';
	const ON_SUGGESTION_CLICK = 'ON_SUGGESTION_CLICK';
	const NO_CLICK = 'NO_CLICK';

	const [mapState, setMapState] = useState({ center: [2.75, 2.57], zoom: 9, controls: [] });
	const [place, setPlace] = useState([2.75, 2.57]);
	const [dadataB, setDadataB] = useState(NO_CLICK);
	const [isLoading, setIsLoading] = useState(false);
	const [needRefreshL, setNeedRefreshL] = useState(false);

	useEffect(() => {
		let cancelFunc = false;
		if (dadataB == NO_CLICK) {
			return;
		} else if (dadataB == ON_SUGGESTION_CLICK) {
			setTimeout(() => {
				if (cancelFunc) {
					return;
				}
				setDadataB(NO_CLICK);
			}, 1000);
			return;
		}
		setIsLoading(true);
		setTimeout(() => {
			getGeodata(
				(data) => {
					if (cancelFunc) {
						return;
					}
					const center = [data.lat, data.long];
					setMapState({ ...mapState, center });
					setPlace(center);
					setIsLoading(false);
					getAdress(
						data,
						(data_string) => {
							if (cancelFunc) {
								return;
							}
							set_geodata_string(data_string);
							setNeedRefreshL(true);
							setTimeout(() => {
								setNeedRefreshL(false);
							}, 50);

							console.log('go deeper 2', data_string);
							setDadataB(NO_CLICK);
							// getMetro((l) => {
							// 	console.log('go deeper 3', l);
							// });
						},
						(e) => {
							if (cancelFunc) {
								return;
							}
							setDadataB(NO_CLICK);
						}
					);
				},
				(e) => {
					if (cancelFunc) {
						return;
					}
					setIsLoading(false);
					setDadataB(NO_CLICK);
				}
			);
		}, 3000);
		return () => {
			cancelFunc = true;
		};
	}, [dadataB]);

	function saveCancel() {
		openSnackbar(
			<Snackbar
				duration={SNACKBAR_DURATION_DEFAULT}
				onClose={closeSnackbar}
				before={
					<Avatar size={24} style={{ background: 'orange' }}>
						<Icon24Favorite fill="#fff" width={14} height={14} />
					</Avatar>
				}
			>
				Пожалуйста, заполните все обязательные поля.
			</Snackbar>
		);
	}

	function createAd() {
		if (valid) {
			props.createAd(myUser, inputData);
		} else {
			saveCancel();
		}
	}
	function editAd() {
		if (valid) {
			props.editAd(myUser, inputData);
		} else {
			saveCancel();
		}
	}

	function findMetro(ymaps, geoString) {
		const geo_string = geoString || geodata_string;
		ymaps
			.geocode(geo_string)
			.then((result) => {
				const lom = result.geoObjects.get(0).geometry.getCoordinates();

				const center = [lom[0], lom[1]];
				console.log('looooook at center', center);
				setGeoData({ lat: lom[0], long: lom[1] });
				setPlace(center);
				setMapState({ center, zoom: 9 });
			})
			.catch((e) => {
				console.log('hey hey hey errr', result.geoObjects.get(0).geometry.getCoordinates());
			});
		// ymaps
		// 	.geocode([geodata.lat, geodata.long], {
		// 		/**
		// 		 * Опции запроса
		// 		 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/geocode.xml
		// 		 */
		// 		// Ищем только станции метро.
		// 		kind: 'metro',
		// 		// Запрашиваем не более 20 результатов.
		// 		results: 20,
		// 		apikey: '7f6269fb-0f48-4182-bd23-13b3cb155a06',
		// 	})
		// 	.then(function (res) {
		// 		const coords = res.geoObjects[0];
		// 		console.log('reeees findMetro', coords, res);
		// 	})
		// 	.catch((e) => {
		// 		console.log('error findMetro', e);
		// 	});
	}

	const styleAdd = () => {
		var m = addOffset || 0;
		return {
			entered: { transform: `translateY(-${m}px)`, opacity: 1 },
			exited: { transform: `translateY(1px)`, opacity: 1 },
		};
	};

	useEffect(() => {
		console.log('look at isLoading', isLoading);
	}, [isLoading]);

	const [width, setWidth] = useState(document.body.clientWidth - 15);
	const [ymapsL, setYmapsL] = useState({});

	return (
		<div>
			<Group separator="hide" header={<Header mode="secondary">Опишите выставляемые предметы</Header>}>
				<CreateItem
					category={category}
					defaultInputData={props.defaultInputData}
					openCategories={() => {
						setPage(PANEL_CATEGORIES);
					}}
				/>
			</Group>

			{category == CategoryOnline ? (
				<Banner
					before={<Avatar size={48} src={GetCategory400(category)} />}
					subheader="Вы отдаете электронную вещь, поэтому указание снимков и геопозиции не требуется"
				/>
			) : (
				<Group
					separator="hide"
					header={
						<Cell
							multiline={true}
							description="Кликни по полю ввода, чтобы указать свое местоположение или по иконке, чтобы определить его автоматически"
						>
							<div style={{ fontWeight: 600 }}>Где забрать вещь</div>
						</Cell>
					}
				>
					<>
						<Div>
							<div className="flex-center">
								<PanelHeaderButton
									className="geo-position-icon"
									onClick={() => {
										setDadataB(ON_REFRESH_CLICK);
									}}
								>
									<Icon24Place fill="var(--accent)" />
								</PanelHeaderButton>

								{needRefreshL ? null : (
									<div
										style={{
											transition: '0.3s',
											width: !isLoading ? '100%' : '90%',
										}}
									>
										<ReactDadata
											disabled={needEdit}
											token={'efb37d1dc6b04c11116d3ab7ef9482fa13e0b664'}
											query={geodata_string}
											onChange={(e) => {
												console.log('geoDataString', e);
												setGeoDataString(e.value);
												set_geodata_string(e.value);
												setDadataB(ON_SUGGESTION_CLICK);

												const city_title = e.data.city
													? e.data.city
													: e.data.region
													? e.data.region
													: NoRegion.title;
												setFormData(FORM_LOCATION_CREATE, {
													...inputData[FORM_LOCATION_CREATE],
													country: { id: 1, title: e.data.country },
													city: { id: 1, title: city_title },
												});
												findMetro(ymapsL, e.value);

												// if (!e.data.geo_lat) {
												// 	getMetro(e.data.postal_code);
												// }
												// setMapState({ ...mapState, center: [e.geo_lat, e.geo_long] });
											}}
											autocomplete={geodata_string}
											placeholder={'Введите адрес'}
										/>
									</div>
								)}

								<div
									style={{
										transition: '0.3s',
										width: isLoading ? '10%' : '0%',
										opacity: isLoading ? '1' : '0',
									}}
								>
									<Spinner size="small" />
								</div>
							</div>

							<div style={{ marginTop: '10px' }}>
								{/* {needRefreshM ? null : ( */}
								<YMaps query={{ apikey: '7f6269fb-0f48-4182-bd23-13b3cb155a06' }}>
									<Map
										width={width}
										state={mapState}
										modules={['geocode']}
										onLoad={(ymaps) => {
											setYmapsL(ymaps);
											findMetro(ymaps);
										}}
									>
										<Placemark geometry={place} />
										<FullscreenControl options={{ float: 'left' }} />
									</Map>
								</YMaps>
								{/* )} */}
							</div>
						</Div>
					</>
				</Group>
			)}

			<ChooseFeedback pmOpen={pmOpen} />
			<ChooseType />
			{/** ref={agreeRef} */}
			{needEdit ? null : (
				<div ref={agreeRef}>
					<FormLayout>
						<Checkbox
							onChange={(event) => {
								setLicenceAgree(event.target.checked);
							}}
						>
							Я ознакомлен(-а) и согласен(-а) с <Link onClick={openLicence}>правилами использования</Link>
						</Checkbox>
					</FormLayout>
				</div>
			)}
			<Transition in={!valid} timeout={duration}>
				{(state) => (
					<div
						style={{
							...defaultStyle,
							...transitionStyles[state],
							padding: '10px',
						}}
					>
						<FormStatus header={errorHeader} mode={valid ? 'default' : 'error'}>
							{errorText}
						</FormStatus>
					</div>
				)}
			</Transition>
			<Transition in={valid} timeout={duration}>
				{(state) => (
					<Div
						style={{
							...defaultStyle,
							...styleAdd()[state],
							display: 'flex',
							opacity: 1,
						}}
					>
						{needEdit ? (
							<Button onClick={editAd} mode={valid ? 'commerce' : 'secondary'} size="l" stretched>
								Сохранить
							</Button>
						) : (
							<Button onClick={createAd} mode={valid ? 'commerce' : 'secondary'} size="l" stretched>
								Добавить
							</Button>
						)}
					</Div>
				)}
			</Transition>

			{snackbar}
		</div>
	);
};

export default CreateAddRedux;

// 609 -> 462 -> 321 -> 348 -> 282 -> 126 -> 494
