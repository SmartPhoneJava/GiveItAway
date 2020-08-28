import React from 'react';
import { ModalPageHeader, PanelHeaderButton, IS_PLATFORM_ANDROID, IS_PLATFORM_IOS } from '@vkontakte/vkui';

import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';

export const ModalHeader = (props) => {
	return (
		<ModalPageHeader
			left={
				IS_PLATFORM_ANDROID ? (
					<PanelHeaderButton style={{ cursor: 'pointer' }} onClick={() => props.back()}>
						{props.isBack ? <Icon24BrowserBack /> : <Icon24Cancel />}
					</PanelHeaderButton>
				) : (
					props.right
				)
			}
			right={
				<div className="flex-center">
					{IS_PLATFORM_IOS ? (
						<PanelHeaderButton style={{ cursor: 'pointer' }} onClick={() => props.back()}>
							<Icon24Dismiss />
						</PanelHeaderButton>
					) : (
						props.right
					)}
				</div>
			}
		>
			{props.name}
		</ModalPageHeader>
	);
};
