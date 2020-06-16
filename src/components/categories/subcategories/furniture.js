import React, { useState } from 'react';
import { Group, Cell, Header, List, FormLayout, FormLayoutGroup, Radio, SelectMimicry, Avatar } from '@vkontakte/vkui';

// export const SubCategoryAnimals = 'animals';
// export const CategoryAnother = 'another';
// export const CategoryBooks = 'books';
// export const CategoryFurniture = 'build';
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

export const gFurniture1 = 'Столы';
export const s1Furniture1 = 'Компьютерные и письменные столы';
export const s1Furniture2 = 'Парты';
export const s1Furniture3 = 'Журналные столы';
export const s1Furniture4 = 'Кухонные столы';
export const s1Furniture5 = 'Подставки и столы для ноутбуков';
export const s1Furniture6 = 'Туалетные столики';
export const s1Furniture7 = 'Классические столы';

export const gFurniture2 = 'Стулья';
export const s2Furniture1 = 'Скамьи';
export const s2Furniture2 = 'Табуретки';
export const s2Furniture3 = 'Барные стулья';
export const s2Furniture4 = 'Детские стулья';
export const s2Furniture5 = 'Компьютерные стулья';
export const s2Furniture6 = 'Вращающияся стулья';
export const s2Furniture7 = 'Столярные стулья';
export const s2Furniture8 = 'Стулья-седло';
export const s2Furniture9 = 'Консольные стулья';
export const s2Furniture10 = 'Классические стулья';

export const gFurniture3 = 'Шкафы, комоды, полки';
export const s3Furniture1 = 'Шкафы';
export const s3Furniture2 = 'Комоды';
export const s3Furniture3 = 'Полки';
export const s3Furniture4 = 'Обувницы';
export const s3Furniture5 = 'Стеллажи и этажерки';
export const s3Furniture6 = 'Тумбы';
export const s3Furniture7 = 'Сундуки';
export const s3Furniture8 = 'Секретеры';

export const gFurniture4 = 'Мягкая мебель';
export const s4Furniture1 = 'Диваны и кушетки';
export const s4Furniture2 = 'Кресла';
export const s4Furniture3 = 'Матрасы';
export const s4Furniture4 = 'Кресла-мешки';
export const s4Furniture5 = 'Пуфики';
export const s4Furniture6 = 'Кровати';

export const gFurniture5 = 'Надувная, плетеная и прочая мебель';
export const s5Furniture1 = 'Надувная мебедб';
export const s5Furniture2 = 'Плетеная мебедь';
export const s5Furniture3 = 'Раскладушки';
export const s5Furniture4 = 'Зеркала';
export const s5Furniture5 = 'Детский манеж';

export const FurnitureStruct = {
	grouping: true,
	showAll: false,
	getTextFunc: null,
	getImageFunc: null,
	filterFunc: null,
	show: 3,
	data: [
		{
			header: gFurniture1,
			array: [s1Furniture1, s1Furniture2, s1Furniture3, s1Furniture4, s1Furniture5, s1Furniture6, s1Furniture7],
		},
		{
			header: gFurniture2,
			array: [
				s2Furniture1,
				s2Furniture2,
				s2Furniture3,
				s2Furniture4,
				s2Furniture5,
				s2Furniture6,
				s2Furniture7,
				s2Furniture8,
				s2Furniture9,
				s2Furniture10,
			],
		},
		{
			header: gFurniture3,
			array: [
				s3Furniture1,
				s3Furniture2,
				s3Furniture3,
				s3Furniture4,
				s3Furniture5,
				s3Furniture6,
				s3Furniture7,
				s3Furniture8,
			],
		},
		{
			header: gFurniture4,
			array: [s4Furniture1, s4Furniture2, s4Furniture3, s4Furniture4, s4Furniture5, s4Furniture6],
		},
		{
			header: gFurniture5,
			array: [s5Furniture1, s5Furniture2, s5Furniture3, s5Furniture4, s5Furniture5],
		},
	],
};
