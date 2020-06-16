import { GetCategoryText, CategoryOffice } from "../Categories";

export const gOffice1 = 'Письменные принадлежности';
export const s1Office1 = 'Ручки';
export const s1Office2 = 'Аксессуары и расходники для ручек';
export const s1Office3 = 'Механические карандаши и грифели';
export const s1Office4 = 'Чернографитные карандаши';
export const s1Office5 = 'Чертежные инструменты';
export const s1Office6 = 'Цветные карандаши';
export const s1Office7 = 'Фломастеры';
export const s1Office8 = 'Маркеры';
export const s1Office9 = 'Пастель и мелки';
export const s1Office10 = 'Краски';
export const s1Office11 = 'Кисти';
export const s1Office12 = 'Ластики';
export const s1Office13 = 'Точилки';

export const gOffice2 = 'Бумажная продукция';
export const s2Office1 = 'Тетради';
export const s2Office2 = 'Блокноты';
export const s2Office3 = 'Ежедневники, записные книжки';
export const s2Office4 = 'Дневники и планеры';
export const s2Office5 = 'Бумага для заметок';
export const s2Office6 = 'Конверты';
export const s2Office7 = 'Закладки';
export const s2Office8 = 'Бумага для рисования и черчения';
export const s2Office9 = 'Альбомы для рисования';
export const s2Office10 = 'Цветная бумага и картон';

export const gOffice3 = 'Офисные принадлежности';
export const s3Office1 = 'Канцелярские наборы';
export const s3Office2 = 'Лотки для бумаги';
export const s3Office3 = 'Калькуляторы';
export const s3Office4 = 'Клей';
export const s3Office5 = 'Корректоры';
export const s3Office6 = 'Скотч';
export const s3Office7 = 'Ножницы';
export const s3Office8 = 'Ножи канцелярские';
export const s3Office9 = 'Степлеры, скобы, антистеплеры';
export const s3Office10 = 'Дыроколы';
export const s3Office11 = 'Канцелярские аксессуары';
export const s3Office12 = 'Скрепки, кнопки';
export const s3Office13 = 'Бейджи';

export const gOffice4 = 'Упаковки';
export const s4Office1 = 'Пеналы';
export const s4Office2 = 'Файлы и папки';
export const s4Office3 = 'Фотоальбомы';
export const s4Office4 = 'Подарочные';

export const gOffice5 = 'Школьные принадлежности';
export const s5Office1 = 'Рюкзаки и ранцы';
export const s5Office2 = 'Мешки для обуви и формы';
export const s5Office3 = 'Подставки для книг';
export const s5Office4 = 'Обложки';
export const s5Office5 = 'Детские микроскопвы и телескопы';
export const s5Office6 = 'Школьные глобусы';
export const s5Office7 = 'Учебные карты';

export const OfficeStruct = {
	grouping: true,
	showAll: false,
	getTextFunc: null,
	getImageFunc: null,
	filterFunc: null,
	header: GetCategoryText(CategoryOffice),
	show: 3,
	data: [
		{
			header: gOffice1,
			array: [
				s1Office1,
				s1Office2,
				s1Office3,
				s1Office4,
				s1Office5,
				s1Office6,
				s1Office7,
				s1Office8,
				s1Office9,
				s1Office10,
				s1Office11,
				s1Office12,
				s1Office13,
			],
		},
		{
			header: gOffice2,
			array: [
				s2Office1,
				s2Office2,
				s2Office3,
				s2Office4,
				s2Office5,
				s2Office6,
				s2Office7,
				s2Office8,
				s2Office9,
				s2Office10,
			],
		},
		{
			header: gOffice3,
			array: [
				s3Office1,
				s3Office2,
				s3Office3,
				s3Office4,
				s3Office5,
				s3Office6,
				s3Office7,
				s3Office8,
				s3Office9,
				s3Office10,
				s3Office11,
				s3Office12,
				s3Office13,
			],
		},
		{
			header: gOffice4,
			array: [s4Office1, s4Office2, s4Office3, s4Office4],
		},
		{
			header: gOffice5,
			array: [s5Office1, s5Office2, s5Office3, s5Office4, s5Office5, s5Office6, s5Office7],
		},
	],
};
