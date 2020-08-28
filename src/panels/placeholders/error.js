import React from 'react';
import { Placeholder, Button } from '@vkontakte/vkui';

import Icon56ErrorOutline from '@vkontakte/icons/dist/56/error_outline';

const Error = (props) => {
	return (
		<Placeholder
			style={{ background: 'var(--destructive)' }}
			icon={<Icon56ErrorOutline />}
			header="Сервер временно недоступен &#128560;"
			action={
				props.action ? (
					<Button style={{ cursor: 'pointer' }} onClick={() => props.action()} size="l">
						Повторить попытку
					</Button>
				) : (
					''
				)
			}
		>
			Мы работаем над тем, чтобы вернуть все в норму!
		</Placeholder>
	);
};

export default Error;
