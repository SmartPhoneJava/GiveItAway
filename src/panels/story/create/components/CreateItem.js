import React, { useState, useEffect, useRef } from 'react';
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
	Spinner,
} from '@vkontakte/vkui';

import 'react-photoswipe/lib/photoswipe.css';
import { PhotoSwipe, PhotoSwipeGallery } from 'react-photoswipe';

import { Transition } from 'react-transition-group';

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
import { closeSnackbar, openSnackbar, setDummy } from '../../../../store/router/actions';
import { CategoryOnline } from '../../../../components/categories/const';

const nameLabel = 'Название';
const descriptionLabel = 'Описание';

const duration = 100;

const allStyles = {
	entering: { opacity: 1, transition: `opacity ${duration}ms ease-in-out` },
	entered: { opacity: 1, transition: `opacity ${duration}ms ease-in-out` },
	exiting: { opacity: 0, transition: `opacity ${duration}ms ease-in-out` },
	exited: { opacity: 0, transition: `opacity ${duration}ms ease-in-out` },
};

const CreateItem = (props) => {
	const { AD, defaultInputData, category } = props;
	const { setFormData, openSnackbar, closeSnackbar, setDummy } = props;
	const inputData = props.inputData[CREATE_AD_ITEM] || defaultInputData;
	const name = props.inputData[CREATE_AD_ITEM].name || '';
	const description = props.inputData[CREATE_AD_ITEM].description || '';

	// const [inputData, setInputData] = useState(props.inputData[CREATE_AD_ITEM] || props.defaultInputData);
	const needEdit = props.inputData[EDIT_MODE] ? props.inputData[EDIT_MODE].mode : false;
	const handleInput = (e) => {
		let value = e.currentTarget.value;
		setFormData(CREATE_AD_ITEM, {
			...inputData,
			[e.currentTarget.name]: value,
		});
	};

	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
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
		setDummy('imager');
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
				Данный формат не поддерживается. Используйте изображения формата .png, .jpg, .jpeg
			</Snackbar>
		);
	}

	const loadPhoto = (e) => {
		setLoading(true);
		loadPhotos(
			e,
			handleWrongSize,
			handleWrongType,
			(value) => {
				const photosUrl = !inputData.photosUrl ? [value] : [...inputData.photosUrl, value];
				const photoText = '' + PHOTO_TEXT + '. Загружено ' + photosUrl.length + '/3';
				setFormData(CREATE_AD_ITEM, {
					...inputData,
					photosUrl,
					photoText,
				});
			},
			() => {
				setLoading(false);
			}
		);
	};

	function deletePhoto(i) {
		const photoText = PHOTO_TEXT + '. Загружено ' + (inputData.photosUrl.length - 1) + '/3';
		const photosUrl = [...inputData.photosUrl.slice(0, i), ...inputData.photosUrl.slice(i + 1)];
		setFormData(CREATE_AD_ITEM, {
			...inputData,
			photoText,
			photosUrl,
		});
	}

	function openPhotos(i) {
		openPhotoSwipe(i);
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

	const [prevPhotosLen, setPrevPhotosLen] = useState(0);
	const [noPhotos, setNoPhotos] = useState(true);
	const [noPhotosA, setNoPhotosA] = useState(true);
	const [photosDelete, setPhotosDelete] = useState(-1);
	useEffect(() => {
		let cancelFunc = false;
		const r = !inputData.photosUrl || inputData.photosUrl.length == 0;

		if (r) {
			setNoPhotosA(false);
			setTimeout(() => {
				if (cancelFunc) {
					return;
				}
				setNoPhotos(r);
				setNoPhotosA(false);
				setTimeout(() => {
					if (cancelFunc) {
						return;
					}
					setNoPhotosA(true);
				}, duration);
			}, duration);
		} else {
			setNoPhotosA(false);
			setPhotosDelete(prevPhotosLen);
			setTimeout(() => {
				if (cancelFunc) {
					return;
				}
				setPhotosDelete(prevPhotosLen);
				setNoPhotos(r);
				setNoPhotosA(false);
				setTimeout(() => {
					if (cancelFunc) {
							return;
						}
					setPhotosDelete(-1);
				}, duration);
			}, duration);
		}
		setPrevPhotosLen(inputData.photosUrl ? inputData.photosUrl.length : 0);
		return () => {
			cancelFunc = true;
		};
	}, [inputData.photosUrl]);

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
			) : null}
			<CardGrid>
				<Card size="l">
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
					<FormLayout>
						<Textarea
							top={descriptionLabel}
							name="description"
							placeholder="Количество, состояние, габариты, дата покупки, особенности и т.д."
							value={description}
							onChange={handleInput}
						/>
					</FormLayout>
					<div style={{ paddingBottom: '8px' }}>
						<CategoriesLabel
							open={props.openCategories}
							redux_form={FORM_CREATE}
							notChoosenElement={{ id: -1, content: 'Не выбрано' }}
						/>
					</div>
				</Card>
			</CardGrid>
			{category == CategoryOnline ? null : (
				<FormLayout>
					<Group
						header={<Header>Снимки</Header>}
						style={{
							display: 'block',
							textAlign: 'center',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						{!noPhotos ? (
							<>
								{needEdit ? null : (
									<Transition in={prevPhotosLen > 0} timeout={duration}>
										{(state) => (
											<div
												style={{
													...allStyles[state],
												}}
											>
												<File
													multiple={true}
													before={<Icon24Camera />}
													disabled={inputData.photosUrl.length == 3}
													mode={inputData.photosUrl.length == 3 ? 'secondary' : 'primary'}
													onChange={loadPhoto}
													style={{transition:`${duration}ms ease-in-out`}}
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
											</div>
										)}
									</Transition>
								)}

								<HorizontalScroll>
									<div style={{ display: 'flex', marginLeft: '10px', marginRight: '10px' }}>
										{inputData.photosUrl.map((img, i) => {
											if (needEdit) {
												img.src = img.PhotoUrl;
												img.id = img.AdPhotoId;
											}

											const v = (
												<div className="create-photo-panel">
													<img
														onClick={() => openPhotos(i)}
														src={img.src}
														className="create-photo"
													/>
													{needEdit ? null : (
														<div
															onClick={() => {
																setPhotosDelete(i);
																setTimeout(() => {
																	setPhotosDelete(-1);
																	deletePhoto(i);
																}, duration);
															}}
															className="create-photo-delete"
														>
															<Icon24Cancel />
														</div>
													)}
												</div>
											);
											return (
												<div key={img.id} style={{ padding: '4px' }}>
													{
														<Transition in={photosDelete != i} timeout={duration}>
															{(state) => (
																<div
																	style={{
																		...allStyles[state],
																	}}
																>
																	{v}
																</div>
															)}
														</Transition>
													}
												</div>
											);
										})}
										{loading ? <Spinner size="medium" /> : null}
									</div>
								</HorizontalScroll>
							</>
						) : (
							<Transition in={noPhotosA} timeout={duration}>
								{(state) => (
									<div
										style={{
											...allStyles[state],
										}}
									>
										<Placeholder
											header="Загрузи снимок"
											icon={<Icon48Camera />}
											action={
												<File
													top="Снимки вещей"
													disabled={inputData.photosUrl && inputData.photosUrl.length == 3}
													mode={
														inputData.photosUrl && inputData.photosUrl.length == 3
															? 'secondary'
															: 'primary'
													}
													onChange={loadPhoto}
												>
													Загрузить
												</File>
											}
										>
											{inputData.photoText
												? inputData.photoText
												: 'Снимки должны передавать реальное состояние вещи, не используй чужие картинки или отредактированные фотографии'}
										</Placeholder>
									</div>
								)}
							</Transition>
						)}
					</Group>
				</FormLayout>
			)}
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
	setDummy,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateItem);

// 342 -> 296 -> 336 -> 415
