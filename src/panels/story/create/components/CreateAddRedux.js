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
	Cell,
	Banner,
	Checkbox,
	FormLayout,
	SimpleCell,
	Placeholder,
	platform,
} from '@vkontakte/vkui';
import { ReactDadata } from 'react-dadata';

import CreateItem from './CreateItem';
import ChooseFeedback from './../../../../components/create/ChooseFeedback';
import ChooseType from './../../../../components/create/ChooseType';

import Icon24DoneOutline from '@vkontakte/icons/dist/24/done_outline';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';

import Icon24Favorite from '@vkontakte/icons/dist/24/favorite';
import Icon24Place from '@vkontakte/icons/dist/24/place';
import Icon56PlaceOutline from '@vkontakte/icons/dist/56/place_outline';

import { PANEL_CITIES, PANEL_CATEGORIES, PANEL_COUNTRIES } from './../../../../store/router/panelTypes';

import { Transition } from 'react-transition-group';

// import { canWritePrivateMessage } from '../../../../requests';
import { FORM_LOCATION_CREATE } from '../../../../components/location/redux';
import { SNACKBAR_DURATION_DEFAULT } from '../../../../store/const';
import { EDIT_MODE, CREATE_AD_ITEM, GEO_DATA, CREATE_AD_MAIN } from '../../../../store/create_post/types';
import { getGeodata } from '../../../../services/VK';
import { getAdress, getMetro } from '../../../../services/geodata';
import { NoRegion } from '../../../../components/location/const';
import { CategoryNo, CategoryOnline } from '../../../../components/categories/const';
import { FORM_CREATE } from '../../../../components/categories/redux';
import { GetCategory400 } from '../../../../components/categories/Categories';
import { animateOnChange } from '../../../../components/image/image_cache';

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
	const { myUser, inputData } = props;

	const { openSnackbar, closeSnackbar, setGeoDataString, setGeoData, setFormData, setPage, openLicence } = props;

	const [geodata_string, set_geodata_string_i] = useState(
		(inputData[CREATE_AD_MAIN] && inputData[CREATE_AD_MAIN].geo_data_string) || ''
	);

	const set_geodata_string = (value) => {
		setFormData(CREATE_AD_MAIN, {
			...inputData[CREATE_AD_MAIN],
			geo_data_string: value,
		});
		set_geodata_string_i(value);
	};

	// refs
	const agreeRef = useRef();

	const [licenceAgree, setLicenceAgreeI] = useState(
		(inputData[CREATE_AD_MAIN] && inputData[CREATE_AD_MAIN].licenceAgree) || false
	);
	const [category, setCategory] = useState(CategoryNo);
	useEffect(() => {
		if (!inputData[FORM_CREATE]) {
			return;
		}
		setCategory(inputData[FORM_CREATE].category);
	}, [inputData[FORM_CREATE]]);

	const setLicenceAgree = (value) => {
		setFormData(CREATE_AD_MAIN, {
			...inputData[CREATE_AD_MAIN],
			licenceAgree: value,
		});
		setLicenceAgreeI(value);
	};

	const [errorHeader, setErrorHeader] = useState('');
	const [errorText, setErrorText] = useState('');
	const [valid, setValid] = useState(false);
	const [addOffset, setAddOffset] = useState(0);
	const needEdit = inputData[EDIT_MODE] ? inputData[EDIT_MODE].mode : false;

	const [notShow, setNotShow] = useState(false);

	const [validPlace, setValidPlace] = useState(geodata_string != '');
	const [saveValidPlace, setSaveValidPlace] = useState('');

	useEffect(() => {
		let cleanupFunction = false;
		let { v, header, text } = props.isValid(inputData);
		var l = needEdit ? true : licenceAgree;
		var p = needEdit || category == CategoryOnline ? true : validPlace;
		if (v && !l) {
			v = l;
			text = 'Прочтите и согласитель с правилами использования';
		} else if (v && !p) {
			v = p;
			header = 'Указанное место не существует';
			text = 'Пожалуйста измените адрес получения вещи';
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
	}, [inputData, licenceAgree, validPlace]);

	const ON_REFRESH_CLICK = 'ON_REFRESH_CLICK';
	const ON_SUGGESTION_CLICK = 'ON_SUGGESTION_CLICK';
	const NO_CLICK = 'NO_CLICK';
	const NO_PLACE = [-999, -999];

	const [mapState, setMapState] = useState({ center: [2.75, 2.57], zoom: 9, controls: [] });
	const [place, setPlace] = useState(NO_PLACE);
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
							setValidPlace(true);
							setSaveValidPlace(data_string);
							setNeedRefreshL(true);
							setTimeout(() => {
								setNeedRefreshL(false);
							}, 50);

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
				Пожалуйста, заполните все поля корректно.
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

	const [width, setWidth] = useState(document.body.clientWidth - 15);
	const [ymapsL, setYmapsL] = useState({});

	const [isGeoDataOkComponent, setIsGeoDataOkComponent] = useState(<></>);
	useEffect(() => {
		setIsGeoDataOkComponent(
			<div className="create-geodata-status">
				<div style={{ display: needEdit || isLoading ? 'none' : null }}>
					{animateOnChange(
						validPlace ? (
							<Icon24DoneOutline style={{ color: 'var(--button_commerce_background)' }} />
						) : (
							<Icon24Cancel style={{ color: 'var(--destructive)' }} />
						)
					)}
				</div>
			</div>
		);
	}, [validPlace, isLoading]);

	const [dadataComponent, setDadataComponent] = useState(<></>);
	useEffect(() => {
		if (needRefreshL) {
			setDadataComponent(<></>);
			return;
		}
		setDadataComponent(
			<div
				style={{
					height: '24px',
					transition: '0.3s',
					width: `${width - 40}px`,
				}}
			>
				<ReactDadata
					style={{
						transition: '0.3s',
						width: `${width - 40}px`,
					}}
					disabled={needEdit}
					token={'efb37d1dc6b04c11116d3ab7ef9482fa13e0b664'}
					query={geodata_string}
					onChange={(e) => {
						setGeoDataString(e.value);
						set_geodata_string(e.value);
						setDadataB(ON_SUGGESTION_CLICK);
						setValidPlace(true);
						setSaveValidPlace(e.value);

						const city_title = e.data.city ? e.data.city : e.data.region ? e.data.region : NoRegion.title;
						setFormData(FORM_LOCATION_CREATE, {
							...inputData[FORM_LOCATION_CREATE],
							country: { id: 1, title: e.data.country },
							city: { id: 1, title: city_title },
						});

						findMetro(ymapsL, e.value);
						setIsLoading(false);

						// if (!e.data.geo_lat) {
						// 	getMetro(e.data.postal_code);
						// }
						// setMapState({ ...mapState, center: [e.geo_lat, e.geo_long] });
					}}
					validate={(value) => {
						if (value != saveValidPlace || saveValidPlace == '') {
							setValidPlace(false);
						} else if (value == saveValidPlace) {
							setValidPlace(true);
						}
					}}
					autocomplete={geodata_string}
					placeholder={'Введите адрес'}
				/>
			</div>
		);
	}, [needRefreshL, isLoading, ymapsL, validPlace, saveValidPlace]);
	const [mapsComponent, setMapsComponent] = useState(<></>);
	useEffect(() => {
		setMapsComponent(
			<div style={{ marginTop: '14px' }}>
				<div style={{ display: place == NO_PLACE ? 'none' : null }}>
					<YMaps
						style={{ display: 'none' }}
						// style={{ display: place == NO_PLACE ? 'hidden' : null }}
						query={{ apikey: '7f6269fb-0f48-4182-bd23-13b3cb155a06' }}
					>
						<Map
							width={width - 16}
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
				</div>

				{place == NO_PLACE && (
					<Placeholder
						style={{ whiteSpace: 'normal' }}
						icon={<Icon56PlaceOutline />}
						header="Местоположение не задано"
					>
						Если вы видите данное сообщение, значит у вас в профиле не указан ваш город или вы указали
						несуществующее место
					</Placeholder>
				)}
				{/* )} */}
			</div>
		);
	}, [place, mapState, width]);

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
					style={{ padding: '0px' }}
					header={
						<Cell
							style={{ padding: '0px' }}
							multiline
							description="Кликни по полю ввода, чтобы указать свое местоположение, или по иконке, чтобы определить его автоматически"
						>
							<div style={{ fontWeight: 600 }}>Где забрать вещь</div>
						</Cell>
					}
				>
					<Div>
						<div style={{ display: 'flex', position: 'relative', alignItems: 'center' }}>
							<div style={{ marginTop: '12px' }}>
								<Icon24Place
									onClick={() => {
										setDadataB(ON_REFRESH_CLICK);
									}}
									width={32}
									height={32}
									style={{ cursor: 'pointer', marginRight: '12px' }}
									fill="var(--accent)"
								/>
							</div>

							{dadataComponent}
							{isGeoDataOkComponent}

							<div
								style={{
									transition: '0.3s',
									opacity: isLoading ? '1' : '0',
									height: '40px',
									paddingTop: '14px',
									paddingLeft: '10px',
								}}
							>
								<Spinner size="small" />
							</div>
						</div>

						{mapsComponent}
					</Div>
				</Group>
			)}

			<ChooseFeedback />
			<ChooseType />
			{/** ref={agreeRef} */}
			{needEdit ? null : (
				<div ref={agreeRef}>
					<FormLayout>
						<Checkbox
							style={{ cursor: 'pointer' }}
							checked={licenceAgree}
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
							<Button
								style={{ cursor: 'pointer' }}
								onClick={editAd}
								mode={valid ? 'commerce' : 'secondary'}
								size="l"
								stretched
							>
								Сохранить
							</Button>
						) : (
							<Button
								style={{ cursor: 'pointer' }}
								onClick={createAd}
								mode={valid ? 'commerce' : 'secondary'}
								size="l"
								stretched
							>
								Добавить
							</Button>
						)}
					</Div>
				)}
			</Transition>
		</div>
	);
};

export default CreateAddRedux;

// 609 -> 462 -> 321 -> 348 -> 282 -> 126 -> 494
