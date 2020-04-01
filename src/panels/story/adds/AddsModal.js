import React from 'react';
import { ModalRoot, ModalPage } from '@vkontakte/vkui';

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
					props.region,
					props.setRegion,
					props.city,
					props.setCity
				)}
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
