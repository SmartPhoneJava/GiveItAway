import React, { useState } from 'react';
import { FormLayout, Input, Button, Card, CardGrid, Div, Textarea, File, HorizontalScroll } from '@vkontakte/vkui';

import { CategoriesLabel } from './../../../template/Categories';

import Icon24Camera from '@vkontakte/icons/dist/24/camera';

const nameLabel = 'Название';
const categoryLabel = 'Категория';
const descriptionLabel = 'Описание';

const images = [
	{
		original: 'https://picsum.photos/id/1018/1000/600/',
		thumbnail: 'https://picsum.photos/id/1018/250/150/',
	},
	{
		original: 'https://picsum.photos/id/1015/1000/600/',
		thumbnail: 'https://picsum.photos/id/1015/250/150/',
	},
	{
		original: 'https://picsum.photos/id/1019/1000/600/',
		thumbnail: 'https://picsum.photos/id/1019/250/150/',
	},
];

const CreateItem = props => {
	const [name, setName] = useState(props.name);
	const [description, setDescription] = useState('');
	const [photosUrl, setPhotosUrl] = useState([]);

	function handleFileSelect(evt) {
		var files = evt.target.files; // FileList object
		// Loop through the FileList and render image files as thumbnails.
		for (var i = 0, f; (f = files[i]); i++) {
			// Only process image files.
			if (!f.type.match('image.*')) {
				alert('Image only please....');
			}
			var reader = new FileReader();
			// Closure to capture the file information.
			console.log('we are here');
			reader.onload = (function(theFile) {
				return function(e) {
					setPhotosUrl([...photosUrl, e.target.result]);
				};
			})(f);
			// Read in the image file as a data URL.
			reader.readAsDataURL(f);
		}
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

				<Div
					style={{
						display: 'flex',
						alignItems: 'flex-start',
						padding: '0px',
					}}
				>
					<FormLayout>
						<Input
							top={nameLabel}
							name={nameLabel}
							size="50"
							placeholder="футбольный мяч"
							value={name}
							onChange={e => {
								const { _, value } = e.currentTarget;
								setName(value);
								props.setItems({
									name: value,
									caregory: props.category,
									description,
									photos: props.item.photos,
								});
							}}
							status={name ? 'valid' : 'error'}
						/>
					</FormLayout>
					<CategoriesLabel category={props.category} open={props.choose} />
				</Div>
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
							onChange={e => {
								const { _, value } = e.currentTarget;
								setDescription(value);
								props.setItems({
									name,
									category: props.category,
									description: value,
									photos: props.item.photos,
								});
							}}
							status={description ? 'valid' : 'error'}
						/>
					</FormLayout>
				</Div>
				<FormLayout>
					<File
						top="Снимки вещей"
						before={<Icon24Camera />}
						size="l"
						onChange={e => {
							const file = e.target.files[0];
							console.log('files', e.target.files);
							console.log('file:', file);
							props.setItems({
								name,
								category: props.category,
								description: description,
								photos: [...props.item.photos, file],
							});
							handleFileSelect(e);
						}}
					>
						Открыть галерею
					</File>
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
											style={{
												alignItems: 'center',
												justifyContent: 'center',
												padding: '10px',
											}}
										>
											<img
												key={i}
												src={img}
												style={{
													height: '120px',
												}}
											/>
											<Button
												mode="destructive"
												onClick={() => {
													setPhotosUrl(photosUrl.splice(i, 1));
													props.setItems({
														name: name,
														caregory: props.category,
														description,
														photos: [props.item.photos.splice(i, 1)],
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
