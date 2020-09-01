import React, { useState, useEffect } from 'react';
import { ModalRoot, ModalPage, Cell, List, Avatar, InfoRow, ModalCard, CellButton } from '@vkontakte/vkui';

import Freeze100 from './../../../img/100/freeze.png';

import { ModalHeader } from './../../headers/modal';

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
	MODAL_ADS_SORT,
} from './../../../store/router/modalTypes';

import { STORY_ADS } from '../../../store/router/storyTypes';

import { getUser } from '../profile/requests';
import { getAdType } from '../../../components/detailed_ad/faq';
import { ModalCardCaptionAdsType } from '../../../components/modal/ad_type';
import { ModalPageAdsGeo } from '../../../components/modal/geo_filter';
import { ModalPageAdsSort } from '../../../components/modal/ad_sort';
import { AdFilters } from '../../../components/modal/ad_filters';
import { ADS_FILTERS, ADS_FILTERS_ON } from '../../../store/create_post/types';

const AddsModal = (props) => {
	const { closeModal, openCarma, inputData } = props;
	const [backUser, setBackUser] = useState();

	const activeModal = props.activeModals[STORY_ADS];

	const cost = props.ad.cost || 0;
	const isSubscriber = props.ad.isSub || 0;

	useEffect(() => {
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
				dynamicContentHeight
				header={
					<ModalHeader
						name="Фильтры"
						back={closeModal}
						right={
							inputData[ADS_FILTERS_ON] &&
							inputData[ADS_FILTERS_ON].filtersOn && (
								<CellButton
									onClick={() => {
										props.closeModal();
										props.setFormData(ADS_FILTERS, null);
									}}
									mode="danger"
									style={{ cursor: 'pointer' }}
								>
									Сбросить
								</CellButton>
							)
						}
					/>
				}
			>
				<AdFilters />
			</ModalPage>
			<ModalPage
				id={MODAL_ADS_CATEGORIES}
				onClose={closeModal}
				header={<ModalHeader isBack={true} name="Категории" back={closeModal} />}
			></ModalPage>
			<ModalPage
				id={MODAL_ADS_GEO}
				onClose={closeModal}
				dynamicContentHeight
				header={<ModalHeader isBack={true} name="Где искать?" back={closeModal} />}
			>
				<ModalPageAdsGeo />
			</ModalPage>
			<ModalPage
				id={MODAL_ADS_SORT}
				onClose={closeModal}
				dynamicContentHeight
				header={<ModalHeader isBack={true} name="Применить сортировку" back={closeModal} />}
			>
				<ModalPageAdsSort />
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
						<InfoRow header={isSubscriber ? 'Останется после отписки' : 'Станет доступно после подписки'}>
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
					'указанная сумма будет заморожена. Откажитесь ' +
					'от объявления, чтобы разморозить её.'
				}
				actions={[
					{
						title: 'Моя карма',
						mode: 'primary',
						action: openCarma,
					},
					{
						title: 'Назад',
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

// 373 -> 273 -> 406 -> 517 -> 343 -> 262 -> 200 -> 177
