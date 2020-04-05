import React from 'react';
import { ActionSheet, ActionSheetItem, osname, IOS } from '@vkontakte/vkui';

import { deleteAd } from './../../story/create/CreateAdd';

import { CancelClose, adVisible, adHide } from './../../../requests';

function OpenActions(setPopout, setSnackbar, refresh, ad_id, onCloseClick, onUnCloseClick, isClosing, hidden) {
	console.log("props.ad.ad_id", ad_id,)
	setPopout(
		<ActionSheet onClose={() => setPopout(null)}>
			{isClosing ? (
				<ActionSheetItem
					autoclose
					onClick={() => {
						CancelClose(setPopout, setSnackbar, ad_id);
						onUnCloseClick();
					}}
				>
					Отменить запрос подтверждения
				</ActionSheetItem>
			) : (
				<ActionSheetItem
					autoclose
					onClick={() => {
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
						adVisible(setPopout, setSnackbar, ad_id);
					}}
				>
					Сделать видимым
				</ActionSheetItem>
			) : (
				<ActionSheetItem
					autoclose
					onClick={() => {
						adHide(setPopout, setSnackbar, ad_id);
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
