import React from 'react';
import { ActionSheet, ActionSheetItem, usePlatform, IOS, Snackbar, Avatar } from '@vkontakte/vkui';
import { connect } from 'react-redux';

import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';

import { getSubscribers } from './../../../requests';

import { CancelClose, adVisible, adHide, deleteAd } from './../../../requests';
import { SNACKBAR_DURATION_DEFAULT } from '../../../store/const';
import { closePopout, openSnackbar, closeSnackbar, openPopout } from '../../../store/router/actions';
import { STATUS_CHOSEN, TYPE_CHOICE, STATUS_OFFER } from '../../../const/ads';
import { deleteAlert } from '../AddMore2';

const OpenActions = (props) => {
	const osname = usePlatform();
	const { closePopout, openPopout, openSnackbar, closeSnackbar, refresh, ad, onCloseClick, isAdmin } = props;

	const { ad_id, ad_type, hidden, status } = ad;

	console.log('we get this add', ad);

	return (
		<ActionSheet onClose={closePopout}>
			{/* 			
			{ad_type == TYPE_CHOICE ? (
				status == STATUS_CHOSEN ? (
					<ActionSheetItem
						autoclose
						onClick={() => {
							CancelClose(ad_id, () => {
								props.setStatus(STATUS_OFFER);
							});
						}}
					>
						Отменить запрос подтверждения
					</ActionSheetItem>
				) : (
					<ActionSheetItem
						autoclose
						onClick={() => {
							getSubscribers(
								ad_id,
								(subs) => {
									onCloseClick();
									props.setStatus(STATUS_CHOSEN);
								},
								(e) => {
									openSnackbar(
										<Snackbar
											duration={SNACKBAR_DURATION_DEFAULT}
											onClose={closeSnackbar}
											before={
												<Avatar size={24} style={{ background: 'red' }}>
													<Icon24Cancel fill="#fff" width={14} height={14} />
												</Avatar>
											}
										>
											Невозможно выбрать человека для завершения, так как никто ещё не откликнулся
											на ваше объявление.
										</Snackbar>
									);
								},
								1
							);
						}}
					>
						Выбрать получателя
					</ActionSheetItem>
				)
			) : null} */}

			{isAdmin ? (
				hidden ? (
					<ActionSheetItem
						autoclose
						onClick={() => {
							adVisible(ad_id, () => props.setIsVisible(true));
						}}
					>
						Сделать видимым
					</ActionSheetItem>
				) : (
					<ActionSheetItem
						autoclose
						onClick={() => {
							adHide(ad_id, () => props.setIsVisible(false));
						}}
					>
						Скрыть
					</ActionSheetItem>
				)
			) : null}

			<ActionSheetItem
				autoclose
				mode="destructive"
				onClick={() =>
					openPopout(
						deleteAlert(() => {
							deleteAd(ad_id, refresh);
						}, closePopout)
					)
				}
			>
				Удалить
			</ActionSheetItem>
			{osname === IOS && (
				<ActionSheetItem autoclose mode="cancel">
					Отменить
				</ActionSheetItem>
			)}
		</ActionSheet>
	);
};

const mapStateToProps = (state) => {
	return {};
};

const mapDispatchToProps = {
	closePopout,
	openSnackbar,
	closeSnackbar,
	openPopout,
};

export default connect(mapStateToProps, mapDispatchToProps)(OpenActions);
