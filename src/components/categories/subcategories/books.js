import { CategoryBooks } from "../const";

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

export const gBooks2 = 'Художественная литература';
export const s2Books1 = 'Аформизмы, фольклор и мифы';
export const s2Books2 = 'Детективы';
export const s2Books3 = 'Исторические романы';
export const s2Books4 = 'Книги на иностранных языках';
export const s2Books5 = 'Комиксы и манга';
export const s2Books6 = 'Поэзия';
export const s2Books7 = 'Любовные романы';
export const s2Books8 = 'Приключенческая литература';
export const s2Books9 = 'Проза';
export const s2Books10 = 'Триллеры';
export const s2Books11 = 'Фантастика и фэнтези';
export const s2Books12 = 'Юмор и сатира';
export const s2Books13 = 'Мир увлечений';

export const gBooks3 = 'Другая литература';
export const s3Books1 = 'Журналы и газеты';
export const s3Books2 = 'Фотоальбомы';
export const s3Books3 = 'Биографии и автобиографии';
export const s3Books4 = 'Дневники и письма';
export const s3Books5 = 'Календари';
export const s3Books6 = 'Открытки';
export const s3Books7 = 'Подарочные издания';

export const BooksStruct = {
	grouping: true,
	showAll: false,
	getTextFunc: null,
	getImageFunc: null,
	filterFunc: null,
	header: CategoryBooks, //GetCategoryText(CategoryBooks),
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
			array: [
				s2Books1,
				s2Books2,
				s2Books3,
				s2Books4,
				s2Books5,
				s2Books6,
				s2Books7,
				s2Books8,
				s2Books9,
				s2Books10,
				s2Books11,
				s2Books12,
				s2Books13,
			],
		},
		{
			header: gBooks3,
			array: [s3Books1, s3Books2, s3Books3, s3Books4, s3Books5, s3Books6, s3Books7],
		},
	],
};
