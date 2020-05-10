import React from 'react';
import { ActionSheet, ActionSheetItem, usePlatform, IOS, Snackbar, Avatar } from '@vkontakte/vkui';
import { connect } from 'react-redux';

import { Draft } from './../../../store/draft';

import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';

import { getSubscribers } from './../../../requests';

import { CancelClose, adVisible, adHide, deleteAd } from './../../../requests';
import { SNACKBAR_DURATION_DEFAULT } from '../../../store/const';
import { closePopout, openPopout, openSnackbar } from '../../../store/router/actions';

const OpenActions = (props) => {
	const osname = usePlatform();
	const {
		closePopout,
		openPopout,
		openSnackbar,
		refresh,
		ad_id,
		onCloseClick,
		isClosing,
		hidden,
		failedOpen,
	} = props;

	return (
		<ActionSheet onClose={closePopout}>
			{isClosing ? (
				<ActionSheetItem
					autoclose
					onClick={() => {
						CancelClose(ad_id);
						Draft.dispatch({ type: 'set', new_state: 'CANCEL_CLOSE_REQUEST' });
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
							},
							(e) => {
								openSnackbar(
									<Snackbar
										duration={SNACKBAR_DURATION_DEFAULT}
										onClose={() => {
											openSnackbar(null);
											if (failedOpen) {
												failedOpen();
											}
										}}
										before={
											<Avatar size={24} style={{ background: 'red' }}>
												<Icon24Cancel fill="#fff" width={14} height={14} />
											</Avatar>
										}
									>
										Невозможно выбрать человека для завершения, так как никто ещё не откликнулся на
										ваше объявление.
									</Snackbar>
								);
							}
						);
					}}
				>
					Объявить завершенным
				</ActionSheetItem>
			)}

			{hidden ? (
				<ActionSheetItem
					autoclose
					onClick={() => {
						adVisible(ad_id, () => {
							Draft.dispatch({ type: 'set', new_state: 'SET_VISIBLE' });
						});
					}}
				>
					Сделать видимым
				</ActionSheetItem>
			) : (
				<ActionSheetItem
					autoclose
					onClick={() => {
						adHide(ad_id, () => {
							Draft.dispatch({ type: 'set', new_state: 'SET_HIDEN' });
						});
					}}
				>
					Скрыть
				</ActionSheetItem>
			)}

			<ActionSheetItem autoclose mode="destructive" onClick={() => deleteAd(ad_id, refresh)}>
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
	openPopout,
	openSnackbar,
};

export default connect(mapStateToProps, mapDispatchToProps)(OpenActions);
