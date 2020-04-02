import React from 'react';
import { ModalRoot, ModalPage, Group, Header, FormLayout, FormLayoutGroup, Radio } from '@vkontakte/vkui';

import { CategoriesRB, CategoriesLabel } from './../../template/Categories';

import { ModalHeader } from './../../headers/modal';

import { Location } from './../../template/Location';

export const MODAL_FILTERS = 'filters';
export const MODAL_CATEGORIES = 'categories';

const AddsModal = props => {
	function hideModal() {
		props.setActiveModal(null);
	}

	return (
		<ModalRoot activeModal={props.activeModal}>
			<ModalPage
				id={MODAL_FILTERS}
				onClose={hideModal}
				header={<ModalHeader name="Фильтры" back={() => hideModal()} />}
			>
				<CategoriesLabel category={props.category} open={() => props.setActiveModal(MODAL_CATEGORIES)} />
				{Location(
					props.appID,
					props.apiVersion,
					props.vkPlatform,
					props.country,
					props.setCountry,
					props.city,
					props.setCity, 
					false
				)}
				<Group separator="show" header={<Header mode="secondary">Отсортировтаь по</Header>}>
					{props.sort == 'time' ? (
						<div>
							{' '}
							<Radio
								key="1"
								value="time"
								name="sort"
								defaultChecked
								onClick={e => {
									props.setSort(e.currentTarget.value);
								}}
							>
								По времени
							</Radio>
							<Radio
								key="2"
								value="geo"
								name="sort"
								onClick={e => {
									props.setSort(e.currentTarget.value);
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
								onClick={e => {
									props.setSort(e.currentTarget.value);
								}}
							>
								По времени
							</Radio>
							<Radio
								key="4"
								value="geo"
								name="sort"
								defaultChecked
								onClick={e => {
									props.setSort(e.currentTarget.value);
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
				header={<ModalHeader name="Выберите категорию" back={() => props.setActiveModal(MODAL_FILTERS)} />}
				settlingHeight={80}
			>
				<CategoriesRB
					category={props.category}
					choose={cat => {
						props.setCategory(cat);
						props.setActiveModal(MODAL_FILTERS);
					}}
				/>
			</ModalPage>
		</ModalRoot>
	);
};

export default AddsModal;
