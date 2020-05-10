import { CategoryNo } from "../components/categories/Categories";
import { NoRegion } from "../components/location/const";

const PHOTO_TEXT = 'Не более трех фотографий (jpeg, png) размером 4мб';

export const defaultInputData = {
	photoText: PHOTO_TEXT,
	name: '',
	description: '',
	photosUrl: [],
	ls: true,
	comments: true,
	type: 'choice',
	category: CategoryNo,
	city: NoRegion,
	country: NoRegion,
};