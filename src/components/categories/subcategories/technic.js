import React, { useState } from 'react';
import { Group, Cell, Header, List, FormLayout, FormLayoutGroup, Radio, SelectMimicry, Avatar } from '@vkontakte/vkui';

// export const SubCategoryAnimals = 'animals';
// export const CategoryAnother = 'another';
// export const CategoryBooks = 'books';
// export const CategoryTechnic = 'build';
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

export const gTechnic1 = 'Крупная техника для кухни';
export const s1Technic1 = 'Холодильники';
export const s1Technic2 = 'Посудомоечные машины';
export const s1Technic3 = 'Плиты';
export const s1Technic4 = 'Вытяжки';
export const s1Technic5 = 'Морозильники';
export const s1Technic6 = 'Винные шкафы';
export const s1Technic7 = 'Подогреватели посуды';
export const s1Technic8 = 'Кулеры для воды и питьевые фонтанчики';
export const s1Technic9 = 'Фильтры для вытяжек';
export const s1Technic10 = 'Фильтры и умягчители для воды';

export const gTechnic2 = 'Техника для дома';
export const s2Technic1 = 'Пылесосы';
export const s2Technic2 = 'Веники и швабры';
export const s2Technic2 = 'Электровеники и электрошвабры';
export const s2Technic3 = 'Стиральный машины';
export const s2Technic4 = 'Утюги';
export const s2Technic5 = 'Парогенераторы';
export const s2Technic6 = 'Сушильные машины';
export const s2Technic7 = 'Отпариватели';
export const s2Technic8 = 'Техника для ухода за одеждой';

export const gTechnic3 = 'Климатическая техника';
export const s3Technic1 = 'Кондиционеры';
export const s3Technic2 = 'Водонагреватели';
export const s3Technic3 = 'Вентиляторы';
export const s3Technic4 = 'Климатизаторы';
export const s3Technic5 = 'Очистители и увлажнители воздуха';
export const s3Technic6 = 'Осушители воздуха';
export const s3Technic7 = 'Системы центрального кондиционирования';
export const s3Technic8 = 'Комплектующие для кондиционеров';
export const s3Technic9 = 'Ионизаторы';
export const s3Technic10 = 'Цифровые метеостанции';
export const s3Technic11 = 'Обогреватели';
export const s3Technic12 = 'Отопительные котлы';
export const s3Technic13 = 'Климатическое оборудование';

export const gTechnic4 = 'Встраиваемая техника';
export const s4Technic1 = 'Духовые шкафы';
export const s4Technic2 = 'Варочные панели';
export const s4Technic3 = 'Морозильники';
export const s4Technic4 = 'Винные шкафы';
export const s4Technic5 = 'Подогреватели посуды';
export const s4Technic6 = 'Измельчатили пищевых отходов';

export const gTechnic5 = 'Мелкая техника для кухни';
export const s5Technic1 = 'Кофеварки и кофемашины';
export const s5Technic2 = 'Микроволновые печи';
export const s5Technic3 = 'Электрочайники и термопоты';
export const s5Technic4 = 'Блендеры';
export const s5Technic5 = 'Мультиварки';
export const s5Technic6 = 'Мясорубки';
export const s5Technic7 = 'Приготовление напитков';
export const s5Technic8 = 'Измельчение и смешивание';
export const s5Technic9 = 'Приготовление блюд';
export const s5Technic10 = 'Прочая техника';

export const gTechnic6 = 'Техника для красоты';
export const s6Technic1 = 'Фены и фен-щётки';
export const s6Technic2 = 'Щипцы, плойки и выпрямители';
export const s6Technic3 = 'Машинки для стрижки и триммеры';
export const s6Technic4 = 'Электробритвы мужскиеры';
export const s6Technic5 = 'Эпиляторы и женские электробритвы';
export const s6Technic6 = 'Уход за полостью рта';
export const s6Technic7 = 'Аксессуары для электробритв и эпиляторов';
export const s6Technic8 = 'Приборы для ухода за лицом';
export const s6Technic9 = 'Массажеры';
export const s6Technic10 = 'Миостимуляторы';
export const s6Technic11 = 'Напольные весы';
export const s6Technic12 = 'Приборы для ухода за телом';
export const s6Technic13 = 'Солярии';
export const s6Technic14 = 'Электробигуди';

export const gTechnic7 = 'Крепеж';
export const s7Technic1 = 'Анкерные болты';
export const s7Technic2 = 'Винты и болты';
export const s7Technic3 = 'Шурупы и саморезы';
export const s7Technic4 = 'Гвозди';
export const s7Technic5 = 'Перфорированный крепеж';
export const s7Technic6 = 'Дюбели';

export const gTechnic8 = 'Дверная фурнитура';
export const s8Technic1 = 'Замки навесные';
export const s8Technic2 = 'Замки накладные';
export const s8Technic3 = 'Ручки дверные';
export const s8Technic4 = 'Защелки и завертки';
export const s8Technic5 = 'Петли дверные';

export const gTechnic9 = 'Мебель для ванной комнаты';
export const s9Technic1 = 'Тумбы';
export const s9Technic2 = 'Зеркала';
export const s9Technic3 = 'Шкафы';

export const gTechnic10 = 'Общестроительные материалы';
export const s10Technic1 = 'Клеящиеся ленты для строительных работ';
export const s10Technic2 = 'Монтажные пены и очистители';
export const s10Technic3 = 'Добавки в строительные смеси и растворы';
export const s10Technic4 = 'Кладочные и гидроизоляционные смеси';
export const s10Technic5 = 'Клеи';
export const s10Technic6 = 'Герметики';
export const s10Technic7 = 'Строительные тенты';

export const gTechnic11 = 'Электрика';
export const s11Technic1 = 'Автоматика';
export const s11Technic2 = 'Кабель';
export const s11Technic3 = 'Щиты и шкафы';
export const s11Technic4 = 'Стабилизаторы напряжения';
export const s11Technic5 = 'Розетки, выключатели и рамки';
export const s11Technic6 = 'Электроудлинители, сетевые фильтры и переходники';
export const s11Technic7 = 'Электромонтажные работы';
export const s11Technic8 = 'Электрогенераторы';
export const s11Technic9 = 'Трансформаторы';
export const s11Technic10 = 'Звонки';
export const s11Technic11 = 'Счетчики электроэнергии';
export const s11Technic12 = 'Домофоны и вызывные панели';
export const s11Technic13 = 'Переносные светильники';
export const s11Technic14 = 'Аварийное освещение';

export const TechnicStruct = {
	grouping: true,
	showAll: false,
	getTextFunc: null,
	getImageFunc: null,
	filterFunc: null,
	show: 3,
	data: [
		{
			header: gTechnic1,
			array: [
				s1Technic1,
				s1Technic2,
				s1Technic3,
				s1Technic4,
				s1Technic5,
				s1Technic6,
				s1Technic7,
				s1Technic8,
				s1Technic9,
				s1Technic10,
			],
		},
		{
			header: gTechnic2,
			array: [s2Technic1, s2Technic2, s2Technic3, s2Technic4, s2Technic5, s2Technic6, s2Technic7, s2Technic8],
		},
		{
			header: gTechnic3,
			array: [
				s3Technic1,
				s3Technic2,
				s3Technic3,
				s3Technic4,
				s3Technic5,
				s3Technic6,
				s3Technic7,
				s3Technic8,
				s3Technic9,
				s3Technic10,
				s3Technic11,
				s3Technic12,
				s3Technic13,
			],
		},
		{
			header: gTechnic4,
			array: [s4Technic1, s4Technic2, s4Technic3, s4Technic4, s4Technic5, s4Technic6],
		},
		{
			header: gTechnic5,
			array: [
				s5Technic1,
				s5Technic2,
				s5Technic3,
				s5Technic4,
				s5Technic5,
				s5Technic6,
				s5Technic7,
				s5Technic8,
				s5Technic9,
				s5Technic10,
			],
		},
		{
			header: gTechnic6,
			array: [
				s6Technic1,
				s6Technic2,
				s6Technic3,
				s6Technic4,
				s6Technic4,
				s6Technic5,
				s6Technic6,
				s6Technic7,
				s6Technic8,
				s6Technic9,
				s6Technic10,
				s6Technic11,
				s6Technic12,
				s6Technic13,
				s6Technic14,
			],
		},
		{
			header: gTechnic7,
			array: [s7Technic1, s7Technic2, s7Technic3, s7Technic4, s7Technic5, s7Technic6],
		},
		{
			header: gTechnic8,
			array: [s8Technic1, s8Technic2, s8Technic3, s8Technic4, s8Technic5],
		},
		{
			header: gTechnic9,
			array: [s9Technic1, s9Technic2, s9Technic3],
		},
		{
			header: gTechnic10,
			array: [s10Technic1, s10Technic2, s10Technic3, s10Technic4, s10Technic5, s10Technic6, s10Technic7],
		},
		{
			header: gTechnic11,
			array: [
				s11Technic1,
				s11Technic2,
				s11Technic3,
				s11Technic4,
				s11Technic5,
				s11Technic6,
				s11Technic7,
				s11Technic8,
				s11Technic9,
				s11Technic10,
				s11Technic11,
				s11Technic12,
				s11Technic13,
				s11Technic14,
			],
		},
	],
};
