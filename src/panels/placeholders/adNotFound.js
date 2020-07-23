import React from 'react';
import { Placeholder, Button } from '@vkontakte/vkui';

import Icon56ErrorOutline from '@vkontakte/icons/dist/56/error_outline';

const AdNotFound = (props) => {
	return (
		<Placeholder
			style={{ whiteSpace: 'normal' }}
			icon={<Icon56ErrorOutline />}
			header="Упс &#128566;"
			action={
				<Button onClick={props.dropFilters} size="l">
					Сбросить фильтры
				</Button>
			}
		>
			Кажется ничего не удалось найти. Попробуйте изменить фильтры, чтобы найти больше объявлений!
		</Placeholder>
	);
};

export default AdNotFound;
