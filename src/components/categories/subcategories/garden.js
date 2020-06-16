import { CategoryGarden, GetCategoryText } from "../Categories";

export const gGarden1 = 'Сезонные товары';
export const s1Garden1 = 'Грили, мангалы, решетки';
export const s1Garden2 = 'Биотуалеты';
export const s1Garden3 = 'Зонты, павильоны';
export const s1Garden4 = 'Садовая мебель';
export const s1Garden5 = 'Бассейны и аксессуары';
export const s1Garden6 = 'Пруды, фонтаны';
export const s1Garden7 = 'Газовые баллоны';

export const gGarden2 = 'Садовая техника';
export const s2Garden1 = 'Зимняя садовая техника';
export const s2Garden2 = 'Пилы цепные и дровоколы';
export const s2Garden3 = 'Техника для ухода за газоном и растениями';
export const s2Garden4 = 'Культиваторы, мотоблоки, мини-тракторы';
export const s2Garden5 = 'Насосы для дачи';
export const s2Garden6 = 'Техника для уборки';

export const gGarden3 = 'Оснастка для садовой техники';
export const s3Garden1 = 'Оснастка для цепных пил';
export const s3Garden2 = 'Оснастка для триммеров и газонокосилок';
export const s3Garden3 = 'Навесное оборудование и оснастка для мотобуров';
export const s3Garden4 = 'Расходные материалы и запчасти';

export const gGarden4 = 'Садовый инструмент и инвентарь';
export const s4Garden1 = 'Лопаты для снега и скребки';
export const s4Garden2 = 'Топоры';
export const s4Garden3 = 'Лопаты, грабли, буры';
export const s4Garden4 = 'Тяпки и мотыги';
export const s4Garden5 = 'Черенки и ручки для садового инвентаря';
export const s4Garden6 = 'Мини-инструменты';
export const s4Garden7 = 'Наборы садовых инструментов';
export const s4Garden8 = 'Инструменты режущие';
export const s4Garden9 = 'Лестницы и стремянки';

export const gGarden5 = 'Поливочное оборудование';
export const s5Garden1 = 'Шланги и фитинги для полива';
export const s5Garden2 = 'Капельный полив';
export const s5Garden3 = 'Системы управления поливом';

export const gGarden6 = 'Садоводство';
export const s6Garden1 = 'Семена, растения, удобрения, грунты';
export const s6Garden2 = 'Комнатные растения';
export const s6Garden3 = 'Средства защиты';
export const s6Garden4 = 'Парники и теплицы';
export const s6Garden5 = 'Садовый декор';

export const gGarden7 = 'Баня и сауна';
export const s7Garden1 = 'Аксессуары';
export const s7Garden2 = 'Бочки и купели';

export const gGarden8 = 'Насосы для дачи';
export const s8Garden1 = 'Водяные насосы';
export const s8Garden2 = 'Комплектующие для насосов';

export const gGarden9 = 'Новогодние товары';
export const s9Garden1 = 'Елки искусственные';
export const s9Garden2 = 'Елочные украшения';
export const s9Garden3 = 'Новогодние фигурки и сувениры';
export const s9Garden4 = 'Новогодний декор';
export const s9Garden5 = 'Гирлянды';

export const GardenStruct = {
	grouping: true,
	showAll: false,
	getTextFunc: null,
	getImageFunc: null,
	filterFunc: null,
	header: GetCategoryText(CategoryGarden),
	show: 3,
	data: [
		{
			header: gGarden1,
			array: [s1Garden1, s1Garden2, s1Garden3, s1Garden4, s1Garden5, s1Garden6, s1Garden7],
		},
		{
			header: gGarden2,
			array: [s2Garden1, s2Garden2, s2Garden3, s2Garden4, s2Garden5, s2Garden6],
		},
		{
			header: gGarden3,
			array: [s3Garden1, s3Garden2, s3Garden3, s3Garden4],
		},
		{
			header: gGarden4,
			array: [s4Garden1, s4Garden2, s4Garden3, s4Garden4, s4Garden5, s4Garden6, s4Garden7, s4Garden8, s4Garden9],
		},
		{
			header: gGarden5,
			array: [s5Garden1, s5Garden2, s5Garden3],
		},
		{
			header: gGarden6,
			array: [s6Garden1, s6Garden2, s6Garden3, s6Garden4, s6Garden5],
		},
		{
			header: gGarden7,
			array: [s7Garden1, s7Garden2],
		},
		{
			header: gGarden8,
			array: [s8Garden1, s8Garden2],
		},
		{
			header: gGarden9,
			array: [s9Garden1, s9Garden2, s9Garden3, s9Garden4, s9Garden5],
		},
	],
};
