import { CategoryNo } from "../components/categories/const";
import { NoRegion } from "../components/location/const";
import { TYPE_CHOICE } from "./ads";

export const PHOTO_TEXT = '';

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