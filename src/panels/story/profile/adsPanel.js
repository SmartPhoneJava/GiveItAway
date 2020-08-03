import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HorizontalScroll, Card, CardScroll, Header, Gradient, Group, Link } from '@vkontakte/vkui';

import { AnimateGroup } from 'react-animation';

import { AdLight } from '../../template/Add6';

import Icon from './../../../img/icon150.png';

import './profile.css';

const AdsPanel = (props) => {
	const { pack, useGet, profileID } = props;

	const [pageNumber, setPageNumber] = useState(1);
	const [spinner, setSpinner] = useState(null);

	let { loading, ads, hasMore, newPage } = useGet(setSpinner, pageNumber, pack, profileID);

	const observer = useRef();
	const lastElementRef = useCallback(
		(node) => {
			if (loading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					setPageNumber((prevPageNumber) => newPage + 1);
				}
			});
			if (node) observer.current.observe(node);
		},
		[loading, hasMore]
	);

	useEffect(() => {
		if (profileID == -1) {
			return;
		}
		setPageNumber(1);
	}, [profileID]);

	function Ad(ad) {
		const image = ad.pathes_to_photo ? ad.pathes_to_photo[0].PhotoUrl : Icon;

		return (
			<AdLight
				ad={ad}
				imageURL={image}
				opendAd={() => {
					props.openAd(ad);
				}}
			/>
		);
	}

	const [body, setBody] = useState(<></>);
	useEffect(() => {
		setBody(
			!ads ? null : (
				<Gradient>
					<Group
						header={
							<Header subtitle={props.description} aside={spinner}>
								{props.header}
							</Header>
						}
					>
						<CardScroll style={{ height:"100%" }}>
							{ads.map((ad, index) => (
								<div
									onClick={() => props.openAd(ad)}
									className="light-tiled-outter"
									key={ad.ad_id}
									ref={ads.length === index + 1 ? lastElementRef : null}
								>
									<Card className="light-tiled-inner" mode="outline" size="s">
										{Ad(ad)}
									</Card>
								</div>
							))}
						</CardScroll>
					</Group>
				</Gradient>
			)
		);
	}, [spinner]);

	return body;
};

export default AdsPanel;
