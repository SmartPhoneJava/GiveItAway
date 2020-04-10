import React, { useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
	FormLayout,
	Input,
	Button,
	Card,
	CardGrid,
	InfoRow,
	Div,
	Textarea,
	File,
	HorizontalScroll,
	Avatar,
	Snackbar,
} from '@vkontakte/vkui';

import { CategoriesLabel } from './../../../template/Categories';

import Icon24Camera from '@vkontakte/icons/dist/24/camera';
import Icon24Favorite from '@vkontakte/icons/dist/24/favorite';
import Icon24Delete from '@vkontakte/icons/dist/24/delete';

import Man from './../../../../img/man.jpeg';

const nameLabel = 'Название';
const categoryLabel = 'Категория';
const descriptionLabel = 'Описание';

const MAX_FILE_SIZE = 1024 * 1024 * 4;

const PHOTO_TEXT = 'Не более трех фотографий (jpeg, png) размером 4мб';

let KEY = 0;

const CreateItem = (props) => {
	const [photoText, setPhotoText] = useState(PHOTO_TEXT);
	const [name, setName] = useState(props.name);
	const [description, setDescription] = useState('');
	const [photosUrl, setPhotosUrl] = useState([]);

	function handleFileSelect(f) {
		var reader = new FileReader();
		// Closure to capture the file information.
		reader.onload = (function (theFile) {
			return function (e) {
				KEY++;
				setPhotosUrl([...photosUrl, { src: e.target.result, id: KEY, origin: theFile }]);
			};
		})(f);
		// Read in the image file as a data URL.
		reader.readAsDataURL(f);
	}

	function checkFileSize(setSnackbar, file) {
		const valid = file.size <= MAX_FILE_SIZE;
		if (!valid) {
			setSnackbar(
				<Snackbar
					duration="2000"
					onClose={() => setSnackbar(null)}
					before={
						<Avatar size={24} style={{ background: 'orange' }}>
							<Icon24Favorite fill="#fff" width={14} height={14} />
						</Avatar>
					}
				>
					Размер файла {(file.size / 1024 / 1024).toFixed(2)}МБ. Максимально допустимый размер:{' '}
					{(MAX_FILE_SIZE / 1024 / 1024).toFixed(2)} МБ
				</Snackbar>
			);
		}
		return valid;
	}

	function checkFileType(setSnackbar, file) {
		const valid = file.type.match('image.*');
		if (!valid) {
			setSnackbar(
				<Snackbar
					duration="2000"
					onClose={() => setSnackbar(null)}
					before={
						<Avatar size={24} style={{ background: 'orange' }}>
							<Icon24Favorite fill="#fff" width={14} height={14} />
						</Avatar>
					}
				>
					Данный формат не поддержирвается. Используйте изображения формата .png, .jpg, .jpeg
				</Snackbar>
			);
		}
		return valid;
	}

	const loadPhoto = (e) => {
		var files = e.target.files; // FileList object
		// Loop through the FileList and render image files as thumbnails.
		for (var i = 0, file; (file = files[i]); i++) {
			if (!file) {
				return;
			}
			if (!checkFileSize(props.setSnackbar, file)) {
				return;
			}
			if (!checkFileType(props.setSnackbar, file)) {
				return;
			}

			const newLength = photosUrl.length + 1;
			setPhotoText(PHOTO_TEXT + '. Загружено ' + newLength + '/3');
			props.setItems({
				name,
				category: props.category,
				description: description,
				photos: [...props.item.photos, file],
			});

			handleFileSelect(file);
			if (newLength == 3) {
				props.setSnackbar(
					<Snackbar
						duration="1200"
						onClose={() => props.setSnackbar(null)}
						before={
							<Avatar size={24} style={{ background: 'orange' }}>
								<Icon24Favorite fill="#fff" width={14} height={14} />
							</Avatar>
						}
					>
						Достигнут лимит фотографий. Чтобы загрузить новые, удалите старые.
					</Snackbar>
				);
			}
		}
	};

	function shortText(str, newLength) {
		if (str.length > newLength) {
			const s = str.slice(0, newLength);
			return s + '...';
		}
		return str;
	}

	return (
		<CardGrid>
			<Card size="l">
				{props.len > 1 ? (
					<Div
						style={{
							display: 'flex',
							justifyContent: 'flex-end',
							padding: '5px',
						}}
					>
						<Button
							mode="destructive"
							onClick={() => {
								props.deleteMe();
							}}
						>
							Удалить
						</Button>
					</Div>
				) : (
					<div />
				)}

				<div
					style={{
						display: props.vkPlatform == 'desktop_web' ? 'flex' : 'block',
						alignItems: 'flex-start',
					}}
				>
					<div
						style={{
							paddingLeft: '10px',
						}}
					>
						<CategoriesLabel category={props.category} open={props.choose} />
					</div>
					<FormLayout>
						<Input
							top={nameLabel}
							name={nameLabel}
							size="50"
							placeholder="футбольный мяч"
							value={name}
							onChange={(e) => {
								const { _, value } = e.currentTarget;
								setName(value);
								props.setItems({
									name: value,
									caregory: props.category,
									description,
									photos: props.item.photos,
								});
							}}
							// status={name && name.length < 100 ? 'valid' : 'error'}
						/>
					</FormLayout>
				</div>
				<Div
					style={{
						padding: '0px',
					}}
				>
					<FormLayout>
						<Textarea
							top={descriptionLabel}
							name={descriptionLabel}
							placeholder="Количество, состояние, габариты, дата покупки, особенности и т.д."
							value={description}
							onChange={(e) => {
								const { _, value } = e.currentTarget;
								setDescription(value);
								props.setItems({
									name,
									category: props.category,
									description: value,
									photos: props.item.photos,
								});
							}}
							// status={description && description.length < 1500 ? 'valid' : 'error'}
						/>
					</FormLayout>
				</Div>
				<FormLayout>
					<Div
						top="Снимки"
						style={{
							display: props.vkPlatform == 'desktop_web' ? 'flex' : 'block',
							padding: '0px',
							textAlign: 'center',
						}}
					>
						<File
							top="Снимки вещей"
							before={<Icon24Camera />}
							disabled={photosUrl.length == 3}
							mode={photosUrl.length == 3 ? 'secondary' : 'primary'}
							onChange={loadPhoto}
						>
							Открыть галерею
						</File>
						<InfoRow
							style={{
								color: 'grey',
								marginTop: '6px',
							}}
						>
							{photoText}
						</InfoRow>
					</Div>
					<Div
						style={{
							display: 'flex',
							alignItems: 'flex-start',
							padding: '0px',
						}}
					>
						<HorizontalScroll>
							<div style={{ display: 'flex' }}>
								{photosUrl.map((img, i) => {
									return (
										<div
											key={img.id}
											style={{
												alignItems: 'center',
												justifyContent: 'center',
												padding: '10px',
											}}
										>
											<Button
												mode="secondary"
												style={{
													height: '120px',
												}}
												onClick={() => {
													if (props.vkPlatform != 'desktop_web') {
														bridge.send('VKWebAppShowImages', {
															images: photosUrl.map((v) => v.src),
														});
													} else {
														var image = new Image();
														image.src = img.src;

														var w = window.open('');
														w.document.write(image.outerHTML);
													}
												}}
											>
												<img
													src={img.src}
													style={{
														height: '120px',
													}}
												/>
											</Button>

											<Button
												before={<Icon24Delete />}
												mode="destructive"
												onClick={() => {
													setPhotoText(
														PHOTO_TEXT + '. Загружено ' + (photosUrl.length - 1) + '/3'
													);
													setPhotosUrl([...photosUrl.slice(0, i), ...photosUrl.slice(i + 1)]);
													props.setItems({
														name: name,
														caregory: props.category,
														description,
														photos: [
															...props.item.photos.slice(0, i),
															...props.item.photos.slice(i + 1),
														],
													});
												}}
											>
												Удалить
											</Button>
										</div>
									);
								})}
							</div>
						</HorizontalScroll>
					</Div>
				</FormLayout>
			</Card>
		</CardGrid>
	);
};

export default CreateItem;
