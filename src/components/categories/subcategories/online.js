import { CategoryOnline } from "../const";

export const gOnline1 = 'Программное обеспечение';
export const s1Online1 = 'Удаленная работа';
export const s1Online2 = 'Антивирусы и безопасность';
export const s1Online3 = 'Графика и дизайн';
export const s1Online4 = 'Мультимедиа';
export const s1Online5 = 'Системные программы';
export const s1Online6 = 'Работа с текстом';
export const s1Online7 = 'Сеть и интернет';
export const s1Online8 = 'Файлы и диски';
export const s1Online9 = 'Инструменты для разработки ПО';
export const s1Online10 = 'Драйвера и прошивки';

export const gOnline2 = 'Игры';
export const s2Online1 = 'Аккаунты';
export const s2Online2 = 'Предметы';
export const s2Online3 = 'Игровая валюта';
export const s2Online4 = 'Бонус-коды';
export const s2Online5 = 'Подарки';
export const s2Online6 = 'Услуги';
export const s2Online7 = 'Моды и карты';

export const gOnline3 = 'Творчество';
export const s3Online1 = 'Подкасты';
export const s3Online2 = 'Видео-контент';
export const s3Online3 = 'Иллюстрации и анимации';
export const s3Online4 = 'Фотографии';
export const s3Online5 = 'Блоги и статьи';
export const s3Online6 = 'Книги и журналистика';
export const s3Online7 = 'Комиксы и манга';
export const s3Online8 = 'Озвучка книг и фильмов';
export const s3Online9 = 'Субтитры к фильмам и сериалам';
export const s3Online10 = 'Другие виды цифрового творчества';

export const gOnline4 = 'Школьные работы';
export const s4Online1 = 'Готовое домашнее задание';
export const s4Online2 = 'Сочинения, рефераты и эссе';
export const s4Online3 = 'Контрольные и самостоятельные работы';
export const s4Online4 = 'Практические задания и задачи';
export const s4Online5 = 'Тренажеры и тесты';
export const s4Online6 = 'Справочные материалы';
export const s4Online7 = 'Шпаргалки';
export const s4Online8 = 'Презентации';
export const s4Online9 = 'ГИА';
export const s4Online10 = 'ЕГЭ';

export const gOnline5 = 'Студенческие работы';
export const s5Online1 = 'Рефераты';
export const s5Online2 = 'Книги, учебные пособия и лекции';
export const s5Online3 = 'Курсовые работы';
export const s5Online4 = 'Контрольные мероприятия';
export const s5Online5 = 'Дипломные работы';
export const s5Online6 = 'Шпаргалки';
export const s5Online7 = 'Доклады';
export const s5Online8 = 'Статьи';
export const s5Online9 = 'Лабораторные работы';
export const s5Online10 = 'Изложения';
export const s5Online11 = 'Карты и атласы';
export const s5Online12 = 'Подготовка к контрольным мероприятиям';
export const s5Online13 = 'Лабораторные';
export const s5Online14 = 'Чертежи';
export const s5Online15 = '3D-модели';
export const s5Online16 = 'Плакаты';
export const s5Online17 = 'Презентации';
export const s5Online18 = 'Конспекты семинаров';
export const s5Online19 = 'Отчёты по практике';
export const s5Online20 = 'Стандарты';

export const OnlineStruct = {
	grouping: true,
	showAll: false,
	getTextFunc: null,
	getImageFunc: null,
	filterFunc: null,
	header: CategoryOnline, //GetCategoryText(CategoryOnline),
	show: 3,
	data: [
		{
			header: gOnline1,
			array: [
				s1Online1,
				s1Online2,
				s1Online3,
				s1Online4,
				s1Online5,
				s1Online6,
				s1Online7,
				s1Online8,
				s1Online9,
				s1Online10,
			],
		},
		{
			header: gOnline2,
			array: [s2Online1, s2Online2, s2Online3, s2Online4, s2Online5, s2Online6, s2Online7],
		},
		{
			header: gOnline3,
			array: [
				s3Online1,
				s3Online2,
				s3Online3,
				s3Online4,
				s3Online5,
				s3Online6,
				s3Online7,
				s3Online8,
				s3Online9,
				s3Online10,
			],
		},
		{
			header: gOnline4,
			array: [
				s4Online1,
				s4Online2,
				s4Online3,
				s4Online4,
				s4Online5,
				s4Online6,
				s4Online7,
				s4Online8,
				s4Online9,
				s4Online10,
			],
		},
		{
			header: gOnline5,
			array: [
				s5Online1,
				s5Online2,
				s5Online3,
				s5Online4,
				s5Online5,
				s5Online6,
				s5Online7,
				s5Online8,
				s5Online9,
				s5Online10,
				s5Online11,
				s5Online12,
				s5Online13,
				s5Online14,
				s5Online15,
				s5Online16,
				s5Online17,
				s5Online18,
				s5Online19,
				s5Online20,
			],
		},
	],
};
