import React, { useState, useEffect } from 'react';
import { FormLayout, SelectMimicry, Group, Header, Link, Div, withModalRootContext } from '@vkontakte/vkui';

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

export const tag = (text, color, background, borderColor) => {
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

export const TagsLabel = (props) => {
	const tagsUpdate = props.tagsUpdate || true;
	return (
		<div className="Simple">
			<DraggableArea
				tags={props.tags}
				render={({ tag, index }) => (
					<Transition in={tagsUpdate} timeout={duration}>
						{(state) => {
							const s = (
								<div
									className="row"
									onClick={props.onClick}
									style={{
										...transitionStyles[state],
										background: tag.background,
										color: tag.color,
										fontWeight: 600,
										borderColor: tag.borderColor,
									}}
								>
									{tag.content}
								</div>
							);
							return s;
						}}
					</Transition>
				)}
				onChange={(tags) => console.log(tags)}
			/>
		</div>
	);
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
		const p1 = tag('•', null, 'rgba(0,0,0,0)', 'rgba(0,0,0,0)');
		const p2 = tag('•', null, 'rgba(0,0,0,0)', 'rgba(0,0,0,0)');
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
		<Group
			header={
				<Header mode="secondary" aside={<Link onClick={props.open}>Изменить</Link>}>
					Категория
				</Header>
			}
		>
			<TagsLabel tagsUpdate={tagsUpdate} tags={tags} onClick={props.open} />
		</Group>
	);
};

const mapStateToProps = (state) => {
	return {
		inputData: state.formData.forms,
	};
};

const mapDispatchToProps = {};

export default withModalRootContext(connect(mapStateToProps, mapDispatchToProps)(CategoriesLabel));
