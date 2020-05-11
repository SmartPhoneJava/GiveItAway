import { CategoryNo } from "../components/categories/Categories";
import { NoRegion } from "../components/location/const";
import { TYPE_CHOICE } from "./ads";

export const PHOTO_TEXT = 'Не более трех фотографий (jpeg, png) размером 4мб';

export const defaultInputData = {
	photoText: PHOTO_TEXT,
	name: '',
	description: '',
	photosUrl: [],
	type: TYPE_CHOICE,
	ls_enabled: true,
	comments_enabled: true,
	extra_enabled: true,
	category: CategoryNo,
	city: NoRegion,
	country: NoRegion,
};