import React from 'react';
import { ActionSheet, ActionSheetItem, osname, IOS, Snackbar, Avatar } from '@vkontakte/vkui';

import { deleteAd } from './../../story/create/CreateAdd';

import { Draft } from './../../../store/draft';

import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';

import { CancelClose, adVisible, adHide } from './../../../requests';

function OpenActions(setPopout, setSnackbar, refresh, ad_id, onCloseClick, isClosing, hidden, subs_length) {
	console.log('props.ad.ad_id', ad_id);
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
						console.log("subs_length", subs_length)
						if (subs_length == 0) {
							setSnackbar(
								<Snackbar
									onClose={() => {
										setSnackbar(null);
									}}
									before={
										<Avatar size={24} style={{ background: 'red' }}>
											<Icon24Cancel fill="#fff" width={14} height={14} />
										</Avatar>
									}
								>
									Невозможно выбрать человека для завершения, так как никто ещё не откликнулся на ваше объявление.
								</Snackbar>
							);
							return
						}
						onCloseClick();
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
