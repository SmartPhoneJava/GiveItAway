import { CategoryChildren, GetCategoryText } from "../Categories";

export const gChild1 = 'Для мам и малышей';
export const s1Child1 = 'Подгузники и пеленки';
export const s1Child2 = 'Здоровье и уход за малышом';
export const s1Child3 = 'Кормление';
export const s1Child4 = 'Купание';

export const gChild2 = 'Прогулки и путешествия';
export const s2Child1 = 'Коляски';
export const s2Child2 = 'Автокресла';
export const s2Child3 = 'Переноски';
export const s2Child4 = 'Аксессуары для колясок и автокресел';
export const s2Child5 = 'Конверты и спальные мешки';
export const s2Child6 = 'Рюкзаки и сумки-кенгуру';
export const s2Child7 = 'Слинги';

export const gChild3 = 'Детская комната';
export const s3Child1 = 'Кроватки';
export const s3Child2 = 'Детские комоды';
export const s3Child3 = 'Матрасы и наматрасники';
export const s3Child4 = 'Стульчики для кормления';
export const s3Child5 = 'Манежи';
export const s3Child6 = 'Качели, шезлонги';
export const s3Child7 = 'Ходунки, прыгунки';
export const s3Child8 = 'Колыбели и люльки';
export const s3Child9 = 'Радио- и видеоняни';
export const s3Child10 = 'Защита и безопасность';
export const s3Child11 = 'Пеленальные столики и доски';
export const s3Child12 = 'Постельное белье и комплекты';
export const s3Child13 = 'Покрывала, подушки, одеяла';
export const s3Child14 = 'Органайзеры и карманы в кроватку';
export const s3Child15 = 'Балдахины и держатели';
export const s3Child16 = 'Полотенца';
export const s3Child17 = 'Ростомеры';
export const s3Child18 = 'Мобили';
export const s3Child19 = 'Ночники';
export const s3Child20 = 'Ванночки';
export const s3Child21 = 'Горшки и сиденья';

export const gChild4 = 'Игрушки и игры';
export const s4Child1 = 'Для детей до 3 лет';
export const s4Child2 = 'Конструкторы';
export const s4Child3 = 'Для девочек';
export const s4Child4 = 'Для мальчиков';
export const s4Child5 = 'Игровые наборы и фигурки';
export const s4Child6 = 'Игры';
export const s4Child7 = 'Мягкие игрушки';
export const s4Child8 = 'Планшеты для детей постарше';
export const s4Child9 = 'Деревянные игрушки';
export const s4Child10 = 'Хранение игрушек';
export const s4Child11 = 'Электронные устройства';
export const s4Child12 = 'Радиоуправляемые игрушки';
export const s4Child13 = 'Аксессуары для радиоуправляемых игрушек';
export const s4Child14 = 'Музыкальные игрушки';

export const gChild5 = 'Хобби и творчество';
export const s5Child1 = 'Рисование';
export const s5Child2 = 'Раскраски и роспись';
export const s5Child3 = 'Лепка';
export const s5Child4 = 'Детское творчество';
export const s5Child5 = 'Рукоделие';
export const s5Child6 = 'Хобби';

export const gChild6 = 'Развитие и обучение';
export const s6Child1 = 'Раннее развитие';
export const s6Child2 = 'Книги для детей';
export const s6Child3 = 'Пазлы';
export const s6Child4 = 'Мозаика';
export const s6Child5 = 'Головоломки';

export const gChild7 = 'Детский спорт';
export const s7Child1 = 'Детский транспорт';
export const s7Child2 = 'Зимний спорт';
export const s7Child3 = 'Игровая площадка';
export const s7Child4 = 'Летний спорт';

export const gChild8 = 'Товары для школы';
export const s8Child1 = 'Школьная одежда и обувь';
export const s8Child2 = 'Рюкзаки, ранцы, сумки';
export const s8Child3 = 'Пеналы и письменные принадлежности';
export const s8Child4 = 'Тетради, блокноты, дневники';
export const s8Child5 = 'Канцелярские товары';
export const s8Child6 = 'Школьные принадлежности';
export const s8Child7 = 'Учебная литература';

export const gChild9 = 'Детская одежда и обувь';
export const s9Child1 = 'Одежда и обувь для девочек';
export const s9Child2 = 'Одежда и обувь для мальчиков';
export const s9Child3 = 'Одежда и обувь для малышей';
export const s9Child4 = 'Аксессуары для детей';
export const s9Child5 = 'Детская спортивная одежда';

export const ChildStruct = {
	grouping: true,
	showAll: false,
	getTextFunc: null,
	getImageFunc: null,
	filterFunc: null,
	header: GetCategoryText(CategoryChildren),
	show: 3,
	data: [
		{
			header: gChild1,
			show: 4,
			array: [s1Child1, s1Child2, s1Child3, s1Child4],
		},
		{
			header: gChild2,
			array: [s2Child1, s2Child2, s2Child3, s2Child4, s2Child5, s2Child6, s2Child7],
		},
		{
			header: gChild3,
			array: [s3Child1, s3Child2, s3Child3, s3Child4, s3Child5, s3Child6, s3Child7, s3Child8],
		},
		{
			header: gChild4,
			array: [
				s4Child1,
				s4Child2,
				s4Child3,
				s4Child4,
				s4Child5,
				s4Child6,
				s4Child7,
				s4Child8,
				s4Child9,
				s4Child10,
				s4Child11,
				s4Child12,
				s4Child13,
				s4Child14,
			],
		},
		{
			header: gChild5,
			array: [s5Child1, s5Child2, s5Child3, s5Child4, s5Child5, s5Child6],
		},
		{
			header: gChild6,
			array: [s6Child1, s6Child2, s6Child3, s6Child4, s6Child5],
		},
		{
			header: gChild7,
			array: [s7Child1, s7Child2, s7Child3, s7Child4],
		},
		{
			header: gChild8,
			array: [s8Child1, s8Child2, s8Child3, s8Child4, s8Child5, s8Child6, s8Child7],
		},
		{
			header: gChild9,
			array: [s9Child1, s9Child2, s9Child3, s9Child4, s9Child5],
		},
	],
};
