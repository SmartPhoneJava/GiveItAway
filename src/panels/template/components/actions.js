import React from 'react';
import { ActionSheet, ActionSheetItem, osname, IOS, Snackbar, Avatar } from '@vkontakte/vkui';

import { Draft } from './../../../store/draft';

import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';

import { getSubscribers } from './../../../requests';

import { CancelClose, adVisible, adHide, deleteAd } from './../../../requests';
import { SNACKBAR_DURATION_DEFAULT } from '../../../store/const';

function OpenActions(setPopout, setSnackbar, refresh, ad_id, onCloseClick, isClosing, hidden, failedOpen) {
	setPopout(
		<ActionSheet onClose={() => setPopout(null)}>
			{isClosing ? (
				<ActionSheetItem
					autoclose
					onClick={() => {
						CancelClose(setPopout, setSnackbar, ad_id);
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
							setPopout,
							setSnackbar,
							ad_id,
							(subs) => {
								onCloseClick();
							},
							(e) => {
								setSnackbar(
									<Snackbar
										duration={SNACKBAR_DURATION_DEFAULT}
										onClose={() => {
											setSnackbar(null);
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
						adVisible(setPopout, setSnackbar, ad_id, () => {
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
						adHide(setPopout, setSnackbar, ad_id, () => {
							Draft.dispatch({ type: 'set', new_state: 'SET_HIDEN' });
						});
					}}
				>
					Скрыть
				</ActionSheetItem>
			)}

			<ActionSheetItem
				autoclose
				mode="destructive"
				onClick={() => {
					deleteAd(setPopout, ad_id, setSnackbar, refresh);
				}}
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
}

export default OpenActions;
