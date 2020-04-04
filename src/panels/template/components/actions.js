import React from 'react';
import { ActionSheet, ActionSheetItem, osname, IOS } from '@vkontakte/vkui';

import { deleteAd } from './../../story/create/CreateAdd';

function OpenActions(setPopout, setSnackbar, refresh, ad_id, onCloseClick) {
	setPopout(
		<ActionSheet onClose={() => setPopout(null)}>
			<ActionSheetItem
				autoclose
				onClick={onCloseClick}
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
