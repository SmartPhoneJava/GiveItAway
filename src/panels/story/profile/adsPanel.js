import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardScroll, Header, Gradient, Group } from '@vkontakte/vkui';

import { connect } from 'react-redux';

import { AdLight } from '../../template/Add6';

import Icon from './../../../img/icon150.png';

import './profile.css';

const AdsPanel = (props) => {
	const { pack, useGet, profileID, platform } = props;

	const cache = props.cache ? props.cache : { restore: false, to: () => {}, from: () => {} };

	const [pageNumber, setPageNumber] = useState(1);
	const [spinner, setSpinner] = useState(null);

	let { loading, ads, hasMore, newPage } = useGet(setSpinner, pageNumber, pack, profileID, cache);

	
	console.log("newPage is", loading, newPage)
	const observer = useRef();
	const lastElementRef = useCallback(
		(node) => {
		if (loading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				console.log("helloworld")
				if (entries[0].isIntersecting && hasMore) {
					console.log("byworld", pageNumber, newPage)
					setPageNumber(newPage + 1);
				}
			});
			if (node) observer.current.observe(node);
		},
		[loading, hasMore, newPage, pageNumber]
	);

	useEffect(() => {
		if (profileID == -1) {
			return;
		}
		console.log("arrrrrr")
		setPageNumber(1);
	}, [profileID]);

	useEffect(()=>{
		console.log("pageNumber is", pageNumber)
	}, [pageNumber])
	useEffect(()=>{
		console.log("newPagePAge is", newPage)
	}, [newPage])

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

	console.log('platform is', platform);

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
						<CardScroll style={{ height: '100%' }}>
							<div
								style={{
									display: 'flex',
									overflowY: 'hidden',
									overflowX:
										platform == 'desktop_web' || props.platform == 'mobile_web' ? 'auto' : null,
								}}
							>
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
							</div>
						</CardScroll>
					</Group>
				</Gradient>
			)
		);
	}, [spinner, loading]);

	return body;
};

const mapStateToProps = (state) => {
	return {
		platform: state.vkui.platform,
	};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AdsPanel);
