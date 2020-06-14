import React, { useState } from 'react';
import { Group, Cell, Header, List, FormLayout, FormLayoutGroup, Radio, SelectMimicry, Avatar } from '@vkontakte/vkui';

// export const SubCategoryAnimals = 'animals';
// export const CategoryAnother = 'another';
// export const CategoryBooks = 'books';
// export const CategoryBuild = 'build';
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

export const gBuild1 = 'Ванная комната';
export const s1Build1 = 'Ванны и комплектующие';
export const s1Build2 = 'Душевые кабины и уголки';
export const s1Build3 = 'Душевые поддоны';
export const s1Build4 = 'Душевое оборудование';
export const s1Build5 = 'Смесители';
export const s1Build6 = 'Унитазы, писсуары, биде';
export const s1Build7 = 'Раковины';
export const s1Build8 = 'Сифоны и трапы';
export const s1Build9 = 'Вспомогательные материалы для сантехнических работ';
export const s1Build10 = 'Ревизионные люки';
export const s1Build11 = 'Аксессуары для ванной и туалета';
export const s1Build12 = 'Сушилки для рук';
export const s1Build13 = 'Гофры и отводы для унитазов';

export const gBuild3 = 'Вентиляционные системы и очистка воздуха';
export const s3Build1 = 'Вентиляторы вытяжные';
export const s3Build2 = 'Вентиляционные установки';
export const s3Build3 = 'Воздуховоды';
export const s3Build4 = 'Канальные вентиляторы';
export const s3Build5 = 'Фильтры';

export const gBuild4 = 'Водоснабжение';
export const s4Build1 = 'Водонагреватели';
export const s4Build2 = 'Насосная группа';
export const s4Build3 = 'Баки для воды';
export const s4Build4 = 'Водоочистка';
export const s4Build5 = 'Системы защиты';
export const s4Build6 = 'Коллекторы и коллекторные группы';
export const s4Build7 = 'Расширительные баки и комплектующие';
export const s4Build8 = 'Котельное оборудование';
export const s4Build9 = 'Теплоноситель';
export const s4Build10 = 'Водопроводные трубы и фитинги';
export const s4Build11 = 'Запорная арматура';
export const s4Build12 = 'Трубы и фитинги';
export const s4Build13 = 'Инструменты для прочистки труб';
export const s4Build14 = 'Счетчики воды';
export const s4Build15 = 'Комплектующие для водоснабжения';

export const gBuild5 = 'Лакокрасочные материалы';
export const s5Build1 = 'Краски';
export const s5Build2 = 'Лаки';
export const s5Build3 = 'Эмали';
export const s5Build4 = 'Антисептики';
export const s5Build5 = 'Пропитки';
export const s5Build6 = 'Масла и воск';
export const s5Build7 = 'Морилки';
export const s5Build8 = 'Аэрозольная краска';
export const s5Build9 = 'Строительные очистители';
export const s5Build10 = 'Растворители';
export const s5Build11 = 'Малярные инструменты';

export const gBuild6 = 'Отделочные материалы и декор';
export const s6Build1 = 'Обои';
export const s6Build2 = 'Фотообои';
export const s6Build3 = 'Клей для обоев';

export const gBuild7 = 'Крепеж';
export const s7Build1 = 'Анкерные болты';
export const s7Build2 = 'Винты и болты';
export const s7Build3 = 'Шурупы и саморезы';
export const s7Build4 = 'Гвозди';
export const s7Build5 = 'Перфорированный крепеж';
export const s7Build6 = 'Дюбели';

export const gBuild8 = 'Дверная фурнитура';
export const s8Build1 = 'Замки навесные';
export const s8Build2 = 'Замки накладные';
export const s8Build3 = 'Ручки дверные';
export const s8Build4 = 'Защелки и завертки';
export const s8Build5 = 'Петли дверные';

export const gBuild9 = 'Мебель для ванной комнаты';
export const s9Build1 = 'Тумбы';
export const s9Build2 = 'Зеркала';
export const s9Build3 = 'Шкафы';

export const gBuild10 = 'Общестроительные материалы';
export const s10Build1 = 'Клеящиеся ленты для строительных работ';
export const s10Build2 = 'Монтажные пены и очистители';
export const s10Build3 = 'Добавки в строительные смеси и растворы';
export const s10Build4 = 'Кладочные и гидроизоляционные смеси';
export const s10Build5 = 'Клеи';
export const s10Build6 = 'Герметики';
export const s10Build7 = 'Строительные тенты';

export const gBuild11 = 'Электрика';
export const s11Build1 = 'Автоматика';
export const s11Build2 = 'Кабель';
export const s11Build3 = 'Щиты и шкафы';
export const s11Build4 = 'Стабилизаторы напряжения';
export const s11Build5 = 'Розетки, выключатели и рамки';
export const s11Build6 = 'Электроудлинители, сетевые фильтры и переходники';
export const s11Build7 = 'Электромонтажные работы';
export const s11Build8 = 'Электрогенераторы';
export const s11Build9 = 'Трансформаторы';
export const s11Build10 = 'Звонки';
export const s11Build11 = 'Счетчики электроэнергии';
export const s11Build12 = 'Домофоны и вызывные панели';
export const s11Build13 = 'Переносные светильники';
export const s11Build14 = 'Аварийное освещение';

export const gBuild12 = 'Инструменты';
export const s12Build1 = 'Электроинструменты';
export const s12Build2 = 'Оснастка для электроинструмента';
export const s12Build3 = 'Оборудование для мастерской';
export const s12Build4 = 'Измерительная техника';
export const s12Build5 = 'Пневмоинструменты и аксессуары';
export const s12Build6 = 'Строительная техника';
export const s12Build7 = 'Ручные инструменты';
export const s12Build8 = 'Организация рабочего места';

export const BuildStruct = {
	grouping: true,
	showAll: false,
	getTextFunc: null,
	getImageFunc: null,
	filterFunc: null,
	show: 3,
	data: [
		{
			header: gBuild1,
			array: [
				s1Build1,
				s1Build2,
				s1Build3,
				s1Build4,
				s1Build5,
				s1Build6,
				s1Build7,
				s1Build8,
				s1Build9,
				s1Build10,
				s1Build11,
				s1Build12,
				s1Build13,
			],
		},
		{
			header: gBuild3,
			array: [s3Build1, s3Build2, s3Build3, s3Build4, s3Build5],
		},
		{
			header: gBuild4,
			array: [
				s4Build1,
				s4Build2,
				s4Build3,
				s4Build4,
				s4Build5,
				s4Build6,
				s4Build7,
				s4Build8,
				s4Build9,
				s4Build10,
				s4Build11,
				s4Build12,
				s4Build13,
				s4Build14,
				s4Build15,
			],
		},
		{
			header: gBuild5,
			array: [
				s5Build1,
				s5Build2,
				s5Build3,
				s5Build4,
				s5Build5,
				s5Build6,
				s5Build7,
				s5Build8,
				s5Build9,
				s5Build10,
				s5Build11,
			],
		},
		{
			header: gBuild6,
			array: [s6Build1, s6Build2, s6Build3],
		},
		{
			header: gBuild7,
			array: [s7Build1, s7Build2, s7Build3, s7Build4, s7Build5, s7Build6],
		},
		{
			header: gBuild8,
			array: [s8Build1, s8Build2, s8Build3, s8Build4, s8Build5],
		},
		{
			header: gBuild9,
			array: [s9Build1, s9Build2, s9Build3],
		},
		{
			header: gBuild10,
			array: [s10Build1, s10Build2, s10Build3, s10Build4, s10Build5, s10Build6, s10Build7],
		},
		{
			header: gBuild11,
			array: [
				s11Build1,
				s11Build2,
				s11Build3,
				s11Build4,
				s11Build5,
				s11Build6,
				s11Build7,
				s11Build8,
				s11Build9,
				s11Build10,
				s11Build11,
				s11Build12,
				s11Build13,
				s11Build14,
			],
		},
		{
			header: gBuild12,
			array: [s12Build1, s12Build2, s12Build3, s12Build4, s12Build5, s12Build6, s12Build7, s12Build8],
		},
	],
};
