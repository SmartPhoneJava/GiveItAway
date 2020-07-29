import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { NoRegion } from './../location/const';
import Location from './../location/label';

import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24Done from '@vkontakte/icons/dist/24/done';

import { setFormData } from '../../store/create_post/actions';
import { ADS_FILTERS, ADS_FILTERS_B } from '../../store/create_post/types';
import { closeAllModals, setPage } from '../../store/router/actions';
import { PANEL_COUNTRIES, PANEL_CITIES } from '../../store/router/panelTypes';

import {
	Slider,
	Input,
	FormLayout,
	Radio,
	FormStatus,
	CellButton,
	Button,
	withModalRootContext,
} from '@vkontakte/vkui';
import { getGeodata } from '../../services/VK';
import { pushToCache } from '../../store/cache/actions';
import { DIRECTION_BACK } from '../../store/router/directionTypes';

const { GEO_TYPE_FILTERS, GEO_TYPE_NEAR } = require('../../const/ads');

export const getGeoFilters = (data) => {
	if (!data || data == undefined) {
		return 'везде';
	}
	const { geotype, radius } = data;
	const country = data.country || NoRegion;
	const city = data.city || NoRegion;

	if (geotype == GEO_TYPE_FILTERS) {
		if (country.id == NoRegion.id && city.id == NoRegion.id) {
			return 'везде';
		}
		if (city.id != NoRegion.id) {
			if (country.title == NoRegion.title) {
				return 'в городе: ' + city.title;
			}
			return 'в локации: ' + country.title + ', ' + city.title;
		}
		return 'в стране: ' + country.title;
	}
	if (radius == undefined) {
		return 'везде';
	}
	return 'рядом со мной в радиусе ' + radius + ' км';
};

const ModalPageAdsGeoInner = (props) => {
	const { setFormData, closeAllModals, setPage, inputData, pushToCache } = props;

	const [geoType, setGeoType] = useState(GEO_TYPE_NEAR);
	const [isGeoTypeFilters, setIsGeoTypeFilters] = useState(false);
	const [radius, setRadius] = useState(0.5);
	const [valid, setValid] = useState(true);

	function load(WHERE) {
		const inputData = props.inputData;
		if (!inputData[WHERE]) {
			return;
		}

		if (inputData[WHERE].geotype) {
			setGeoType(inputData[WHERE].geotype);
			setIsGeoTypeFilters(inputData[WHERE].geotype == GEO_TYPE_FILTERS);
		}
		if (inputData[WHERE].radius) {
			setRadius(inputData[WHERE].radius);
		}
	}

	useEffect(() => {
		if (props.direction == DIRECTION_BACK) {
			load(ADS_FILTERS_B);
		} else {
			setFormData(ADS_FILTERS_B, {
				...inputData[ADS_FILTERS],
			});
			load(ADS_FILTERS);
		}
	}, [props.direction]);

	function isRadiusValid() {
		return radius >= 0.5 && radius <= 100;
	}

	function setGeoFilters() {
		setFormData(ADS_FILTERS_B, {
			...inputData[ADS_FILTERS_B],
			geotype: GEO_TYPE_FILTERS,
		});
		setGeoType(GEO_TYPE_FILTERS);
        setIsGeoTypeFilters(true);
        props.updateModalHeight();
	}

	function setGeoNear() {
		getGeodata(
			(success) => {
				setValid(true);
				setFormData(ADS_FILTERS_B, {
					...inputData[ADS_FILTERS_B],
					geotype: GEO_TYPE_NEAR,
				});
				setGeoType(GEO_TYPE_NEAR);
                setIsGeoTypeFilters(false);
                props.updateModalHeight();
				// if (updateModalHeight) {
				// 	updateModalHeight();
				// }
			},
			(err) => {
				setValid(false);
				setGeoFilters();
			}
		);
	}

	useEffect(() => {
		getGeodata(
			(success) => {
				setValid(true);
			},
			(err) => {
				setValid(false);
			}
        );
        props.updateModalHeight();
	}, []);

	function openCountries() {
		closeAllModals();
		setPage(PANEL_COUNTRIES);
	}

	function openCities() {
		closeAllModals();
		setPage(PANEL_CITIES);
	}

	function save(FROM, TO) {
		const to = TO || ADS_FILTERS;
		const from = FROM || ADS_FILTERS_B;

		setFormData(to, {
			...inputData[to],
			geotype: geoType,
			radius,
			city: inputData[from] ? inputData[from].city : null,
			country: inputData[from] ? inputData[from].country : null,
		});
		pushToCache(true, 'ignore_cache');
		closeAllModals();
	}

	return (
		<>
			<Radio name="radio" value={GEO_TYPE_FILTERS} checked={isGeoTypeFilters} onChange={setGeoFilters}>
				В указанном городе
			</Radio>
			<Radio
				name="radio"
				checked={!isGeoTypeFilters}
				value={GEO_TYPE_NEAR}
				onChange={setGeoNear}
				description="Необходимо предоставить доступ к GPS"
			>
				Недалеко от меня
			</Radio>
			<div>
				{geoType == GEO_TYPE_FILTERS ? (
					<>
						<Location redux_form={ADS_FILTERS_B} openCountries={openCountries} openCities={openCities} />
						{valid ? null : (
							<div style={{ padding: '10px' }}>
								<FormStatus header="Нет доступа к GPS" mode={valid ? 'default' : 'error'}>
									Проверьте, что у вас включена геолокация и вы предоставили сервису доступ к нему.
								</FormStatus>
							</div>
						)}
					</>
				) : (
					<FormLayout>
						<Slider
							step={0.5}
							min={0.5}
							max={100}
							value={radius}
							onChange={setRadius}
							top={'Область поиска: ' + radius + ' км'}
						/>
						<Input
							placeholder="радиус круга поиска"
							status={isRadiusValid() ? 'valid' : 'error'}
							bottom={!isRadiusValid() ? 'Введите число километров от 0.5 до 100' : ''}
							value={String(radius)}
							onChange={(e) => setRadius(e.target.value)}
							type="number"
						/>
					</FormLayout>
				)}
				<div className="flex-center">
					<div style={{ display: 'flex' }}>
						<div style={{ padding: '8px', flex: 1 }}>
							<Button
								stretched
								size="l"
								mode="destructive"
								onClick={closeAllModals}
								before={<Icon24Cancel />}
							>
								Отменить
							</Button>
						</div>
						<div style={{ padding: '8px', flex: 1 }}>
							<Button stretched size="l" mode="primary" onClick={save} before={<Icon24Done />}>
								Сохранить
							</Button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

const mapStateToProps = (state) => {
	return {
		inputData: state.formData.forms,
		direction: state.router.direction,
	};
};

const mapDispatchToProps = {
	setFormData,
	closeAllModals,
	setPage,
	pushToCache,
};

export const ModalPageAdsGeo = withModalRootContext(connect(mapStateToProps, mapDispatchToProps)(ModalPageAdsGeoInner));

// 106 -> 220 -> 239
