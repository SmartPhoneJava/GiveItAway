import { GetCategoryText, CategoryAnimals } from "../Categories";

export const gAnimal1 = 'Для кошек';
export const s1Animal1 = 'Туалеты, совочки';
export const s1Animal2 = 'Миски и поилки';
export const s1Animal3 = 'Когтеточки и комплексы';
export const s1Animal4 = 'Шлейки и ошейники';
export const s1Animal5 = 'Одежда и обувь';
export const s1Animal6 = 'Лежаки, домики, спальные места ';
export const s1Animal7 = 'Средства по уходу за кошками';
export const s1Animal8 = 'Кошачьи игрушки';
export const s1Animal9 = 'Переноски для кошек';
export const s1Animal10 = 'Дверцы';
export const s1Animal11 = 'Лотки и наполнители';
export const s1Animal12 = 'Шлейки';
export const s1Animal13 = 'Защита от клещей и блох';
export const s1Animal14 = 'Автокормушки м автопоилки';
export const s1Animal15 = 'Адресники, жетоны, брелки';
export const s1Animal16 = 'Расчески и пуходерки';
export const s1Animal17 = 'Разные аксессуары для кошек';

export const gAnimal2 = 'Для собак';
export const s2Animal1 = 'Миски, кормушки и поилки';
export const s2Animal2 = 'Автокормушки, автопоилки и миски';
export const s2Animal3 = 'Лежаки, домики и матрасы';
export const s2Animal4 = 'Средства по уходу за собаками';
export const s2Animal5 = 'Игрушки и мячи';
export const s2Animal6 = 'Ошейники и поводки';
export const s2Animal7 = 'Намордники и рулетки';
export const s2Animal8 = 'Клетки, вольеры, будки для собак';
export const s2Animal9 = 'Охлаждающие товары';
export const s2Animal10 = 'Защита от клещей и блох';
export const s2Animal11 = 'Адресники, жетоны, маячки';
export const s2Animal12 = 'Груминг, косметика';
export const s2Animal13 = 'Дорожные аксессуары';
export const s2Animal14 = 'Переноски';
export const s2Animal15 = 'Туалеты и пеленки';
export const s2Animal16 = 'Одежда и обувь';
export const s2Animal17 = 'Контейнеры для корма';
export const s2Animal18 = 'Аммуниция';

export const gAnimal3 = 'Для грызунов и кроликов';
export const s3Animal1 = 'Клетки, вольеры';
export const s3Animal2 = 'Сено, трава';
export const s3Animal3 = 'Наполнители';
export const s3Animal4 = 'Гамаки';
export const s3Animal5 = 'Домики';
export const s3Animal6 = 'Игрушки для зубов';
export const s3Animal7 = 'Купалки';
export const s3Animal8 = 'Лежаки';
export const s3Animal9 = 'Лесенки и полки';
export const s3Animal10 = 'Минеральные камни';
export const s3Animal11 = 'Миски и кормушки';
export const s3Animal12 = 'Переноски';
export const s3Animal13 = 'Поводки и шлейки';
export const s3Animal14 = 'Поилки';
export const s3Animal15 = 'Тоннели';
export const s3Animal16 = 'Чистящие средства';
export const s3Animal17 = 'Туалеты';
export const s3Animal18 = 'Шары и колеса';

export const gAnimal4 = 'Для птиц';
export const s4Animal1 = 'Клетки';
export const s4Animal2 = 'Минеральные камни, песок';
export const s4Animal3 = 'Чистящие средства';
export const s4Animal4 = 'Ванночки, купалки';
export const s4Animal5 = 'Жердочки';
export const s4Animal6 = 'Кормушки и поилки';
export const s4Animal7 = 'Игрушки и декор';
export const s4Animal8 = 'Лестницы';
export const s4Animal9 = 'Домики и гнезда';
export const s4Animal10 = 'Скворечники';
export const s4Animal11 = 'Средства для ухода и гигиены';

export const gAnimal5 = 'Для рыб и рептилий';
export const s5Animal1 = 'Аквариумы';
export const s5Animal2 = 'Террариумы, переноски, тумбы';
export const s5Animal3 = 'Химия для террариума';
export const s5Animal4 = 'Лампы';
export const s5Animal5 = 'Декор и обслуживание';
export const s5Animal6 = 'Оборудование';

export const gAnimal6 = 'Для с/x птиц и животных';
export const s6Animal1 = 'Курсы, утки, гуси';
export const s6Animal2 = 'Кролики';
export const s6Animal3 = 'Козы, овцы';
export const s6Animal4 = 'Коровы';
export const s6Animal5 = 'Лошади';
export const s6Animal6 = 'Свиньи';

export const AnimalStruct = {
	grouping: true,
	showAll: false,
	getTextFunc: null,
	getImageFunc: null,
	filterFunc: null,
	header: GetCategoryText(CategoryAnimals),
	show: 5,
	data: [
		{
			header: gAnimal1,
			array: [
				s1Animal1,
				s1Animal2,
				s1Animal3,
				s1Animal4,
				s1Animal5,
				s1Animal6,
				s1Animal7,
				s1Animal8,
				s1Animal9,
				s1Animal10,
				s1Animal11,
				s1Animal12,
				s1Animal13,
				s1Animal14,
				s1Animal15,
				s1Animal16,
				s1Animal17,
			],
		},
		{
			header: gAnimal2,
			array: [
				s2Animal1,
				s2Animal2,
				s2Animal3,
				s2Animal4,
				s2Animal5,
				s2Animal6,
				s2Animal7,
				s2Animal8,
				s2Animal9,
				s2Animal10,
				s2Animal11,
				s2Animal12,
				s2Animal13,
				s2Animal14,
				s2Animal15,
				s2Animal16,
				s2Animal17,
				s2Animal18,
			],
		},
		{
			header: gAnimal3,
			array: [
				s3Animal1,
				s3Animal2,
				s3Animal3,
				s3Animal4,
				s3Animal5,
				s3Animal6,
				s3Animal7,
				s3Animal8,
				s3Animal9,
				s3Animal10,
				s3Animal11,
				s3Animal12,
				s3Animal13,
				s3Animal14,
				s3Animal15,
				s3Animal16,
				s3Animal17,
				s3Animal18,
			],
		},
		{
			header: gAnimal4,
			array: [
				s4Animal1,
				s4Animal2,
				s4Animal3,
				s4Animal4,
				s4Animal5,
				s4Animal6,
				s4Animal7,
				s4Animal8,
				s4Animal9,
				s4Animal10,
				s4Animal11,
			],
		},
		{
			header: gAnimal5,
			array: [s5Animal1, s5Animal2, s5Animal3, s5Animal4, s5Animal5, s5Animal6],
		},
		{
			header: gAnimal6,
			array: [s6Animal1, s6Animal2, s6Animal3, s6Animal4, s6Animal5, s6Animal6],
		},
	],
};
