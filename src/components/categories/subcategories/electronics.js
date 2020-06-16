import React, { useState } from 'react';
import { Group, Cell, Header, List, FormLayout, FormLayoutGroup, Radio, SelectMimicry, Avatar } from '@vkontakte/vkui';

// export const SubCategoryAnimals = 'animals';
// export const CategoryAnother = 'another';
// export const CategoryBooks = 'books';
// export const CategoryElectronics = 'build';
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

export const gElectronics1 = 'Портативная техника';
export const s1Electronics1 = 'Смартфоны';
export const s1Electronics2 = 'Планшеты';
export const s1Electronics3 = 'Кнопочные мобильные телефоны';
export const s1Electronics4 = 'Умные часы и браслеты';
export const s1Electronics5 = 'Наушники и bluetooth-гарнитура';
export const s1Electronics6 = 'Портативная акустика';
export const s1Electronics7 = 'Очки виртуальной реальности';
export const s1Electronics8 = 'Умные колонки';
export const s1Electronics9 = 'Комплектующие для портативной техники';

export const gElectronics7 = 'Аксессуары';
export const s7Electronics1 = 'Моноподы и пульты для селфи';
export const s7Electronics2 = 'Аккумуляторы';
export const s7Electronics3 = 'Держатели мобильных устройств';
export const s7Electronics4 = 'Док-станции';
export const s7Electronics5 = 'Чехлы';
export const s7Electronics6 = 'защитные пленки и стекла';
export const s7Electronics7 = 'Зарядные устройства и адаптеры';
export const s7Electronics8 = 'Кабели для зарядки';
export const s7Electronics9 = 'Антенны и усилители сигнала';
export const s7Electronics10 = 'Объективы';
export const s7Electronics11 = 'Подвески';
export const s7Electronics12 = 'Стилусы';
export const s7Electronics13 = 'Ремешки для умных часов';
export const s7Electronics14 = 'Универсальные внешние аккумуляторы';
export const s7Electronics15 = 'Подставки для мобильных устройств';

export const gElectronics2 = 'Аудио- и видеотехника';
export const s2Electronics1 = 'Телевизоры и плазменные панели';
export const s2Electronics2 = 'Аудиотехника';
export const s2Electronics3 = 'ТВ-приставки и медиаплееры';
export const s2Electronics4 = 'Проекторы';
export const s2Electronics5 = 'Комплектующие для аудио- и видеотехники';
export const s2Electronics6 = 'DVD и Blu-ray плееры';
export const s2Electronics7 = 'Домашние кинотеатры';
export const s2Electronics8 = 'Системы MultiRoom';
export const s2Electronics9 = 'Спутниковое и кабельное телевидение';

export const gElectronics3 = 'Компьютеры';
export const s3Electronics1 = 'Ноутбуки';
export const s3Electronics2 = 'Настольные';
export const s3Electronics3 = 'Моноблоки';
export const s3Electronics4 = 'Промышленные';
export const s3Electronics5 = 'Игровые приставки';
export const s3Electronics6 = 'Комплектующие для компьютеров';

export const gElectronics4 = 'Перифийные устройства';
export const s4Electronics1 = 'Мониторы';
export const s4Electronics2 = 'Мыши';
export const s4Electronics3 = 'Клавиатуры';
export const s4Electronics4 = 'Компьютерные гарнитуры';

export const gElectronics5 = 'Оргтехника';
export const s5Electronics1 = 'Принтеры и МФУ';
export const s5Electronics2 = 'Сканеры';
export const s5Electronics3 = 'Факсы';
export const s5Electronics4 = 'Проекторы';
export const s5Electronics5 = 'Копиры и дупликаторы';

export const gElectronics6 = 'Расходные материалы';
export const s6Electronics1 = 'Картриджи';
export const s6Electronics2 = 'Бумага и пленка';
export const s6Electronics3 = 'Чистящие принадлежности';
export const s6Electronics4 = 'Расходные материалы для ламинаторов';

export const gElectronics8 = 'Фото- и видеокамеры';
export const s8Electronics1 = 'Фотоаппараты';
export const s8Electronics2 = 'Экшн-камеры';
export const s8Electronics3 = 'Видеокамеры';
export const s8Electronics4 = 'Квадрокоптеры';

export const gElectronics9 = 'Умный дом';
export const s9Electronics1 = 'Бытовая техника';
export const s9Electronics2 = 'Освещение и электрика';
export const s9Electronics3 = 'Электроника';
export const s9Electronics4 = 'Безопасность';
export const s9Electronics5 = 'Климат';

export const ElectronicsStruct = {
	grouping: true,
	showAll: false,
	getTextFunc: null,
	getImageFunc: null,
	filterFunc: null,
	show: 3,
	data: [
		{
			header: gElectronics1,
			array: [
				s1Electronics1,
				s1Electronics2,
				s1Electronics3,
				s1Electronics4,
				s1Electronics5,
				s1Electronics6,
				s1Electronics7,
				s1Electronics8,
				s1Electronics9,
			],
		},
		{
			header: gElectronics2,
			array: [
				s2Electronics1,
				s2Electronics2,
				s2Electronics3,
				s2Electronics4,
				s2Electronics5,
				s2Electronics6,
				s2Electronics7,
				s2Electronics8,
				s2Electronics9,
			],
		},
		{
			header: gElectronics3,
			array: [s3Electronics1, s3Electronics2, s3Electronics3, s3Electronics4, s3Electronics5, s3Electronics6],
		},
		{
			header: gElectronics4,
			array: [s4Electronics1, s4Electronics2, s4Electronics3, s4Electronics4],
		},
		{
			header: gElectronics5,
			array: [s5Electronics1, s5Electronics2, s5Electronics3, s5Electronics4, s5Electronics5],
		},
		{
			header: gElectronics6,
			array: [s6Electronics1, s6Electronics2, s6Electronics3, s6Electronics4],
		},
		{
			header: gElectronics7,
			array: [
				s7Electronics1,
				s7Electronics2,
				s7Electronics3,
				s7Electronics4,
				s7Electronics5,
				s7Electronics6,
				s7Electronics7,
				s7Electronics8,
				s7Electronics9,
				s7Electronics10,
				s7Electronics11,
				s7Electronics12,
				s7Electronics13,
				s7Electronics14,
				s7Electronics15,
			],
		},
		{
			header: gElectronics8,
			array: [s8Electronics1, s8Electronics2, s8Electronics3, s8Electronics4],
		},
		{
			header: gElectronics9,
			array: [s9Electronics1, s9Electronics2, s9Electronics3, s9Electronics4, s9Electronics5],
		},
	],
};
