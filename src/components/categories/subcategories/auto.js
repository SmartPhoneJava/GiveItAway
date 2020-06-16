import React, { useState } from 'react';
import { Group, Cell, Header, List, FormLayout, FormLayoutGroup, Radio, SelectMimicry, Avatar } from '@vkontakte/vkui';

// export const SubCategoryAnimals = 'animals';
// export const CategoryAnother = 'another';
// export const CategoryBooks = 'books';
// export const CategoryAuto = 'build';
// export const CategoryClothers = 'clothers';
// export const CategoryCosmetic = 'cosmetic';
// export const CategoryAuto = 'electronics';
// export const CategoryFlora = 'flora';
// export const CategoryFood = 'food';
// export const CategoryFurniture = 'furniture';
// export const CategoryMusic = 'music';
// export const CategoryOld = 'old';
// export const CategoryPencil = 'pencil';
// export const CategoryPlay = 'play';
// export const CategorySport = 'sport';

export const gAuto1 = 'Шины и диски';
export const s1Auto1 = 'Шины';
export const s1Auto2 = 'Колесные диски';
export const s1Auto3 = 'Грузовые шины';
export const s1Auto4 = 'Мотошины';
export const s1Auto5 = 'Цепи противоскольжения';
export const s1Auto6 = 'Колесные болты и секретки';
export const s1Auto7 = 'Камеры и ободные ленты';

export const gAuto2 = 'Аудио- и видеотехника';
export const s2Auto1 = 'Автомагнитолы';
export const s2Auto2 = 'Автоакустика';
export const s2Auto3 = 'Усилители';
export const s2Auto4 = 'Автомобильные телевизоры';
export const s2Auto5 = 'Антенны';
export const s2Auto6 = 'Аксессуары';
export const s2Auto7 = 'Акустические полки, короба и подиумы';
export const s2Auto8 = 'Переходные рамки';
export const s2Auto9 = 'Шумоизоляция';
export const s2Auto10 = 'Автомобильные инверторы';

export const gAuto3 = 'Масла и технические жидкости';
export const s3Auto1 = 'Моторные масла';
export const s3Auto2 = 'Масло трансмиссионное';
export const s3Auto3 = 'Антифризы';
export const s3Auto4 = 'Смазки';
export const s3Auto5 = 'Тормозные жидкости';
export const s3Auto6 = 'Присадки и промывки';
export const s3Auto7 = 'Специальные масла';
export const s3Auto8 = 'Воронки';

export const gAuto4 = 'Аксессуары и оборудование';
export const s4Auto1 = 'Щетки стеклоочистителей';
export const s4Auto2 = 'Детские автокресла';
export const s4Auto3 = 'Коврики';
export const s4Auto4 = 'Багажные системы';
export const s4Auto5 = 'Защита и внешний тюнинг';
export const s4Auto6 = 'Автомобильные холодильники';
export const s4Auto7 = 'Необходимый набор автомобилиста';
export const s4Auto8 = 'Обустройство салона';
export const s4Auto9 = 'Обогреватели двигателя и салона';
export const s4Auto10 = 'Инвентарь для ухода';
export const s4Auto11 = 'Огнетушители';
export const s4Auto12 = 'Лебедки';
export const s4Auto13 = 'Цепи противоскольжения';
export const s4Auto14 = 'Алкотестеры';

export const gAuto5 = 'Автомобильные инструменты';
export const s5Auto1 = 'Автомобильные компрессоры';
export const s5Auto2 = 'Домкраты и подставки';
export const s5Auto3 = 'Манометры';
export const s5Auto4 = 'Наборы инструментов и оснастки';
export const s5Auto5 = 'Толщиномеры';
export const s5Auto6 = 'Ключи';
export const s5Auto7 = 'Отвертки';
export const s5Auto8 = 'Плоскогубцы';
export const s5Auto9 = 'Пассатижи';
export const s5Auto10 = 'Прочие инструменты';
export const s5Auto11 = 'Фонари';
export const s5Auto12 = 'Насосы для подкачки шин';
export const s5Auto13 = 'Мойки высокого давления';

export const gAuto6 = 'Противоугонные устройства';
export const s6Auto1 = 'Автосигнализации';
export const s6Auto2 = 'Механические блокираторы';
export const s6Auto3 = 'Иммобилайзеры';
export const s6Auto4 = 'Противоугонные комплексы';
export const s6Auto5 = 'Брелоки и чехлы';
export const s6Auto6 = 'Аксессуары';

export const gAuto7 = 'Электроника';
export const s7Auto1 = 'Видеорегистраторы';
export const s7Auto2 = 'Радар-детекторы';
export const s7Auto3 = 'Парктроники';
export const s7Auto4 = 'Бортовые компьютеры';
export const s7Auto5 = 'Камеры заднего вида';
export const s7Auto6 = 'Автомобильные радиостанции';
export const s7Auto7 = 'Алкотестеры';
export const s7Auto8 = 'Устройства громкой связи';
export const s7Auto9 = 'Зарядные устройства для телефонов';
export const s7Auto10 = 'Адаптеры для ноутбуков';
export const s7Auto11 = 'Автомобильные инверторы';
export const s7Auto12 = 'Разветвители прикуривателя';
export const s7Auto13 = 'Автомобильные видеоинтерфейсы и навигационные блоки';
export const s7Auto14 = 'Транспондеры и аксессуары';

export const gAuto8 = 'Мототехника';
export const s8Auto1 = 'Снегоходы';
export const s8Auto2 = 'Ветровые стекла';
export const s8Auto3 = 'Скутеры';
export const s8Auto4 = 'Мотоциклы';
export const s8Auto5 = 'Экипировка и защита';

export const gAuto9 = 'Запчасти';
export const s9Auto1 = 'Аккумуляторы';
export const s9Auto2 = 'Автосвет';
export const s9Auto3 = 'Фильтры';
export const s9Auto4 = 'Подвеска';
export const s9Auto5 = 'Свечи зажигания';
export const s9Auto6 = 'Тормозная система';
export const s9Auto7 = 'Кузовные детали';

export const gAuto10 = 'Автохимия и автокосметика';
export const s10Auto1 = 'Ароматизаторы салона';
export const s10Auto2 = 'Уход за салоном';
export const s10Auto3 = 'Уход за стеклами и фарами';
export const s10Auto4 = 'Уход за шинами и дисками';
export const s10Auto5 = 'Уход за кузовом';
export const s10Auto6 = 'Технические очистители';
export const s10Auto7 = 'Клеи, герметики и фиксаторы';
export const s10Auto8 = 'Для малярных работ';

export const AutoStruct = {
	grouping: true,
	showAll: false,
	getTextFunc: null,
	getImageFunc: null,
	filterFunc: null,
	show: 3,
	data: [
		{
			header: gAuto1,
			array: [s1Auto1, s1Auto2, s1Auto3, s1Auto4, s1Auto5, s1Auto6, s1Auto7],
		},
		{
			header: gAuto2,
			array: [s2Auto1, s2Auto2, s2Auto3, s2Auto4, s2Auto5, s2Auto6, s2Auto7, s2Auto8, s2Auto9, s2Auto9, s2Auto10],
		},
		{
			header: gAuto3,
			array: [s3Auto1, s3Auto2, s3Auto3, s3Auto4, s3Auto5, s3Auto6, s3Auto7, s3Auto8],
		},
		{
			header: gAuto4,
			array: [
				s4Auto1,
				s4Auto2,
				s4Auto3,
				s4Auto4,
				s4Auto5,
				s4Auto6,
				s4Auto7,
				s4Auto8,
				s4Auto9,
				s4Auto10,
				s4Auto11,
				s4Auto12,
				s4Auto13,
				s4Auto14,
			],
		},
		{
			header: gAuto5,
			array: [
				s5Auto1,
				s5Auto2,
				s5Auto3,
				s5Auto4,
				s5Auto5,
				s5Auto6,
				s5Auto7,
				s5Auto8,
				s5Auto9,
				s5Auto10,
				s5Auto11,
				s5Auto12,
				s5Auto13,
			],
		},
		{
			header: gAuto6,
			array: [s6Auto1, s6Auto2, s6Auto3, s6Auto4, s6Auto5, s6Auto6],
		},
		{
			header: gAuto7,
			array: [
				s7Auto1,
				s7Auto2,
				s7Auto3,
				s7Auto4,
				s7Auto5,
				s7Auto6,
				s7Auto7,
				s7Auto8,
				s7Auto9,
				s7Auto10,
				s7Auto11,
				s7Auto12,
				s7Auto13,
				s7Auto14,
			],
		},
		{
			header: gAuto8,
			array: [s8Auto1, s8Auto2, s8Auto3, s8Auto4, s8Auto5],
		},
		{
			header: gAuto9,
			array: [s9Auto1, s9Auto2, s9Auto3, s9Auto4, s9Auto5, s9Auto6, s9Auto7],
		},
		{
			header: gAuto10,
			array: [s10Auto1, s10Auto2, s10Auto3, s10Auto4, s10Auto5, s10Auto6, s10Auto7, s10Auto8],
		},
	],
};
