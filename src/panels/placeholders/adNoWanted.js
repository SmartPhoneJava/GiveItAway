import React from 'react';
import { Placeholder, Button } from '@vkontakte/vkui';

import Icon56ErrorOutline from '@vkontakte/icons/dist/56/error_outline';

const AdNoWanted = (props) => {
	return (
		<Placeholder
			style={{ whiteSpace: 'normal' }}
			icon={<Icon56ErrorOutline />}
			header="Пусто"
			action={
				<Button style={{ cursor: 'pointer' }} onClick={() => props.setAllMode()} size="l">
					Назад
				</Button>
			}
		>
			В этом разделе находятся объявления, на которые вы подписались.
		</Placeholder>
	);
};

export default AdNoWanted;
