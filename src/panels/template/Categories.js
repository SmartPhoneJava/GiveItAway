import React, { useState } from 'react';
import { Div, FormLayout, FormLayoutGroup, Radio, SelectMimicry } from '@vkontakte/vkui';

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
import Pencil400 from './../../img/400/pencil.png';
import Play400 from './../../img/400/play.png';
import Sport400 from './../../img/400/sport.png';
import Question400 from './../../img/400/question.png';

import Animal100 from './../../img/100/animal.png';
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
import Pencil100 from './../../img/100/pencil.png';
import Play100 from './../../img/100/play.png';
import Sport100 from './../../img/100/sport.png';
import Question100 from './../../img/100/question.png';

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

export const CategoryNo = 'не определена';
export const CategoryAnimals = 'animals';
export const CategoryAnother = 'another';
export const CategoryBooks = 'books';
export const CategoryBuild = 'build';
export const CategoryChildren = 'children';
export const CategoryClothers = 'clothers';
export const CategoryCosmetic = 'cosmetic';
export const CategoryElectronics = 'electronics';
export const CategoryFlora = 'flora';
export const CategoryFood = 'food';
export const CategoryFurniture = 'furniture';
export const CategoryMusic = 'music';
export const CategoryOld = 'old';
export const CategoryPencil = 'pencil';
export const CategoryPlay = 'play';
export const CategorySport = 'sport';

import './categories.css';

export function GetCategory400(category) {
	let image = Another400;
	switch (category) {
		case CategoryAnimals:
			image = Animal400;
			break;
		case CategoryBooks:
			image = Book400;
			break;
		case CategoryBuild:
			image = Build400;
			break;
		case CategoryChildren:
			image = Child400;
			break;
		case CategoryClothers:
			image = Clothers400;
			break;
		case CategoryCosmetic:
			image = Cosmetic400;
			break;
		case CategoryElectronics:
			image = Electronics400;
			break;
		case CategoryFlora:
			image = Flora400;
			break;
		case CategoryFood:
			image = Food400;
			break;
		case CategoryFurniture:
			image = Furniture400;
			break;
		case CategoryMusic:
			image = Music400;
			break;
		case CategoryOld:
			image = Old400;
			break;
		case CategoryPencil:
			image = Pencil400;
			break;
		case CategoryPlay:
			image = Play400;
			break;
		case CategorySport:
			image = Sport400;
			break;
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
			image = Animal100;
			break;
		case CategoryBooks:
			image = Book100;
			break;
		case CategoryBuild:
			image = Build100;
			break;
		case CategoryChildren:
			image = Child100;
			break;
		case CategoryClothers:
			image = Clothers100;
			break;
		case CategoryCosmetic:
			image = Cosmetic100;
			break;
		case CategoryElectronics:
			image = Electronics100;
			break;
		case CategoryFlora:
			image = Flora100;
			break;
		case CategoryFood:
			image = Food100;
			break;
		case CategoryFurniture:
			image = Furniture100;
			break;
		case CategoryMusic:
			image = Music100;
			break;
		case CategoryOld:
			image = Old100;
			break;
		case CategoryPencil:
			image = Pencil100;
			break;
		case CategoryPlay:
			image = Play100;
			break;
		case CategorySport:
			image = Sport100;
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
		case CategoryCosmetic:
			image = Cosmetic50;
			break;
		case CategoryElectronics:
			image = Electronics50;
			break;
		case CategoryFlora:
			image = Flora50;
			break;
		case CategoryFood:
			image = Food50;
			break;
		case CategoryFurniture:
			image = Furniture50;
			break;
		case CategoryMusic:
			image = Music50;
			break;
		case CategoryOld:
			image = Old50;
			break;
		case CategoryPencil:
			image = Pencil50;
			break;
		case CategoryPlay:
			image = Play50;
			break;
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
		case CategoryCosmetic:
			image = Cosmetic30;
			break;
		case CategoryElectronics:
			image = Electronics30;
			break;
		case CategoryFlora:
			image = Flora30;
			break;
		case CategoryFood:
			image = Food30;
			break;
		case CategoryFurniture:
			image = Furniture30;
			break;
		case CategoryMusic:
			image = Music30;
			break;
		case CategoryOld:
			image = Old30;
			break;
		case CategoryPencil:
			image = Pencil30;
			break;
		case CategoryPlay:
			image = Play30;
			break;
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
		case CategoryCosmetic:
			image = Cosmetic;
			break;
		case CategoryElectronics:
			image = Electronics;
			break;
		case CategoryFlora:
			image = Flora;
			break;
		case CategoryFood:
			image = Food;
			break;
		case CategoryFurniture:
			image = Furniture;
			break;
		case CategoryMusic:
			image = Music;
			break;
		case CategoryOld:
			image = Old;
			break;
		case CategoryPencil:
			image = Pencil;
			break;
		case CategoryPlay:
			image = Play;
			break;
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
		case CategoryCosmetic:
			return 'Косметика, бижутерия, парфюмерия';
		case CategoryElectronics:
			return 'Бытовая техника и электроника';
		case CategoryFlora:
			return 'Растения';
		case CategoryFood:
			return 'Продукты питания';
		case CategoryFurniture:
			return 'Мебель';
		case CategoryMusic:
			return 'Музыкальные инструменты';
		case CategoryOld:
			return 'Средства реабилитации';
		case CategoryPencil:
			return 'Канцтовары';
		case CategoryPlay:
			return 'Игры и развлечения';
		case CategorySport:
			return 'Спортивный инвентарь';
		case CategoryNo:
			return 'Не определена';
	}
	return 'Другое';
}

export function GetCategoryImageBig(category) {
	let image = GetCategory100(category);
	return <img src={image} className="category100" />;
}

export function GetCategoryImage(category) {
	let image = GetCategory50(category);
	return (
		<img
			src={image}
			style={{
				transition: 'margin .5s',
				margin: '5px',
			}}
		/>
	);
}

export function GetCategoryImageSmall(category) {
	let image = GetCategory30(category);
	return <img src={image} className="category30" />;
}

export const categories = [
	CategoryNo,
	CategoryAnimals,
	CategoryBooks,
	CategoryBuild,
	CategoryChildren,
	CategoryClothers,
	CategoryCosmetic,
	CategoryElectronics,
	CategoryFlora,
	CategoryFood,
	CategoryFurniture,
	CategoryMusic,
	CategoryOld,
	CategoryPencil,
	CategoryPlay,
	CategorySport,
	CategoryAnother,
];

export const CategoriesLabel = (props) => {
	return (
		<div
			style={{
				display: 'flex',
				alignContent: 'center',
				alignItems: 'center',
				color: 'red',
				// color: "var(--text_primary)",
				paddingLeft: props.leftMargin,
			}}
		>
			{GetCategoryImage(props.category)}
			<FormLayout style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'red' }}>
				<SelectMimicry
					top="Категория"
					style={{
						display: 'flex',
						alignContent: 'center',
						alignItems: 'center',
						color: 'red',
						// color: "var(--text_primary)",
						paddingLeft: props.leftMargin,
					}}
					value={GetCategoryText(props.category)}
					placeholder={GetCategoryText(props.category)}
					onClick={() => props.open()}
				/>
			</FormLayout>
		</div>
	);
};

export const CategoriesRB = (props) => {
	return (
		<FormLayout>
			<FormLayoutGroup>
				{categories.map((cat, i) => {
					if (props.category != cat) {
						return (
							<Radio
								key={i}
								name="cat"
								value={cat}
								onClick={(e) => {
									const { _, value } = e.currentTarget;
									props.choose(value);
								}}
							>
								{GetCategoryText(cat)}
							</Radio>
						);
					}
					return (
						<Radio
							key={i}
							name="cat"
							value={cat}
							defaultChecked
							onClick={(e) => {
								const { _, value } = e.currentTarget;
								props.choose(value);
							}}
						>
							{GetCategoryText(cat)}
						</Radio>
					);
				})}
			</FormLayoutGroup>
		</FormLayout>
	);
};
