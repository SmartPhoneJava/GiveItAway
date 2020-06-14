import React, { useState } from 'react';
import { Group, Cell, Header, List, FormLayout, FormLayoutGroup, Radio, SelectMimicry, Avatar } from '@vkontakte/vkui';

// export const SubCategoryAnimals = 'animals';
// export const CategoryAnother = 'another';
// export const CategoryBooks = 'books';
// export const CategoryBooks = 'Books';
// export const CategoryClothers = 'clothers';
// export const CategoryCosmetic = 'cosmetic';
// export const CategoryElectronics = 'electronics';
// export const CategoryFlora = 'flora';
// export const CategoryFood = 'food';
// export const CategoryFurniture = 'furniture';
// export const CategoryMusic = 'music';
// export const CategoryOld = 'old';
// export const CategoryPencil = 'pencil';
// export const CategoryPlay = 'play';
// export const CategorySport = 'sport';

export const gBooks1 = 'Развитие и образование';
export const s1Books1 = 'Историческая литература';
export const s1Books2 = 'Наука и образование';
export const s1Books3 = 'Детская литература';
export const s1Books4 = 'Дом, семья, быт';
export const s1Books5 = 'Бизнес и экономика';
export const s1Books6 = 'Психология';
export const s1Books7 = 'Культура и искусство';
export const s1Books8 = 'Медицина';
export const s1Books9 = 'Словари, справочники и энциклопедии';
export const s1Books10 = 'Астрология, эзотерика, религия';
export const s1Books11 = 'Юридическая литература';
export const s1Books12 = 'Литература про компьютеры и интернет';
export const s1Books13 = 'Техническая литература';

export const gBooks2 = 'Досуг и хобби';
export const s2Books1 = 'Художественная литература';
export const s2Books2 = 'Комиксы и манга';
export const s2Books3 = 'Подарочные издания';
export const s2Books4 = 'Мир увлечений';

export const gBooks3 = 'Другое';
export const s3Books1 = 'Журналы и газеты';
export const s3Books2 = 'Фотоальбомы';
export const s3Books3 = 'Биографии и автобиографии';
export const s3Books4 = 'Дневники и письма';
export const s3Books5 = 'Календари';

export const BooksStruct = {
	grouping: true,
	showAll: false,
	getTextFunc: null,
	getImageFunc: null,
	filterFunc: null,
	show: 5,
	data: [
		{
			header: gBooks1,
			array: [
				s1Books1,
				s1Books2,
				s1Books3,
				s1Books4,
				s1Books5,
				s1Books6,
				s1Books7,
				s1Books8,
				s1Books9,
				s1Books10,
				s1Books11,
				s1Books12,
				s1Books13,
			],
		},
		{
			header: gBooks2,
			array: [s2Books1, s2Books2, s2Books3, s2Books4],
		},
		{
			header: gBooks3,
			array: [s3Books1, s3Books2, s3Books3, s3Books4, s3Books5],
		},
	],
};
