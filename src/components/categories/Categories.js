import React, { useState } from 'react';

import Animal from './../../img/animal.png';
import Another from './../../img/another.png';
import Book from './../../img/book.png';
import Build from './../../img/build.png';
import Child from './../../img/child.png';
import Clothers from './../../img/clothers.png';
import Cosmetic from './../../img/cosmetic.png';
import Electronics from './../../img/electronics.png';
import Flora from './../../img/flora.png';
import Food from './../../img/food.png';
import Furniture from './../../img/furniture.png';
import Music from './../../img/music.png';
import Old from './../../img/old.png';
import Pencil from './../../img/pencil.png';
import Play from './../../img/play.png';
import Sport from './../../img/sport.png';
import Question from './../../img/question.png';

import Animal400 from './../../img/400/animal.png';
import Animals400 from './../../img/400/animals.png';
import Auto400 from './../../img/400/auto.png';
import Another400 from './../../img/400/another.png';
import Book400 from './../../img/400/book.png';
import Build400 from './../../img/400/build.png';
import Child400 from './../../img/400/child.png';
import Clothers400 from './../../img/400/clothers.png';
import Cosmetic400 from './../../img/400/cosmetic.png';
import Electronics400 from './../../img/400/electronics.png';
import Flora400 from './../../img/400/flora.png';
import Food400 from './../../img/400/food.png';
import Furniture400 from './../../img/400/furniture.png';
import Music400 from './../../img/400/music.png';
import Old400 from './../../img/400/old.png';
import Home400 from './../../img/400/home.png';
import Repair400 from './../../img/400/repair.png';
import Pencil400 from './../../img/400/pencil.png';
import Play400 from './../../img/400/play.png';
import Sport400 from './../../img/400/sport.png';
import Sports400 from './../../img/400/sports.png';
import Technic400 from './../../img/400/technic.png';
import Question400 from './../../img/400/question.png';
import Online400 from './../../img/400/online.png';

import Animal100 from './../../img/100/animal.png';
import Animals100 from './../../img/100/animals.png';
import Auto100 from './../../img/100/auto.png';
import Another100 from './../../img/100/another.png';
import Book100 from './../../img/100/book.png';
import Build100 from './../../img/100/build.png';
import Child100 from './../../img/100/child.png';
import Clothers100 from './../../img/100/clothers.png';
import Cosmetic100 from './../../img/100/cosmetic.png';
import Electronics100 from './../../img/100/electronics.png';
import Flora100 from './../../img/100/flora.png';
import Food100 from './../../img/100/food.png';
import Furniture100 from './../../img/100/furniture.png';
import Music100 from './../../img/100/music.png';
import Old100 from './../../img/100/old.png';
import Home100 from './../../img/100/home.png';
import Repair100 from './../../img/100/repair.png';
import Pencil100 from './../../img/100/pencil.png';
import Play100 from './../../img/100/play.png';
import Sport100 from './../../img/100/sport.png';
import Sports100 from './../../img/100/sports.png';
import Technic100 from './../../img/100/technic.png';
import Question100 from './../../img/100/question.png';
import Online100 from './../../img/100/online.png';

import Animal50 from './../../img/50/animal.png';
import Another50 from './../../img/50/another.png';
import Book50 from './../../img/50/book.png';
import Build50 from './../../img/50/build.png';
import Child50 from './../../img/50/child.png';
import Clothers50 from './../../img/50/clothers.png';
import Cosmetic50 from './../../img/50/cosmetic.png';
import Electronics50 from './../../img/50/electronics.png';
import Flora50 from './../../img/50/flora.png';
import Food50 from './../../img/50/food.png';
import Furniture50 from './../../img/50/furniture.png';
import Music50 from './../../img/50/music.png';
import Old50 from './../../img/50/old.png';
import Pencil50 from './../../img/50/pencil.png';
import Play50 from './../../img/50/play.png';
import Sport50 from './../../img/50/sport.png';
import Question50 from './../../img/50/question.png';

import Animal30 from './../../img/30/animal.png';
import Another30 from './../../img/30/another.png';
import Book30 from './../../img/30/book.png';
import Build30 from './../../img/30/build.png';
import Child30 from './../../img/30/child.png';
import Clothers30 from './../../img/30/clothers.png';
import Cosmetic30 from './../../img/30/cosmetic.png';
import Electronics30 from './../../img/30/electronics.png';
import Flora30 from './../../img/30/flora.png';
import Food30 from './../../img/30/food.png';
import Furniture30 from './../../img/30/furniture.png';
import Music30 from './../../img/30/music.png';
import Old30 from './../../img/30/old.png';
import Pencil30 from './../../img/30/pencil.png';
import Play30 from './../../img/30/play.png';
import Sport30 from './../../img/30/sport.png';
import Question30 from './../../img/30/question.png';

import './categories.css';
import { Subcategories } from './Subcategories';
import {
	CategoryAnimals,
	CategoryNo,
	CategoryAnother,
	CategoryBooks,
	CategoryBuild,
	CategoryChildren,
	CategoryClothers,
	CategoryElectronics,
	CategoryTechnic,
	CategoryGarden,
	CategoryFurniture,
	CategoryHobby,
	CategoryHealth,
	CategoryAuto,
	CategorySport,
	CategoryOffice,
	CategoryHome,
	CategoryOnline,
} from './const';
import { ColumnsFunc } from '../../panels/template/columns';

export function GetCategory400(category) {
	let image = Another400;
	switch (category) {
		case CategoryAnimals:
			image = Animals400;
			break;
		case CategoryBooks:
			image = Book400;
			break;
		case CategoryBuild:
			image = Repair400;
			break;
		case CategoryChildren:
			image = Child400;
			break;
		case CategoryClothers:
			image = Clothers400;
			break;
		// case CategoryCosmetic:
		// 	image = Cosmetic400;
		// 	break;
		case CategoryElectronics:
			image = Electronics400;
			break;
		case CategoryTechnic:
			image = Technic400;
			break;
		case CategoryGarden:
			image = Flora400;
			break;
		// case CategoryFood:
		// 	image = Food400;
		// 	break;
		case CategoryFurniture:
			image = Furniture400;
			break;
		case CategoryHobby:
			image = Music400;
			break;
		case CategoryHealth:
			image = Old400;
			break;
		case CategoryAuto:
			image = Auto400;
			break;
		case CategorySport:
			image = Sports400;
			break;
		case CategoryOffice:
			image = Pencil400;
			break;
		case CategoryHome:
			image = Home400;
			break;
		case CategoryOnline:
			image = Online400;
			break;
		// case CategoryPlay:
		// 	image = Play400;
		// 	break;
		case CategoryNo:
			image = Question400;
			break;
	}
	return image;
}

export function GetCategory100(category) {
	let image = Another100;
	switch (category) {
		case CategoryAnimals:
			image = Animals100;
			break;
		case CategoryBooks:
			image = Book100;
			break;
		case CategoryBuild:
			image = Repair100;
			break;
		case CategoryChildren:
			image = Child100;
			break;
		case CategoryClothers:
			image = Clothers100;
			break;
		// case CategoryCosmetic:
		// 	image = Cosmetic100;
		// 	break;
		case CategoryElectronics:
			image = Electronics100;
			break;
		case CategoryTechnic:
			image = Technic100;
			break;
		case CategoryGarden:
			image = Flora100;
			break;
		// case CategoryFood:
		// 	image = Food100;
		// 	break;
		case CategoryFurniture:
			image = Furniture100;
			break;
		case CategoryHobby:
			image = Music100;
			break;
		case CategoryHealth:
			image = Old100;
			break;
		case CategoryAuto:
			image = Auto100;
			break;
		case CategorySport:
			image = Sports100;
			break;
		// case CategoryPlay:
		// 	image = Play100;
		// 	break;
		case CategoryOffice:
			image = Pencil100;
			break;
		case CategoryHome:
			image = Home100;
			break;
		case CategoryOnline:
			image = Online100;
			break;
		case CategoryNo:
			image = Question100;
			break;
	}
	return image;
}

export function GetCategory50(category) {
	let image = Another50;
	switch (category) {
		case CategoryAnimals:
			image = Animal50;
			break;
		case CategoryBooks:
			image = Book50;
			break;
		case CategoryBuild:
			image = Build50;
			break;
		case CategoryChildren:
			image = Child50;
			break;
		case CategoryClothers:
			image = Clothers50;
			break;
		// case CategoryCosmetic:
		// 	image = Cosmetic50;
		// 	break;
		case CategoryElectronics:
			image = Electronics50;
			break;
		case CategoryTechnic:
			image = Electronics50;
			break;
		case CategoryGarden:
			image = Flora50;
			break;
		// case CategoryFood:
		// 	image = Food50;
		// 	break;
		case CategoryFurniture:
			image = Furniture50;
			break;
		case CategoryHobby:
			image = Music50;
			break;
		case CategoryHealth:
			image = Old50;
			break;
		case CategoryAuto:
			image = Pencil50;
			break;
		case CategoryOffice:
			image = Pencil50;
			break;
		case CategoryHome:
			image = Pencil50;
			break;
		case CategoryOnline:
			image = Pencil50;
			break;
		// case CategoryPlay:
		// 	image = Play50;
		// 	break;
		case CategorySport:
			image = Sport50;
			break;
		case CategoryNo:
			image = Question50;
			break;
	}
	return image;
}

export function GetCategory30(category) {
	let image = Another30;
	switch (category) {
		case CategoryAnimals:
			image = Animal30;
			break;
		case CategoryBooks:
			image = Book30;
			break;
		case CategoryBuild:
			image = Build30;
			break;
		case CategoryChildren:
			image = Child30;
			break;
		case CategoryClothers:
			image = Clothers30;
			break;
		// case CategoryCosmetic:
		// 	image = Cosmetic30;
		// 	break;
		case CategoryElectronics:
			image = Electronics30;
			break;
		case CategoryTechnic:
			image = Electronics30;
			break;
		case CategoryGarden:
			image = Flora30;
			break;
		// case CategoryFood:
		// 	image = Food30;
		// 	break;
		case CategoryFurniture:
			image = Furniture30;
			break;
		case CategoryHobby:
			image = Music30;
			break;
		case CategoryHealth:
			image = Old30;
			break;
		case CategoryAuto:
			image = Pencil30;
			break;
		case CategoryOffice:
			image = Pencil30;
			break;
		case CategoryHome:
			image = Pencil30;
			break;
		case CategoryOnline:
			image = Pencil30;
			break;
		// case CategoryPlay:
		// 	image = Play30;
		// 	break;
		case CategorySport:
			image = Sport30;
			break;
		case CategoryNo:
			image = Question30;
			break;
	}
	return image;
}

export function GetCategory(category) {
	let image = Another;
	switch (category) {
		case CategoryAnimals:
			image = Animal;
			break;
		case CategoryBooks:
			image = Book;
			break;
		case CategoryBuild:
			image = Build;
			break;
		case CategoryChildren:
			image = Child;
			break;
		case CategoryClothers:
			image = Clothers;
			break;
		// case CategoryCosmetic:
		// 	image = Cosmetic;
		// 	break;
		case CategoryElectronics:
			image = Electronics;
			break;
		case CategoryTechnic:
			image = Electronics;
			break;
		case CategoryGarden:
			image = Flora;
			break;
		// case CategoryFood:
		// 	image = Food;
		// 	break;
		case CategoryFurniture:
			image = Furniture;
			break;
		case CategoryHobby:
			image = Music;
			break;
		case CategoryHealth:
			image = Old;
			break;
		case CategoryAuto:
			image = Pencil;
			break;
		case CategoryOffice:
			image = Pencil;
			break;
		case CategoryHome:
			image = Pencil;
			break;
		case CategoryOnline:
			image = Pencil;
			break;
		// case CategoryPlay:
		// 	image = Play;
		// 	break;
		case CategorySport:
			image = Sport;
			break;
		case CategoryNo:
			image = Question;
			break;
	}
	return image;
}

export function GetCategoryText(category) {
	switch (category) {
		case CategoryAnimals:
			return 'Животные';
		case CategoryBooks:
			return 'Книги';
		case CategoryBuild:
			return 'Стройматериалы и инструменты';
		case CategoryChildren:
			return 'Товары для детей';
		case CategoryClothers:
			return 'Одежда, обувь и сумки';
		// case CategoryCosmetic:
		// 	return 'Косметика, бижутерия, парфюмерия';
		case CategoryElectronics:
			return 'Электроника';
		case CategoryTechnic:
			return 'Бытовая техника';
		case CategoryGarden:
			return 'Дача и огород';
		// case CategoryFood:
		// 	return 'Продукты питания';
		case CategoryFurniture:
			return 'Мебель';
		case CategoryHobby:
			return 'Игры и хобби';
		case CategoryHealth:
			return 'Здоровье';
		case CategoryAuto:
			return 'Автозапчасти';
		case CategoryOffice:
			return 'Офисные и письменные принадлежности';
		// case CategoryPlay:
		// 	return 'Игры и развлечения';
		case CategoryHome:
			return 'Для дома';
		case CategoryOnline:
			return 'Цифровые товары';
		case CategorySport:
			return 'Спорт и отдых';
		case CategoryNo:
			return 'Все категории';
	}
	return 'Другое';
}

export function GetCategoryImageBig(category) {
	let image = GetCategory400(category);
	return <img src={image} className="category100" />;
}

export function GetCategoryImage100(category) {
	let image = GetCategory100(category);
	return <img src={image} className="category100v" />;
}

export function GetCategoryImageSmall(category) {
	let image = GetCategory30(category);
	return <img src={image} className="category30" />;
}

// https://casesandberg.github.io/react-color/
const ColorsS1 = [
	'#F44336',
	'#E91E63',
	'#9C27B0',
	'#FFC107',

	'#FFC107',
	'#FFEB3B',
	'#03A9F4',
	'#CDDC39',

	'#FF5722',
	'#FFEB3B',
	'#8BC34A',
	'#00BCD4',

	'#4CAF50',
	'#2196F3',
	'#FF9800',
	'#009688',
];

const ColorsS0 = [
	'#E5B6B3',
	'#E5B3C4',
	'#DEB3E5',
	'#B3E5E1',

	'#B3BAE5',
	'#B3CFE5',
	'#C5B3E5',
	'#B3E5B5',

	'#CEE5B3',
	'#E1E5B3',
	'#E0E8D7',
	'#B3D5E5',

	'#E5BFB3',
	'#FAFFCD',
	'#FFE7CD',
	'#B7E9E7',
];

const Colors2 = [
	'#FFCFD3',
	'#FFCFC1',
	'#FFE7CD',
	'#FAFFCD',
	'#DDF5D9',
	'#B9E8D3',
	'#B7E9E6',
	'#B7D4E9',
	'#B7C3E9',
	'#C4B7E9',
	'#B3BFE6',
	'#9683C6',
	'#BF9DD4',
	'#E9C6E5',
	'#E9DEC3',
	'#E0E8D7',
];

const cFrom = reverse(ColorsS1); //shuffle(ColorsS0)
const cTo = ColorsS0; //shuffle(ColorsS1)

function reverse(arr) {
	let array = [...arr];
	let output = [];
	while (array.length) {
		output.push(array.pop());
	}

	return output;
}

const Colors1 = [
	'#F6FFB2',
	'#9AE990',
	'#2BD397',
	'#1DCFC9',
	'#6579C7',
	'#6844B3',
	'#8F47B0',
	'#CD5BB5',
	'#FF666F',
	'#FF8477',
	'#FDAC76',
	'#FED37D',
	'#62BEFF',
	'#62FFC5',
];

export const categories = [
	CategoryOnline,
	CategoryClothers,
	CategoryBooks,
	CategoryHealth,
	CategoryChildren,
	CategoryAnimals,
	// CategoryCosmetic,
	CategoryAuto,
	CategoryHome,
	CategoryGarden,
	// CategoryFood,
	CategoryFurniture,
	CategorySport,
	// CategoryMusic,
	CategoryElectronics,
	CategoryBuild,
	CategoryOffice,
	// CategoryPlay,
	CategoryHobby,
	CategoryTechnic,
	//CategoryAnother,
];

function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue,
		randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

const width = document.body.clientWidth;

export const CategoriesStruct = {
	grouping: true,
	showAll: true,
	getTextFunc: null,
	getImageFunc: GetCategoryImage100,
	filterFunc: null,
	header: 'Выберите категорию',
	data: [
		{
			header: null,
			array: categories,
			oneCellStyle: (v, i) => (
				<div
					className="categories-outter"
					style={{
						background: `linear-gradient(to top left, ${cFrom[i]}, ${cTo[i]})`,
					}}
				>
					{v}
				</div>
			),

			listCellStyle: (gr) => ColumnsFunc(width < 200, gr, 0, width < 500 ? 2 : width < 1000 ? 4 : 8),
			search: (arr, searchText) => {
				if (searchText == '') {
					return arr;
				}

				const first = arr.filter((v) => v.toLowerCase().indexOf(searchText) != -1);
				let second = Subcategories.filter((s) => {
					return (
						s.data.filter((d) => {
							return d.array.filter((v) => v.toLowerCase().indexOf(searchText) != -1).length > 0;
						}).length > 0
					);
				});
				second = [...first, ...second.map((v) => v.header)];
				second = second.filter((a, i) => second.indexOf(a) == i);
				return second;
			},
		},
	],
};
