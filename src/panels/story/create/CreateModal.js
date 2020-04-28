import React from 'react';
import { ModalRoot, ModalPage } from '@vkontakte/vkui';

import { ModalHeader } from '../../headers/modal';

export const MODAL_FILTERS = 'filters';
export const MODAL_CATEGORIES = 'categories';

const CreateModal = (props) => {
	return (
		<ModalRoot activeModal={props.activeModal}>
			<ModalPage
				id={MODAL_CATEGORIES}
				onClose={() => props.setActiveModal(null)}
				header={<ModalHeader name="Выберите категорию" back={() => props.setActiveModal(null)} />}
				settlingHeight={80}
			></ModalPage>
		</ModalRoot>
	);
};

export default CreateModal;
