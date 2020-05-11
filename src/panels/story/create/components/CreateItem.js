import React, { useState, useEffect } from 'react';
import {
	FormLayout,
	Input,
	Header,
	Card,
	CardGrid,
	InfoRow,
	Group,
	Textarea,
	File,
	HorizontalScroll,
	Avatar,
	Snackbar,
	Placeholder,
} from '@vkontakte/vkui';

import 'react-photoswipe/lib/photoswipe.css';
import { PhotoSwipe, PhotoSwipeGallery } from 'react-photoswipe';

import { setFormData } from './../../../../store/create_post/actions';
import { CREATE_AD_ITEM, EDIT_MODE } from './../../../../store/create_post/types';

import CategoriesLabel from './../../../../components/categories/label';
import { FORM_CREATE } from './../../../../components/categories/redux';

import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24Camera from '@vkontakte/icons/dist/24/camera';
import Icon24Favorite from '@vkontakte/icons/dist/24/favorite';

import Icon48Camera from '@vkontakte/icons/dist/48/camera';

import { connect } from 'react-redux';

import { SNACKBAR_DURATION_DEFAULT } from '../../../../store/const';
import { loadPhotos, MAX_FILE_SIZE } from '../../../../services/file';

import { PHOTO_TEXT } from '../../../../const/create';

import './createItem.css';
import { closeSnackbar, openSnackbar } from '../../../../store/router/actions';

const nameLabel = 'Название';
const descriptionLabel = 'Описание';

const CreateItem = (props) => {
	const { AD, defaultInputData, setFormData, openSnackbar, closeSnackbar } = props;
	const inputData = props.inputData[CREATE_AD_ITEM] || defaultInputData;
	const name = props.inputData[CREATE_AD_ITEM].name || "";
	const description = props.inputData[CREATE_AD_ITEM].description || "";
	const photosUrl = props.inputData[CREATE_AD_ITEM].photosUrl || "";

	// const [inputData, setInputData] = useState(props.inputData[CREATE_AD_ITEM] || props.defaultInputData);
	const needEdit = props.inputData[EDIT_MODE] ? props.inputData[EDIT_MODE].mode : false;
	const handleInput = (e) => {
		let value = e.currentTarget.value;
		setFormData(CREATE_AD_ITEM, {
			...inputData,
			[e.currentTarget.name]: value,
		});
		// setInputData({
		// 	...inputData,
		// 	[e.currentTarget.name]: value,
		// });
	};

	const [isOpen, setIsOpen] = useState(false);
	const [options, setOptions] = useState({});

	const handleClose = () => {
		setIsOpen(false);
	};

	const openPhotoSwipe = (i) => {
		setOptions({
			closeOnScroll: false,
			index: i,
		});
		setIsOpen(true);
	};

	const { platform } = props;

	function handleWrongSize(file) {
		openSnackbar(
			<Snackbar
				duration={SNACKBAR_DURATION_DEFAULT}
				onClose={closeSnackbar}
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

	function handleWrongType(file) {
		openSnackbar(
			<Snackbar
				duration={SNACKBAR_DURATION_DEFAULT}
				onClose={closeSnackbar}
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

	const loadPhoto = (e) => {
		loadPhotos(
			e,
			handleWrongSize,
			handleWrongType,
			(value) => {
				let photosUrl;
				if (!inputData.photosUrl) {
					photosUrl = [value];
				} else {
					photosUrl = [...inputData.photosUrl, value];
				} // setInputData({
				// 	...inputData,
				// 	photosUrl,
				// });
				console.log("PHOTO_TEXT", PHOTO_TEXT)
				const photoText = "" + PHOTO_TEXT + '. Загружено ' + photosUrl.length + '/3';
				setFormData(CREATE_AD_ITEM, {
					...inputData,
					photosUrl,
					photoText,
				});
				
			},
			() => {
				// let photoText;
				// if (!inputData.photosUrl) {
				// 	photoText = PHOTO_TEXT + '. Загружено 0/3';
				// } else {
				// 	photoText = PHOTO_TEXT + '. Загружено ' + (inputData.photosUrl.length + 1) + '/3';
				// }
				// // setInputData({
				// // 	...inputData,
				// // 	photoText,
				// // });
				// setFormData(CREATE_AD_ITEM, {
				// 	...inputData,
				// 	photoText,
				// });
			}
		);
	};

	function deletePhoto(i) {
		const photoText = PHOTO_TEXT + '. Загружено ' + (inputData.photosUrl.length - 1) + '/3';
		const photosUrl = [...inputData.photosUrl.slice(0, i), ...inputData.photosUrl.slice(i + 1)];
		// setInputData({
		// 	...inputData,
		// 	photoText,
		// });
		// setInputData({
		// 	...inputData,
		// 	photosUrl,
		// });
		setFormData(CREATE_AD_ITEM, {
			...inputData,
			photoText,
			photosUrl,
		});
	}

	function openPhotos(i) {
		// if (platform != 'desktop_web' && platform != 'mobile_web') {
		// 	bridge.send('VKWebAppShowImages', {
		// 		images: inputData.photosUrl.map((v) => v.src),
		// 	});
		// } else {
		openPhotoSwipe(i);
		// }
	}

	const photoSwipeImgs = inputData.photosUrl
		? inputData.photosUrl.map((v) => {
				let img = new Image();
				const src = v.src ? v.src : v.PhotoUrl;
				img.src = v.src;
				let width = img.width;
				let hight = img.height;
				return {
					src: v.src,
					msrc: v.src,
					w: width,
					h: hight,
					thumbnail: v.src,
				};
		  })
		: [];

	return (
		<>
			{!needEdit ? (
				<PhotoSwipe
					style={{ marginTop: '50px' }}
					isOpen={isOpen}
					items={photoSwipeImgs}
					options={options}
					onClose={handleClose}
				/>
			) : (
				''
			)}
			<CardGrid>
				<Card size="l">
					<div
						style={{
							display: platform == 'desktop_web' ? 'flex' : 'block',
							alignItems: 'flex-start',
						}}
					>
						<div
							style={{
								paddingLeft: '10px',
							}}
						>
							<CategoriesLabel open={props.openCategories} redux_form={FORM_CREATE} />
						</div>
						<FormLayout>
							<Input
								top={nameLabel}
								name="name"
								size="50"
								placeholder="футбольный мяч"
								value={name}
								onChange={handleInput}
							/>
						</FormLayout>
					</div>
					<div>
						<FormLayout>
							<Textarea
								top={descriptionLabel}
								name="description"
								placeholder="Количество, состояние, габариты, дата покупки, особенности и т.д."
								value={description}
								onChange={handleInput}
							/>
						</FormLayout>
					</div>
				</Card>
			</CardGrid>
			<FormLayout>
				<Group
					header={<Header>Снимки</Header>}
					style={{
						display: platform == 'desktop_web' ? 'flex' : 'block',
						textAlign: 'center',
					}}
				>
					{inputData.photosUrl && inputData.photosUrl.length > 0 ? (
						<>
							{needEdit ? null : (
								<>
									<File
										before={<Icon24Camera />}
										disabled={inputData.photosUrl.length == 3}
										mode={inputData.photosUrl.length == 3 ? 'secondary' : 'primary'}
										onChange={loadPhoto}
									>
										Загрузить
									</File>
									<InfoRow
										style={{
											color: 'var(--text_secondary)',
											marginTop: '6px',
											paddingLeft: '6px',
											paddingRight: '6px',
										}}
									>
										{inputData.photoText}
									</InfoRow>
								</>
							)}

							<HorizontalScroll>
								<div style={{ display: 'flex', marginLeft: '10px', marginRight: '10px' }}>
									{inputData.photosUrl.map((img, i) => {
										if (needEdit) {
											img.src = img.PhotoUrl;
											img.id = img.AdPhotoId;
										}
										return (
											<div key={img.id} style={{ padding: '4px' }}>
												<div className="create-photo-panel">
													<img
														onClick={() => openPhotos(i)}
														src={img.src}
														className="create-photo"
													/>
													{needEdit ? null : (
														<div
															onClick={() => deletePhoto(i)}
															className="create-photo-delete"
														>
															<Icon24Cancel />
														</div>
													)}
												</div>
											</div>
										);
									})}
								</div>
							</HorizontalScroll>
						</>
					) : (
						<Placeholder
							header="Ничего не загружено"
							icon={<Icon48Camera />}
							action={
								<File
									top="Снимки вещей"
									disabled={inputData.photosUrl && inputData.photosUrl.length == 3}
									mode={
										inputData.photosUrl && inputData.photosUrl.length == 3 ? 'secondary' : 'primary'
									}
									onChange={loadPhoto}
								>
									Загрузить
								</File>
							}
						>
							{inputData.photoText}
						</Placeholder>
					)}
				</Group>
			</FormLayout>
		</>
	);
};

const mapStateToProps = (state) => {
	return {
		platform: state.vkui.platform,
		inputData: state.formData.forms,

		AD: state.ad,
	};
};

const mapDispatchToProps = {
	setFormData,
	closeSnackbar,
	openSnackbar,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateItem);

// 342 -> 296 -> 336
