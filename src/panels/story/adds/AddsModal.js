import React, { useState } from 'react';
import {
	ModalRoot,
	ModalPage,
	Group,
	Header,
	Slider,
	Cell,
	CellButton,
	Input,
	List,
	FormLayout,
	Avatar,
	InfoRow,
	Radio,
	ModalCard,
	FormStatus,
} from '@vkontakte/vkui';

import { AnimateOnChange, AnimateGroup } from 'react-animation';

import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';
import Icon24BrowserForward from '@vkontakte/icons/dist/24/browser_forward';

import Freeze100 from './../../../img/100/freeze.png';

import CategoriesLabel from './../../../components/categories/label';

import { ModalHeader } from './../../headers/modal';

import { NoRegion } from './../../../components/location/const';
import Location from './../../../components/location/label';

import { PeopleRB } from './../../template/People';
import { K } from '../profile/const';

import {
	MODAL_ADS_FILTERS,
	MODAL_ADS_GEO,
	MODAL_ADS_CATEGORIES,
	MODAL_ADS_SUBS,
	MODAL_ADS_COST,
	MODAL_ADS_FROZEN,
	MODAL_ADS_TYPES,
} from './../../../store/router/modalTypes';

import { ADS_FILTERS } from './../../../store/create_post/types';
import { STORY_ADS } from '../../../store/router/storyTypes';

import { GEO_TYPE_FILTERS, GEO_TYPE_NEAR, SORT_TIME, SORT_GEO } from './../../../const/ads';
import { useEffect } from 'react';
import { getUser } from '../profile/requests';
import { getAdType } from '../../../components/detailed_ad/faq';
import { ModalCardCaptionAdsType } from '../../../components/modal/ad_type';

const AddsModal = (props) => {
	const { closeModal, inputData } = props;
	const { openGeoSearch, openCountries, openCities, openCategories, openCarma } = props;
	const [backUser, setBackUser] = useState();
	const [valid, setValid] = useState(true);

	const applyTimeSort = () => props.applyTimeSort(inputData);
	const setRadius = (r) => props.setRadius(inputData, r, setValid);
	const applyGeoSort = () => props.applyGeoSort(inputData);

	const setGeoFilters = () => {
		props.setGeoFilters(inputData);
		if (props.updateModalHeight) {
			props.updateModalHeight();
		}
	};
	const setGeoNear = () => {
		props.setGeoNear(inputData, (v) => {
			console.log('valid is', v);
			setValid(v);
		});
		if (props.updateModalHeight) {
			props.updateModalHeight();
		}
	};

	const geoType = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].geotype : null) || GEO_TYPE_FILTERS;
	const radius = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].radius : null) || 0.5;
	const geodata = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].geodata : null) || null;
	const country = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].country : null) || NoRegion;
	const city = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].city : null) || NoRegion;
	const sort = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].sort : null) || SORT_TIME;
	const activeModal = props.activeModals[STORY_ADS];

	const cost = props.ad.cost || 0;
	const isSubscriber = props.ad.isSub || 0;

	useEffect(() => {
		console.log('user want update');
		let cleanupFunction = false;
		getUser(
			props.myID,
			(v) => {
				if (cleanupFunction) {
					return;
				}
				setBackUser(v);
			},
			(e) => {}
		);
		return () => {
			cleanupFunction = true;
		};
	}, [isSubscriber]);

	function isRadiusValid() {
		return radius >= 0.5 && radius <= 100;
	}

	function getGeoData() {
		if (geoType == GEO_TYPE_FILTERS) {
			if (country.id == NoRegion.id && city.id == NoRegion.id) {
				return 'Не задано';
			}
			if (city.id != NoRegion.id) {
				if (country.title == NoRegion.title) {
					return city.title;
				}
				return country.title + ', ' + city.title;
			}
			return country.title;
		}
		return 'В радиусе ' + radius + ' км';
	}

	function getCost() {
		if (!(props.ad && backUser)) {
			return 'Информация недоступна';
		}

		const c = isSubscriber ? cost : -cost;
		const v = backUser.carma - backUser.frozen_carma + c;
		return v + '' + K;
	}

	const [currentAdType, setCurrentAdType] = useState('');

	return (
		<ModalRoot activeModal={activeModal}>
			<ModalPage
				id={MODAL_ADS_FILTERS}
				onClose={closeModal}
				header={<ModalHeader name="Фильтры" back={closeModal} />}
			>
				<CategoriesLabel redux_form={ADS_FILTERS} leftMargin="10px" open={openCategories} />
				<Group separator="show" header={<Header mode="secondary">Местоположение объявления</Header>}>
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<CellButton onClick={openGeoSearch}>{getGeoData()}</CellButton>
						<div
							style={{
								alignItems: 'center',
								flex: 'center',
								justifyContent: 'center',
								marginRight: '20px',
								color: 'var(--accent)',
							}}
							onClick={openGeoSearch}
						>
							<Icon24BrowserForward />
						</div>
					</div>
				</Group>

				<Group separator="show" header={<Header mode="secondary">Отсортировать по</Header>}>
					<Radio
						checked={sort == SORT_TIME}
						key={SORT_TIME}
						value={SORT_TIME}
						name="sort"
						onChange={applyTimeSort}
					>
						По времени
					</Radio>
					<Radio
						checked={sort == SORT_GEO}
						key={SORT_GEO}
						value={SORT_GEO}
						name="sort"
						onChange={applyGeoSort}
					>
						По близости
					</Radio>
				</Group>
			</ModalPage>
			<ModalPage
				id={MODAL_ADS_CATEGORIES}
				onClose={closeModal}
				header={<ModalHeader isBack={true} name="Выберите категорию" back={closeModal} />}
			></ModalPage>
			<ModalPage
				id={MODAL_ADS_GEO}
				onClose={closeModal}
				dynamicContentHeight
				header={<ModalHeader isBack={true} name="Где искать?" back={closeModal} />}
			>
				<Radio
					name="radio"
					value={GEO_TYPE_FILTERS}
					checked={geoType == GEO_TYPE_FILTERS}
					onChange={setGeoFilters}
				>
					В указанном городе
				</Radio>
				<Radio
					name="radio"
					checked={geoType == GEO_TYPE_NEAR}
					value={GEO_TYPE_NEAR}
					onChange={setGeoNear}
					description="Необходимо предоставить доступ к GPS"
				>
					Недалеко от меня
				</Radio>
				<div>
					{geoType == GEO_TYPE_FILTERS ? (
						<>
							<Location redux_form={ADS_FILTERS} openCountries={openCountries} openCities={openCities} />
							{valid ? null : (
								<div style={{ padding: '10px' }}>
									<FormStatus header="Нет доступа к GPS" mode={valid ? 'default' : 'error'}>
										Проверьте, что у вас включена геолокация и вы предоставили сервису доступ к
										нему.
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
					<div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
						{/* <CellButton
							mode="danger"
							onClick={() => {
								props.setActiveModal(MODAL_FILTERS);
								// props.setRadius(cancelledRadius);
							}}
						>
							<div style={{ textAlign: 'center' }}>Отменить</div>
						</CellButton> */}
						{/* <CellButton mode="primary" onClick={closeModal}>
							Сохранить
						</CellButton> */}
					</div>
				</div>
			</ModalPage>
			<ModalPage
				id={MODAL_ADS_SUBS}
				onClose={closeModal}
				header={<ModalHeader name="Выберите человека" back={closeModal} />}
				dynamicContentHeight
			>
				<PeopleRB back={closeModal} />
			</ModalPage>
			<ModalPage
				onClose={closeModal}
				id={MODAL_ADS_COST}
				header={<ModalHeader name={isSubscriber ? 'Отказаться' : 'Хочу забрать!'} back={closeModal} />}
			>
				<List>
					<Cell>
						<InfoRow header="Моя карма">
							{backUser ? backUser.carma - backUser.frozen_carma + '' + K : 'Информация недоступна'}
						</InfoRow>
					</Cell>

					<Cell>
						<InfoRow
							header={isSubscriber ? 'Станет доступно после отписки' : 'Станет доступно после подписки'}
						>
							<div style={{ color: isSubscriber ? 'var(--accent)' : 'var(--destructive)' }}>
								{getCost()}
							</div>
						</InfoRow>
					</Cell>
					{/* <Cell>
						<InfoRow header="Заморожено в других обьявлениях">
							{props.backUser ? props.backUser.frozen_carma + '' + K : 'Информация недоступна'}
						</InfoRow>
					</Cell> */}
				</List>
			</ModalPage>
			<ModalCard
				id={MODAL_ADS_FROZEN}
				onClose={closeModal}
				icon={
					<Avatar mode="app" style={{ background: 'var(--background_content)' }} src={Freeze100} size={64} />
				}
				header={cost + K}
				caption={
					'Карма будет списана после того как вы ' +
					'подтвердите получение вещи. До тех пор ' +
					'указанная сумма будет заморожена. Откажитесь' +
					'от объявления, чтобы разморозить её.'
				}
				actions={[
					{
						title: 'Моя карма',
						mode: 'primary',
						action: openCarma,
					},
					{
						title: 'Подробнее',
						mode: 'secondary',
						action: closeModal,
					},
				]}
				actionsLayout="vertical"
			/>
			<ModalCardCaptionAdsType />
			<ModalCard
				id={MODAL_ADS_TYPES}
				onClose={closeModal}
				header={getAdType(currentAdType)}
				caption={<ModalCardCaptionAdsType updateType={setCurrentAdType} />}
			/>
		</ModalRoot>
	);
};

export default AddsModal;

// 373 -> 273 -> 406 -> 517 -> 343
