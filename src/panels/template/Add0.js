import React from 'react';
import { Cell, Avatar, Button, Div, Card, CardGrid, Counter } from '@vkontakte/vkui';

import Icon24MoreHorizontal from '@vkontakte/icons/dist/24/more_horizontal';
import Icon24CommentOutline from '@vkontakte/icons/dist/24/comment_outline';

import { GetCategoryImage } from './Categories';

import './addsTab.css';

const Add0 = props => {
	return (
		<div
			style={{
				height: '400px',
				backgroundImage: 'url(' + props.ava + ')',
			}}
		></div>
	);
};

export default Add0;
