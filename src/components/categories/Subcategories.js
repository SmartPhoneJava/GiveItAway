import {
	CategoryAnimals,
	CategoryBooks,
	CategoryBuild,
	CategoryChildren,
	CategoryClothers,
	CategoryElectronics,
	CategoryGarden,
	CategoryFurniture,
	CategoryHobby,
	CategoryHealth,
	CategoryAuto,
	CategoryTechnic,
	CategorySport,
	CategoryOffice,
	CategoryHome,
	CategoryOnline,
} from './const';
import { AnimalStruct } from './subcategories/animal';
import { BooksStruct } from './subcategories/books';
import { BuildStruct } from './subcategories/build';
import { ChildStruct } from './subcategories/child';
import { ClothesStruct } from './subcategories/clothers';
import { ElectronicsStruct } from './subcategories/electronics';
import { GardenStruct } from './subcategories/garden';
import { FurnitureStruct } from './subcategories/furniture';
import { HobbyStruct } from './subcategories/hobby';
import { HealthStruct } from './subcategories/health';
import { AutoStruct } from './subcategories/auto';
import { TechnicStruct } from './subcategories/technic';
import { SportStruct } from './subcategories/sport';
import { OfficeStruct } from './subcategories/office';
import { HomeStruct } from './subcategories/home';
import { OnlineStruct } from './subcategories/online';

export function GetGroups(category) {
	let groups = ChildStruct;
	switch (category) {
		case CategoryAnimals:
			groups = AnimalStruct;
			break;
		case CategoryBooks:
			groups = BooksStruct;
			break;
		case CategoryBuild:
			groups = BuildStruct;
			break;
		case CategoryChildren:
			groups = ChildStruct;
			break;
		case CategoryClothers:
			groups = ClothesStruct;
			break;
		case CategoryElectronics:
			groups = ElectronicsStruct;
			break;
		case CategoryGarden:
			groups = GardenStruct;
			break;
		case CategoryFurniture:
			groups = FurnitureStruct;
			break;
		case CategoryHobby:
			groups = HobbyStruct;
			break;
		case CategoryHealth:
			groups = HealthStruct;
			break;
		case CategoryAuto:
			groups = AutoStruct;
			break;
		case CategoryTechnic:
			groups = TechnicStruct;
			break;
		case CategorySport:
			groups = SportStruct;
			break;
		case CategoryOffice:
			groups = OfficeStruct;
			break;
		case CategorySport:
			groups = SportStruct;
			break;
		case CategoryHome:
			groups = HomeStruct;
			break;
		case CategoryOnline:
			groups = OnlineStruct;
			break;
	}
	return groups;
}

export const Subcategories = [
	AnimalStruct,
	BooksStruct,
	BuildStruct,
	ChildStruct,
	ClothesStruct,
	ElectronicsStruct,
	GardenStruct,
	FurnitureStruct,
	HobbyStruct,
	HealthStruct,
	AutoStruct,
	TechnicStruct,
	SportStruct,
	OfficeStruct,
	SportStruct,
	HomeStruct,
	OnlineStruct,
];
