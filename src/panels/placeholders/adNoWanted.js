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
				<Button onClick={() => props.setAllMode()} size="l">
					Назад
				</Button>
			}
		>
			Нажимай "Хочу забрать" в обьявлениях, чтобы увидеть их здесь.
		</Placeholder>
	);
};

export default AdNoWanted;
