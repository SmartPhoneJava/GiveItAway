import React, { useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
	ModalRoot,
	ModalPage,
	Group,
	Header,
	Slider,
	Cell,
	CellButton,
	Input,
	FormLayout,
	FormLayoutGroup,
	Radio,
} from '@vkontakte/vkui';

import { CategoriesRB, CategoriesLabel } from './../../template/Categories';

import { ModalHeader } from './../../headers/modal';

import { Location, NoRegion } from './../../template/Location';

import { PeopleRB } from './../../template/People';

export const MODAL_FILTERS = 'filters';
export const MODAL_CATEGORIES = 'categories';
export const MODAL_GEO = 'geoposition';
export const MODAL_SUBS = 'subs';

export const GEO_TYPE_FILTERS = 'filters';
export const GEO_TYPE_NEAR = 'near';

const AddsModal = (props) => {
	// let geoType = GEO_TYPE_FILTERS

	// const [cancelledRadius, setCancelledRadius] = useState(props.radius);

	function hideModal() {
		props.setActiveModal(null);
	}

	function applyGeo(e) {
		props.setSort(e.currentTarget.value);
		bridge.send('VKWebAppGetGeodata').then((value) => {
			props.setGeodata(value);
			console.log('VKWebAppGetGeodata', value);
		});
	}

	function isRadiusValid() {
		return props.radius >= 0.5 && props.radius <= 100;
	}

	return (
		<ModalRoot activeModal={props.activeModal}>
			<ModalPage
				id={MODAL_FILTERS}
				onClose={hideModal}
				header={<ModalHeader name="Фильтры" back={() => hideModal()} />}
			>
				<CategoriesLabel
					leftMargin="10px"
					category={props.category}
					open={() => props.setActiveModal(MODAL_CATEGORIES)}
				/>
				<Group separator="show" header={<Header mode="secondary">Местоположение объявления</Header>}>
					<CellButton
						onClick={() => {
							props.setActiveModal(MODAL_GEO);
						}}
					>
						{props.geoType == GEO_TYPE_FILTERS
							? props.country == NoRegion && props.city == NoRegion
								? 'Не задано'
								: props.country != NoRegion && props.city != NoRegion
								? props.country.title + ', ' + props.city.title
								: props.country == NoRegion
								? props.city.title
								: props.country.title
							: 'Поиск по радиусу временно недоступен'}
					</CellButton>
				</Group>

				<Group separator="show" header={<Header mode="secondary">Отсортировтаь по</Header>}>
					{props.sort == 'time' ? (
						<div>
							{' '}
							<Radio
								key="1"
								value="time"
								name="sort"
								defaultChecked
								onClick={(e) => {
									props.setSort(e.currentTarget.value);
									props.setActiveModal(null);
								}}
							>
								По времени
							</Radio>
							<Radio
								key="2"
								value="geo"
								name="sort"
								onClick={(e) => {
									applyGeo(e);
									props.setActiveModal(null);
								}}
							>
								По близости
							</Radio>
						</div>
					) : (
						<div>
							<Radio
								key="3"
								value="time"
								name="sort"
								onClick={(e) => {
									props.setSort(e.currentTarget.value);
									props.setActiveModal(null);
								}}
							>
								По времени
							</Radio>
							<Radio
								key="4"
								value="geo"
								name="sort"
								defaultChecked
								onClick={(e) => {
									applyGeo(e);
									props.setActiveModal(null);
								}}
							>
								По близости
							</Radio>
						</div>
					)}
				</Group>
			</ModalPage>
			<ModalPage
				id={MODAL_CATEGORIES}
				onClose={() => props.setActiveModal(MODAL_FILTERS)}
				header={
					<ModalHeader
						isBack={true}
						name="Выберите категорию"
						back={() => props.setActiveModal(MODAL_FILTERS)}
					/>
				}
			>
				<CategoriesRB
					category={props.category}
					choose={(cat) => {
						props.setCategory(cat);
						props.setActiveModal(null);
					}}
				/>
			</ModalPage>
			<ModalPage
				id={MODAL_GEO}
				onClose={() => props.setActiveModal(MODAL_FILTERS)}
				header={
					<ModalHeader isBack={true} name="Где искать?" back={() => props.setActiveModal(MODAL_FILTERS)} />
				}
			>
				<Radio
					name="radio"
					value={GEO_TYPE_FILTERS}
					defaultChecked={props.geoType == GEO_TYPE_FILTERS}
					onClick={(e) => {
						props.setGeoType(GEO_TYPE_FILTERS);
					}}
				>
					В указанных стране и городе
				</Radio>
				<Radio
					name="radio"
					defaultChecked={props.geoType == GEO_TYPE_NEAR}
					value={GEO_TYPE_NEAR}
					onClick={(e) => {
						props.setGeoType(GEO_TYPE_NEAR);
					}}
					description="Необходимо предоставить доступ к GPS"
				>
					Недалеко от меня
				</Radio>
				<div>
					{props.geoType == GEO_TYPE_FILTERS ? (
						Location(
							props.appID,
							props.apiVersion,
							props.vkPlatform,
							props.country,
							props.setCountry,
							props.city,
							props.setCity,
							false
						)
					) : (
						<FormLayout>
							<Slider
								step={0.5}
								min={0.5}
								max={100}
								value={props.radius}
								onChange={(v) => props.setRadius(v)}
								top={'Область поиска: ' + props.radius + ' км'}
							/>
							<Input
								placeholder="радиус круга поиска"
								status={isRadiusValid() ? 'valid' : 'error'}
								bottom={!isRadiusValid() ? 'Введите число километров от 0.5 до 100' : ''}
								value={String(props.radius)}
								onChange={(e) => props.setRadius(e.target.value)}
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
						<CellButton
							mode="primary"
							onClick={() => {
								props.setActiveModal(null);
							}}
						>
							Сохранить
						</CellButton>
					</div>
				</div>
			</ModalPage>
			<ModalPage
				id={MODAL_SUBS}
				onClose={() => props.setActiveModal(null)}
				header={<ModalHeader name="Выберите человека" back={() => props.setActiveModal(null)} />}
				dynamicContentHeight
			>
				<PeopleRB
					setPopout={props.setPopout}
					setSnackbar={props.setSnackbar}
					ad_id={props.ad.ad_id}
					back={(s) => {
						props.setActiveModal(null);
					}}
				/>
			</ModalPage>
		</ModalRoot>
	);
};

export default AddsModal;
