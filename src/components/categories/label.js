import React, { useState, useEffect } from 'react';
import { Link, Div, withModalRootContext, RichCell } from '@vkontakte/vkui';

import { connect } from 'react-redux';

import { CategoryNo } from './const';

import { Transition } from 'react-transition-group';

import { randomColor } from 'randomcolor';

const duration = 100;

const transitionStyles = {
	entering: { opacity: 1, transition: `opacity ${duration}ms ease-in-out` },
	entered: { opacity: 1, transition: `opacity ${duration}ms ease-in-out` },
	exiting: { opacity: 0, transition: `opacity ${duration}ms ease-in-out` },
	exited: { opacity: 0, transition: `opacity ${duration}ms ease-in-out` },
};

// https://www.npmjs.com/package/randomcolor

let i = 1;

export const tag = (text, color, background, borderColor, onClick, right) => {
	// randomColor({
	// 	luminosity: 'dark',
	// });
	i++;
	return {
		id: i,
		content: text,
		color,
		background,
		borderColor,
		right,
		onClick,
	};
};

export const TagsLabel = (props) => {
	const tagsUpdate = props.tagsUpdate || true;
	return (
		<div className="tag-container">
			{' '}
			{props.tags.map((tag, index) => (
				<div className="tag-item" key={tag + index}>
					<div style={{ display: 'flex' }}>
						<Transition in={tagsUpdate} timeout={duration}>
							{(state) => {
								const s = (
									<div
										className="categories-tag-row"
										onClick={tag.onClick || props.onClick}
										style={{
											...transitionStyles[state],
											background: tag.background,
											color: tag.color,
											borderColor: tag.borderColor,
										}}
									>
										<div className="flex-center">
											{tag.content}
											{tag.right}
										</div>
									</div>
								);
								return s;
							}}
						</Transition>
					</div>
				</div>
			))}
		</div>
	);
	// <DraggableArea
	// 	// isList={props.Y ? true : null}
	// 	disable={true}
	// 	tags={props.tags}
	// 	// style={{ display: 'block' }}
	// 	render={({ tag, index }) => (
	// 		<div style={{ display: 'flex' }}>
	// 			<Transition in={tagsUpdate} timeout={duration}>
	// 				{(state) => {
	// 					const s = (
	// 						<div
	// 							className="categories-tag-row"
	// 							onClick={tag.onClick || props.onClick}
	// 							style={{
	// 								...transitionStyles[state],
	// 								background: tag.background,
	// 								color: tag.color,
	// 								borderColor: tag.borderColor,
	// 							}}
	// 						>
	// 							<div className="flex-center">
	// 								{tag.content}
	// 								{tag.right}
	// 							</div>
	// 						</div>
	// 					);
	// 					return s;
	// 				}}
	// 			</Transition>
	// 		</div>
	// 	)}
	// 	onChange={(tags) => console.log(tags)}
	// />
};

const CategoriesLabel = (props) => {
	const { redux_form, inputData } = props;

	const notChoosenElement = props.notChoosenElement || {
		id: 1,
		content: CategoryNo,
	};
	const [tags, setTags] = useState([notChoosenElement]);

	const [tagsUpdate, setTagsUpdate] = useState(true);

	useEffect(() => {
		let cancel = false;
		const data = inputData[redux_form];
		if (!data) {
			return;
		}
		const p1 = tag('•');
		const p2 = tag('•');
		const s1 = data.category ? tag(data.category) : null;
		const s2 = data.subcategory ? tag(data.subcategory) : null;
		const s3 = data.incategory ? tag(data.incategory) : null;
		let str = s1 ? (s2 ? (s3 ? [s1, p1, s2, p2, s3] : [s1, p1, s2]) : [s1]) : [notChoosenElement];

		setTags(str);
		setTimeout(() => {
			if (cancel) {
				return;
			}
			setTagsUpdate(true);
		}, 500);
		setTagsUpdate(false);

		return () => {
			cancel = true;
		};
	}, [inputData[redux_form]]);

	useEffect(() => {
		props.updateModalHeight();
		return () => {
			props.updateModalHeight();
		};
	});

	return (
		<RichCell
			multiline
			text={<TagsLabel style={{ cursor: 'pointer' }} tagsUpdate={tagsUpdate} tags={tags} onClick={props.open} />}
			after={
				<Link style={{ cursor: 'pointer' }} onClick={props.open}>
					Изменить
				</Link>
			}
		>
			Категория
		</RichCell>
		// <Group
		// 	header={
		// 		<Header mode="secondary" aside={<Link onClick={props.open}>Изменить</Link>}>
		// 			Категория
		// 		</Header>
		// 	}
		// >
		// 	<TagsLabel tagsUpdate={tagsUpdate} tags={tags} onClick={props.open} />
		// </Group>
	);
};

const mapStateToProps = (state) => {
	return {
		inputData: state.formData.forms,
	};
};

const mapDispatchToProps = {};

export default withModalRootContext(connect(mapStateToProps, mapDispatchToProps)(CategoriesLabel));
