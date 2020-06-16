import { CategoryHealth, GetCategoryText } from "../Categories";

export const gHealth1 = 'Оптика';
export const s1Health1 = 'Контактные линзы';
export const s1Health2 = 'Растворы для контактных линз';
export const s1Health3 = 'Очки';
export const s1Health4 = 'Футляры';
export const s1Health5 = 'Оправы для очков';
export const s1Health6 = 'Карнавальные линзы';

export const gHealth2 = 'Ортопедия и реабилитация';
export const s2Health1 = 'Бандажи и ортезы';
export const s2Health2 = 'Изделия для стопы';
export const s2Health3 = 'Инвалидные коляски';
export const s2Health4 = 'Компрессионный трикотаж';
export const s2Health5 = 'Корсеты и корректоры осанки';
export const s2Health6 = 'Лечебные согревающие изделия';
export const s2Health7 = 'Ортопедические стельки';
export const s2Health8 = 'Бинты эластичные';
export const s2Health9 = 'Ходунки, костыли и трости';

export const gHealth3 = 'Медицинская техника';
export const s3Health1 = 'Глюкометры и анализаторы крови';
export const s3Health2 = 'Ингаляторы';
export const s3Health3 = 'Тонометры';
export const s3Health4 = 'Термометры';
export const s3Health5 = 'Физиотерапевтические аппараты';
export const s3Health6 = 'Слуховые и голосовые аппараты';

export const gHealth4 = 'Приборы для здоровья';
export const s4Health1 = 'Миостимуляторы';
export const s4Health2 = 'Пояса и трикотаж для похудения';
export const s4Health3 = 'Грелки';
export const s4Health4 = 'Алкотестеры';
export const s4Health5 = 'Гаджеты и изделия для сна';

export const gHealth5 = 'Уход за больными и гигиена';
export const s5Health1 = 'Гигиенические средства для ухода за больными';
export const s5Health2 = 'Подгузники, пеленки, трусы';
export const s5Health3 = 'Приспособления для ухода за больными';
export const s5Health4 = 'Технические средства реабилитации';
export const s5Health5 = 'Ходунки, костыли и трости';

export const gHealth6 = 'Массажеры';
export const s6Health1 = 'Вибромассажеры';
export const s6Health2 = 'Гидромассажеры';
export const s6Health3 = 'Другие массажеры';
export const s6Health4 = 'Массажные кресла';
export const s6Health5 = 'Массажные матрасы и подушки';
export const s6Health6 = 'Массажные столы и стулья';

export const gHealth7 = 'Медицинские изделия';
export const s7Health1 = 'Аптечки и таблетницы';
export const s7Health2 = 'Бахилы';
export const s7Health3 = 'Вата';
export const s7Health4 = 'Грелки';
export const s7Health5 = 'Дезинфицирующие средства';
export const s7Health6 = 'Маски и шапочки';
export const s7Health7 = 'Медицинские шприцы, иглы';
export const s7Health8 = 'Перевязочные бинты';
export const s7Health9 = 'Перчатки медицинские';
export const s7Health10 = 'Пластыри';
export const s7Health11 = 'Повязки раневые';
export const s7Health12 = 'Спринцовки';
export const s7Health13 = 'Материалы для анализов и инъекций';
export const s7Health14 = 'Кислородные баллончики';

export const HealthStruct = {
	grouping: true,
	showAll: false,
	getTextFunc: null,
	getImageFunc: null,
	filterFunc: null,
	header: GetCategoryText(CategoryHealth),
	show: 3,
	data: [
		{
			header: gHealth1,
			array: [s1Health1, s1Health2, s1Health3, s1Health4, s1Health5, s1Health6],
		},
		{
			header: gHealth2,
			array: [s2Health1, s2Health2, s2Health3, s2Health4, s2Health5, s2Health6, s2Health7, s2Health8, s2Health9],
		},
		{
			header: gHealth3,
			array: [s3Health1, s3Health2, s3Health3, s3Health4, s3Health5, s3Health6],
		},
		{
			header: gHealth4,
			array: [s4Health1, s4Health2, s4Health3, s4Health4, s4Health5],
		},
		{
			header: gHealth5,
			array: [s5Health1, s5Health2, s5Health3, s5Health4, s5Health5],
		},
		{
			header: gHealth6,
			array: [s6Health1, s6Health2, s6Health3, s6Health4, s6Health5, s6Health6],
		},
		{
			header: gHealth7,
			array: [
				s7Health1,
				s7Health2,
				s7Health3,
				s7Health4,
				s7Health5,
				s7Health6,
				s7Health7,
				s7Health8,
				s7Health9,
				s7Health10,
				s7Health11,
				s7Health12,
				s7Health13,
				s7Health14,
			],
		},
	],
};
