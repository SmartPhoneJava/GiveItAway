import React from 'react';
import { Placeholder, Button } from '@vkontakte/vkui';

import Icon56ErrorOutline from '@vkontakte/icons/dist/56/error_outline';

const Error = props => {
	return (
		<Placeholder
			style={{ background: 'red' }}
			icon={<Icon56ErrorOutline />}
			header="Сервер временно не доступен &#128560;"
			action={
				props.action ? (
					<Button onClick={() => props.action()} size="l">
						Повторить попытку
					</Button>
				) : (
					''
				)
			}
			stretched={true}
		>
			Мы работаем над тем, чтобы вернуть все в норму!
		</Placeholder>
	);
};

export default Error;
