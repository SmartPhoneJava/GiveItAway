import React from 'react';
import { ActionSheet, ActionSheetItem, osname, IOS } from '@vkontakte/vkui';

import { deleteAd } from './../../story/create/CreateAdd';

function OpenActions(setPopout, setSnackbar, refresh, ad_id) {
	setPopout(
		<ActionSheet onClose={() => setPopout(null)}>
			<ActionSheetItem
				autoclose
				onClick={() => {
					deleteAd(setPopout, ad_id, setSnackbar, refresh);
				}}
			>
				Объявить завершенным
			</ActionSheetItem>
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
};

export default OpenActions;
