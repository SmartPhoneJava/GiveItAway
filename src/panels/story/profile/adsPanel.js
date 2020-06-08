import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HorizontalScroll } from '@vkontakte/vkui';

import { connect } from 'react-redux';

import { AdLight } from '../../template/Add6';

import './profile.css';

const AdsPanel = (props) => {
	const { pack, useGet, profileID } = props;

	console.log("looook at it", profileID)

	const [pageNumber, setPageNumber] = useState(1);
	const [spinner, setSpinner] = useState(null);

	let { loading, ads, hasMore, newPage } = useGet(setSpinner, pageNumber, pack, profileID);

	console.log('loooook at ads', ads);
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
		const image = ad.pathes_to_photo ? ad.pathes_to_photo[0].PhotoUrl : '';
		return AdLight(ad, image, () => {
			props.openAd(ad);
		});
	}

	return (
		<>
			{spinner}
			{!ads ? null : (
				<HorizontalScroll>
					<div style={{ marginLeft: '10px', display: 'flex' }}>
						{ads.map((ad, index) => {
							if (ads.length === index + 1) {
								return (
									<div style={{ padding: '4px' }} key={ad.ad_id} ref={lastElementRef}>
										{Ad(ad)}
									</div>
								);
							} else {
								return (
									<div style={{ padding: '4px' }} key={ad.ad_id}>
										{Ad(ad)}
									</div>
								);
							}
						})}
					</div>
				</HorizontalScroll>
			)}
		</>
	);
};

export default AdsPanel;
