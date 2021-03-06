import React from 'react';
import { Placeholder, Button } from '@vkontakte/vkui';

import Icon56ErrorOutline from '@vkontakte/icons/dist/56/error_outline';

const AdNoGiven = (props) => {
	return (
		<Placeholder
			style={{ whiteSpace: 'normal' }}
			icon={<Icon56ErrorOutline />}
			header="Пусто"
			action={
				<Button style={{ cursor: 'pointer' }} onClick={props.setAllMode} size="l">
					Назад
				</Button>
			}
		>
			В этой ленте отображаются объявления, созданные вами.
		</Placeholder>
	);
};

export default AdNoGiven;
