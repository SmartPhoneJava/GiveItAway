import React, { useState } from 'react';
import { Group, Cell, Header, List, FormLayout, FormLayoutGroup, Radio, SelectMimicry, Avatar } from '@vkontakte/vkui';

// export const SubCategoryAnimals = 'animals';
// export const CategoryAnother = 'another';
// export const CategoryBooks = 'books';
// export const CategoryHome = 'build';
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

export const gHome1 = 'Посуда и кухонные принадлежности';
export const s1Home1 = 'Кухонные аксессуары';
export const s1Home2 = 'Одноразовая посуда';
export const s1Home3 = 'Приготовление напитков';
export const s1Home4 = 'Приготовление пищи';
export const s1Home5 = 'Сервировка стола';
export const s1Home6 = 'Хранение продуктов';

export const gHome2 = 'Освещение';
export const s2Home1 = 'Бра';
export const s2Home2 = 'Светильники';
export const s2Home3 = 'Лампочки';
export const s2Home4 = 'Люстры';
export const s2Home5 = 'Настольные лампы';
export const s2Home6 = 'Ночники и декоративные светильники';
export const s2Home7 = 'Интерьерная подсветка';
export const s2Home8 = 'Прожекторы';
export const s2Home9 = 'Споты и трек-системы';
export const s2Home10 = 'Торшеры и напольные светильники';
export const s2Home11 = 'Уличное освещение';
export const s2Home12 = 'Батарейки и аккумуляторы';
export const s2Home13 = 'Комплектующие и аксессуары для светильников';
export const s2Home14 = 'Светодиодные ленты и комплектующие';
export const s2Home15 = 'Переносные светильники';
export const s2Home16 = 'Аварийное освещение';

export const gHome3 = 'Хозяйственные товары';
export const s3Home1 = 'Аксессуары для ванной и туалета';
export const s3Home2 = 'Аксессуары для ухода за обувью';
export const s3Home3 = 'Безмены';
export const s3Home4 = 'Инвентарь для уборки';
export const s3Home5 = 'Товары для ухода за одеждой и бельем';
export const s3Home6 = 'Хранение вещей';

export const gHome4 = 'Интерьер';
export const s4Home1 = 'Декор стен';
export const s4Home2 = 'Картины и зеркала';
export const s4Home3 = 'Ковры и ковровые дорожки';
export const s4Home4 = 'Копилки';
export const s4Home5 = 'Метеостанции, термометры, барометры';
export const s4Home6 = 'Настенные ключницы и шкафчики';
export const s4Home7 = 'Свечи и подсвечники';
export const s4Home8 = 'Статуэтки и фигурки';
export const s4Home9 = 'Фототовары';
export const s4Home10 = 'Цветы и вазы';
export const s4Home11 = 'Часы';
export const s4Home12 = 'Ширмы';
export const s4Home13 = 'Шкатулки';
export const s4Home14 = 'Шторы и жалюзи';
export const s4Home15 = 'Ювелирная посуда и сувениры';
export const s4Home16 = 'Огнетушители';
export const s4Home17 = 'Сейфы';
export const s4Home18 = 'Другой декор';

export const gHome5 = 'Текстиль';
export const s5Home1 = 'Декоративные подушки';
export const s5Home2 = 'Наматрасники и чехлы для матрасов';
export const s5Home3 = 'Одеяла';
export const s5Home4 = 'Пледы и покрывала';
export const s5Home5 = 'Подушки';
export const s5Home6 = 'Полотенца';
export const s5Home7 = 'Постельное белье';
export const s5Home8 = 'Скатерти и салфетки';
export const s5Home9 = 'Текстиль с электроподогревом';
export const s5Home10 = 'Ткани';
export const s5Home11 = 'Чехлы для мебели и подушек';

export const gHome6 = 'Для праздников';
export const s6Home1 = 'Воздушные шары';
export const s6Home2 = 'Украшения для организации праздников';
export const s6Home3 = 'Свадебные украшения';
export const s6Home4 = 'Фейерверки';
export const s6Home5 = 'Мыльные пузыри';

export const gHome7 = 'Личная гигиена';
export const s7Home1 = 'Туалетное и жидкое мыло';
export const s7Home2 = 'Средства для душа';
export const s7Home3 = 'Пена, соль, масло для ванны';
export const s7Home4 = 'Дезодоранты';
export const s7Home5 = 'Дезинфицирующие средства';

export const gHome8 = 'Средства для стирки';
export const s8Home1 = 'Стиральный порошок';
export const s8Home2 = 'Гели и жидкости для стирки';
export const s8Home3 = 'Капсулы, таблетки, пластины';
export const s8Home4 = 'Кондиционеры и ополаскиватели';
export const s8Home5 = 'Отбеливатели и пятновыводители';

export const gHome9 = 'Средства для посуды и кухни';
export const s9Home1 = 'Для мытья посуды';
export const s9Home2 = 'Для посудомоечных машин';
export const s9Home3 = 'Для кухни';
export const s9Home4 = 'Для ухода за кухонной техникой';

export const gHome10 = 'Инвентарь для уборки';
export const s10Home1 = 'Ведра и тазы';
export const s10Home2 = 'Веники, совки, щетки для пола';
export const s10Home3 = 'Мешки для мусора';
export const s10Home4 = 'Мусорные ведра и баки';
export const s10Home5 = 'Перчатки';
export const s10Home6 = 'Стекломои, скребки, сгоны';
export const s10Home7 = 'Тряпки, щетки, губки';
export const s10Home8 = 'Швабры и насадки';

export const gHome11 = 'Уход за одеждой и бельем';
export const s11Home1 = 'Аксессуары для сушки';
export const s11Home2 = 'Гладильные доски';
export const s11Home3 = 'Чехлы для гладильных досок';
export const s11Home4 = 'Ролики, щетки';

export const gHome12 = 'Уход за обувью и аксессуары';
export const s12Home1 = 'Косметика и чистящие средства';
export const s12Home2 = 'Стельки и шнурки';
export const s12Home3 = 'Сушилки и формодержатели';
export const s12Home4 = 'Щетки и ложки';
export const s12Home5 = 'Стельки ортопедические';

export const HomeStruct = {
	grouping: true,
	showAll: false,
	getTextFunc: null,
	getImageFunc: null,
	filterFunc: null,
	show: 3,
	data: [
		{
			header: gHome1,
			array: [s1Home1, s1Home2, s1Home3, s1Home4, s1Home5, s1Home6],
		},
		{
			header: gHome2,
			array: [
				s2Home1,
				s2Home2,
				s2Home3,
				s2Home4,
				s2Home5,
				s2Home6,
				s2Home7,
				s2Home8,
				s2Home9,
				s2Home10,
				s2Home11,
				s2Home12,
				s2Home13,
				s2Home14,
				s2Home15,
				s2Home16,
			],
		},
		{
			header: gHome3,
			array: [s3Home1, s3Home2, s3Home3, s3Home4, s3Home5, s3Home6],
		},
		{
			header: gHome4,
			array: [
				s4Home1,
				s4Home2,
				s4Home3,
				s4Home4,
				s4Home5,
				s4Home6,
				s4Home7,
				s4Home8,
				s4Home9,
				s4Home10,
				s4Home11,
				s4Home12,
				s4Home13,
				s4Home14,
				s4Home15,
				s4Home16,
				s4Home17,
				s4Home18,
			],
		},
		{
			header: gHome5,
			array: [
				s5Home1,
				s5Home2,
				s5Home3,
				s5Home4,
				s5Home5,
				s5Home6,
				s5Home7,
				s5Home8,
				s5Home9,
				s5Home10,
				s5Home11,
			],
		},
		{
			header: gHome6,
			array: [s6Home1, s6Home2, s6Home3, s6Home4, s6Home5],
		},
		{
			header: gHome7,
			array: [s7Home1, s7Home2, s7Home3, s7Home4, s7Home5],
		},
		{
			header: gHome8,
			array: [s8Home1, s8Home2, s8Home3, s8Home4, s8Home5],
		},
		{
			header: gHome9,
			array: [s9Home1, s9Home2, s9Home3, s9Home4],
		},
		{
			header: gHome10,
			array: [s10Home1, s10Home2, s10Home3, s10Home4, s10Home5, s10Home6, s10Home7, s10Home8],
		},
		{
			header: gHome11,
			array: [s11Home1, s11Home2, s11Home3, s11Home4],
		},
		{
			header: gHome12,
			array: [s12Home1, s12Home2, s12Home3, s12Home4, s12Home5],
		},
	],
};
