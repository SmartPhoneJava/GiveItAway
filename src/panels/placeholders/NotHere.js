import React from 'react';
import { Placeholder, Button, Avatar } from '@vkontakte/vkui';

import VK150 from './../../img/vk150.png';

const NotHere = () => {
	return (
		<Placeholder
			action={
				<Button
					size="l"
					onClick={() => {
						window.open('https://vk.com/app7360033_45863670', '_blank');
					}}
				>
					Перейти в ВК
				</Button>
			}
			icon={<Avatar style={{background:"var(--background_content)"}} size={60} src={VK150}></Avatar>}
			header="Мы здесь!"
		></Placeholder>
	);
};

export default NotHere;
