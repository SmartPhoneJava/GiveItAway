import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { NoRegion } from './../location/const';
import Location from './../location/label';

import { setFormData } from '../../store/create_post/actions';
import { ADS_FILTERS, ADS_FILTERS_B } from '../../store/create_post/types';
import { closeAllModals, setPage, closeModal } from '../../store/router/actions';
import { PANEL_COUNTRIES, PANEL_CITIES } from '../../store/router/panelTypes';

import { Slider, Input, FormLayout, Radio, FormStatus, withModalRootContext, Div, Spinner } from '@vkontakte/vkui';
import { getGeodata } from '../../services/VK';
import { pushToCache } from '../../store/cache/actions';
import { DIRECTION_BACK } from '../../store/router/directionTypes';
import { SaveCancelButtons } from './ad_sort';

const { GEO_TYPE_FILTERS, GEO_TYPE_NEAR, GEO_TYPE_NO } = require('../../const/ads');

export const getGeoFilters = (data) => {
	if (!data || data == undefined) {
		return 'везде';
	}

	const { geotype, radius } = data;
	const country = data.country || NoRegion;
	const city = data.city || NoRegion;

	if (geotype == GEO_TYPE_NO) {
		return 'везде';
	}
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
	return 'рядом (' + radius + ' км)';
};

const ModalPageAdsGeoInner = (props) => {
	const { setFormData, closeAllModals, setPage, inputData, pushToCache, closeModal } = props;

	const [geoType, setGeoType] = useState(GEO_TYPE_NO);
	const [changed, setChanged] = useState(false);
	const [loading, setLoading] = useState(false);
	const [radius, setRadius] = useState(0.5);
	const [valid, setValid] = useState(true);

	function setRadiusR(v) {
		setRadius(v);
		setChanged(true);
	}

	function load(WHERE) {
		const inputData = props.inputData;
		if (!inputData[WHERE]) {
			return;
		}

		if (inputData[WHERE].geotype) {
			setGeoType(inputData[WHERE].geotype);
		}
		if (inputData[WHERE].radius) {
			setRadius(inputData[WHERE].radius);
		}
		if (inputData[WHERE].changed) {
			setChanged(true);
		}
	}

	useEffect(() => {
		props.updateModalHeight();
	}, [changed, valid, props.direction]);

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
			changed: true,
		});
		setChanged(true);
		setGeoType(GEO_TYPE_FILTERS);
	}

	function setGeoNo() {
		setFormData(ADS_FILTERS_B, {
			...inputData[ADS_FILTERS_B],
			geotype: GEO_TYPE_NO,
		});
		setChanged(geoType != GEO_TYPE_NO);
		setGeoType(GEO_TYPE_NO);
	}

	function setGeoNear() {
		setLoading(true);
		getGeodata(
			(success) => {
				setValid(true);
				setFormData(ADS_FILTERS_B, {
					...inputData[ADS_FILTERS_B],
					geotype: GEO_TYPE_NEAR,
				});
				setChanged(geoType != GEO_TYPE_NEAR);
				setGeoType(GEO_TYPE_NEAR);
				setLoading(false);
			},
			(err) => {
				setValid(false);
				setLoading(false);
			}
		);
	}

	function openCountries() {
		closeAllModals();
		setPage(PANEL_COUNTRIES);
	}

	function openCities() {
		closeAllModals();
		setPage(PANEL_CITIES);
	}

	function save() {
		const to = ADS_FILTERS;
		const from = ADS_FILTERS_B;

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
			<Radio
				style={{ cursor: 'pointer' }}
				name="radio"
				value={GEO_TYPE_NO}
				checked={geoType == GEO_TYPE_NO}
				onChange={setGeoNo}
			>
				Везде
			</Radio>
			<Radio
				style={{ cursor: 'pointer' }}
				name="radio"
				value={GEO_TYPE_FILTERS}
				checked={geoType == GEO_TYPE_FILTERS}
				onChange={setGeoFilters}
			>
				В определенном городе
			</Radio>
			<div style={{ display: 'flex' }}>
				<Radio
					style={{ cursor: 'pointer' }}
					name="radio"
					checked={geoType == GEO_TYPE_NEAR}
					value={GEO_TYPE_NEAR}
					onChange={setGeoNear}
					description="Необходимо предоставить доступ к GPS"
				>
					Недалеко от меня
				</Radio>

				{loading && (
					<Div className="right">
						<Spinner size="small" />
					</Div>
				)}
			</div>

			<div>
				{geoType == GEO_TYPE_FILTERS ? (
					<Location
						redux_form={ADS_FILTERS_B}
						openCountries={openCountries}
						openCities={() => {
							setGeoFilters();
							openCities();
						}}
					/>
				) : (
					geoType == GEO_TYPE_NEAR && (
						<FormLayout>
							<Slider
								style={{ cursor: 'pointer' }}
								step={0.5}
								min={0.5}
								max={100}
								value={radius}
								onChange={setRadiusR}
								top={'Область поиска: ' + radius + ' км'}
							/>
							<Input
								placeholder="радиус круга поиска"
								status={isRadiusValid() ? 'valid' : 'error'}
								bottom={!isRadiusValid() ? 'Введите число километров от 0.5 до 100' : ''}
								value={String(radius)}
								onChange={(e) => setRadiusR(e.target.value)}
								type="number"
							/>
						</FormLayout>
					)
				)}
				{!valid && (
					<Div>
						<FormStatus header="Нет доступа к GPS" mode={valid ? 'default' : 'error'}>
							Проверьте, что у вас включена геолокация и вы предоставили сервису доступ к нему.
						</FormStatus>
					</Div>
				)}
				{changed && SaveCancelButtons(save, closeModal)}
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
	closeModal,
};

export const ModalPageAdsGeo = withModalRootContext(connect(mapStateToProps, mapDispatchToProps)(ModalPageAdsGeoInner));

// 106 -> 220 -> 239
