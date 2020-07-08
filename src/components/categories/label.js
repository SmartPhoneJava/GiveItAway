import React, { useState, useEffect } from 'react';
import { FormLayout, SelectMimicry, Group, Header, Link, Div } from '@vkontakte/vkui';

import { connect } from 'react-redux';

import { GetCategoryImage } from './Categories';
import { CategoryNo } from './const';

import { DraggableArea } from 'react-draggable-tags';

import { Transition } from 'react-transition-group';

import ChangeIcon from './../../img/100/change_icon2.png';

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

const CategoriesLabel = (props) => {
	const { redux_form, inputData } = props;

	const notChoosenElement = props.notChoosenElement || {
		id: 1,
		content: CategoryNo,
	};
	const [tags, setTags] = useState([notChoosenElement]);

	const [tagsUpdate, setTagsUpdate] = useState(true);

	const tag = (text, color, background, borderColor) => {
		const c = color || 'var(--accent)'; //'#ffffff';
		const b = background || null;
		// randomColor({
		// 	luminosity: 'dark',
		// });
		i++;
		return {
			id: i,
			content: text,
			color: c,
			background: b,
			borderColor: borderColor,
		};
	};

	useEffect(() => {
		const data = inputData[redux_form];
		console.log("i see this", data)
		if (!data) {
			return;
		}
		const p1 = tag('•', null, 'rgba(0,0,0,0)', 'rgba(0,0,0,0)');
		const p2 = tag('•', null, 'rgba(0,0,0,0)', 'rgba(0,0,0,0)');
		const s1 = data.category ? tag(data.category) : null;
		const s2 = data.subcategory ? tag(data.subcategory) : null;
		const s3 = data.incategory ? tag(data.incategory) : null;
		let str = s1 ? (s2 ? (s3 ? [s1, p1, s2, p2, s3] : [s1, p1, s2]) : [s1]) : [notChoosenElement];

		console.log('str is', str);
		setTags(str);
		setTimeout(() => {
			setTagsUpdate(true);
		}, 500);
		setTagsUpdate(false);
	}, [inputData[redux_form]]);

	return (
		<Group
			header={
				<Header mode="secondary" aside={<Link onClick={props.open}>Изменить</Link>}>
					Категория
				</Header>
			}
		>
			<div className="Simple">
				<DraggableArea
					tags={tags}
					render={({ tag, index }) => (
						<>
							<Transition in={tagsUpdate} timeout={duration}>
								{(state) => {
									const s = (
										<div
											className="row"
											onClick={props.open}
											style={{
												...transitionStyles[state],
												background: tag.background,
												color: tag.color,
												fontWeight: 600,
												borderColor: tag.borderColor,
											}}
										>
											{/* <img
							className="edit-tag"
							src={ChangeIcon}
							onClick={() => {
								switch (index) {
									case 0:
										props.open();
								}
							}}
						/> */}
											{tag.content}
										</div>
									);
									return s;
								}}
							</Transition>
						</>
					)}
					onChange={(tags) => console.log(tags)}
				/>
			</div>
		</Group>
	);
};

const mapStateToProps = (state) => {
	return {
		inputData: state.formData.forms,
	};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesLabel);
