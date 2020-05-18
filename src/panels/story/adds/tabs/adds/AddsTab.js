import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Group, ScreenSpinner, PanelHeaderButton, Avatar, Banner, List, PullToRefresh } from '@vkontakte/vkui';

import { connect } from 'react-redux';

import Icon24Filter from '@vkontakte/icons/dist/24/filter';

import Add7 from './../../../../template/Add7';
import axios from 'axios';

import useAdSearch from './useAdSearch';

import './addsTab.css';

import Error from './../../../../placeholders/error';
import AdNotFound from './../../../../placeholders/adNotFound';

import { Addr, BASE_AD } from './../../../../../store/addr';

import { User } from './AddsTab/../../../../../../store/user';

import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss';

import {
	SORT_TIME,
	GEO_TYPE_FILTERS,
	GEO_TYPE_NEAR,
	MODE_ALL,
	MODE_GIVEN,
	MODE_WANTED,
} from '../../../../../const/ads';
import { ADS_FILTERS, GEO_DATA } from '../../../../../store/create_post/types';
import { openSnackbar, openPopout, closePopout } from '../../../../../store/router/actions';
import AdNoWanted from '../../../../placeholders/adNoWanted';
import { setFormData } from '../../../../../store/create_post/actions';
import AdNoGiven from '../../../../placeholders/adNoGiven';
import { NoRegion } from '../../../../../components/location/const';
import { CategoryNo } from '../../../../../components/categories/Categories';

let i = 0;

const SEARCH_WAIT = 650;

const AddsTab = (props) => {
	const [search, setSearch] = useState('');
	const [searchR, setSearchR] = useState('');

	useEffect(() => {
		let cleanupFunction = false;
		i++;
		let j = i;
		setTimeout(() => {
			if (j == i && !cleanupFunction) {
				setSearchR(search);
			}
		}, SEARCH_WAIT);
		return () => (cleanupFunction = true);
	}, [search]);

	const { inputData, openPopout, openSnackbar, closePopout, setFormData } = props;

	const geoType = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].geotype : null) || GEO_TYPE_FILTERS;
	const radius = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].radius : null) || 0;
	const geodata = (inputData[GEO_DATA] ? inputData[GEO_DATA].geodata : null) || null;
	const country = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].country : null) || NoRegion;
	const city = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].city : null) || NoRegion;
	const category = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].category : null) || CategoryNo;
	const sort = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].sort : null) || SORT_TIME;
	const mode = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].mode : null) || MODE_ALL;

	const [refreshMe, setRefreshMe] = useState(1);
	const [pageNumber, setPageNumber] = useState(1);

	const [filtersOn, setFiltersOn] = useState(false);
	useEffect(() => {
		if (country == NoRegion && city == NoRegion && category == CategoryNo && radius == 0) {
			setFiltersOn(false);
			return;
		}
		setFiltersOn(true);
	}, [country, city, category, radius]);

	const [isMounted, setIsMounted] = useState(true);
	useEffect(() => {
		setIsMounted(true);
		return () => {
			setIsMounted(false);
		};
	}, []);

	const [inited, setInited] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [error404, setError404] = useState(false);
	const [ads, setAds] = useState([]);
	const [rads, setRads] = useState([]);
	const [hasMore, setHasMore] = useState(false);

	useEffect(() => {
		setAds([]);
		setPageNumber(1);
	}, [category, mode, searchR, city, country, sort, geodata, geoType, radius, refreshMe]);

	useEffect(() => {
		if (rads.length == 0) {
			setRads(ads);
		} else if (!loading || error404) {
			setTimeout(() => {
				setRads(ads);
			}, 50);
		}
	}, [loading, error404]);

	useEffect(() => {
		console.log('deleteID', props.deleteID);
		if (props.deleteID > 0) {
			setAds(
				ads.filter((x) => {
					return x.ad_id != props.deleteID;
				})
			);
		}
	}, [props.deleteID]);

	useEffect(() => {
		let cleanupFunction = false;
		openPopout(<ScreenSpinner size="large" />);

		setLoading(true);
		setError(false);
		setError404(false)
		setInited(false);


		console.log("category category", category)

		let cancel;
		let rowsPerPage = 5;
		let query = searchR;
		let params = {
			rows_per_page: rowsPerPage,
			page: pageNumber,
			sort_by: sort,
		};
		if (query != '') {
			params.query = '' + query;
		}
		if (category != CategoryNo) {
			params.category = category;
		}

		if (geodata) {
			params.lat = geodata.lat;
			params.long = geodata.long;
		}

		if (geoType == GEO_TYPE_NEAR) {
			params.radius = radius || 0.5;
		} else {
			if (city && city.id != -1) {
				params.district = city.title;
			}

			if (country && country.id != -1) {
				params.region = country.title;
			}
		}

		let url = BASE_AD + 'find';
		if (mode != MODE_ALL && mode != MODE_WANTED) {
			params.author_id = User.getState().vk_id;
		} else if (mode == MODE_WANTED) {
			url = BASE_AD + 'wanted';
		}

		axios({
			method: 'GET',
			url: Addr.getState() + url,
			params,
			withCredentials: true,
			cancelToken: new axios.CancelToken((c) => (cancel = c)),
		})
			.then((res) => {
				const newAds = res.data;
				if (cleanupFunction || !isMounted) {
					return;
				}
				setAds((prev) => {
					return [...new Set([...prev, ...newAds])];
				});
				setHasMore(newAds.length > 0);
				setLoading(false);
				closePopout();
				setInited(true);
			})
			.catch((e) => {
				console.log('fail', e);
				if (axios.isCancel(e)) return;
				if (('' + e).indexOf('404') == -1) {
					setError(true);
				} else {
					setError404(true)
				}
				closePopout();
				setInited(true);
			});
		return () => {
			cancel();
			cleanupFunction = true;
		};
	}, [category, mode, searchR, pageNumber, city, country, sort, geoType, geodata, radius, refreshMe]);

	// let { inited, loading, ads, error, hasMore, newPage } = useAdSearch(
	// 	isMounted,
	// 	searchR,
	// 	category,
	// 	mode,
	// 	pageNumber,
	// 	5,
	// 	props.deleteID,
	// 	city,
	// 	country,
	// 	sort,
	// 	geodata,
	// 	geoType,
	// 	radius,
	// 	refreshMe
	// );

	const observer = useRef();
	const lastAdElementRef = useCallback(
		(node) => {
			if (loading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					setPageNumber((prevPageNumber) => prevPageNumber + 1);
				}
			});
			if (node) observer.current.observe(node);
		},
		[loading, hasMore]
	);


	function handleSearch(e) {
		setSearch(e.target.value);
		closePopout();
	}

	const setAllMode = () => {
		setFormData(ADS_FILTERS, { ...inputData, mode: MODE_ALL });
	};

	function Ad(ad) {
		return (
			<Add7
				vkPlatform={props.vkPlatform}
				openUser={props.openUser}
				openAd={() => props.openAd(ad)}
				ad={ad}
				setPopout={openPopout}
				refresh={props.refresh}
				myID={props.myID}
				onCloseClick={props.onCloseClick}
			/>
		);
	}

	const width = document.body.clientWidth;
	return (
		<>
			<div
				style={{
					height: 'auto',
					display: 'flex',
					background: 'var(--background_page)',
					flexDirection: 'column',
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					whiteSpace: ads.length > 0 ? 'nowrap' : 'normal',
				}}
			>
				<div style={{ display: 'flex', background: 'var(--background_content)' }}>
					<Search
						value={search}
						onChange={handleSearch}
						icon={<Icon24Filter />}
						onIconClick={props.onFiltersClick}
					/>
					{filtersOn ? (
						<PanelHeaderButton
							mode="secondary"
							size="m"
							onClick={() => {
								props.dropFilters();
							}}
						>
							<div style={{ paddingRight: '10px' }}>
								<Avatar size={24}>
									<Icon24Dismiss />
								</Avatar>
							</div>
						</PanelHeaderButton>
					) : null}
				</div>
				

				<PullToRefresh
					onRefresh={() => {
						setRefreshMe((prev) => prev + 1);
					}}
					isFetching={loading}
				>
					<Group>
						<List>
							{rads.length > 0 ? (
								rads.map((ad, index) => {
									if (!width || width < 500) {
										if (rads.length === index + 1) {
											return (
												<div key={ad.ad_id} ref={lastAdElementRef}>
													{Ad(ad)}
												</div>
											);
										}
										return <div key={ad.ad_id}>{Ad(ad)}</div>;
									}
									if (index % 2) {
										const prev = ads[index - 1];
										const first = (
											<div className="one-block" key={prev.ad_id}>
												{Ad(prev)}
											</div>
										);

										let second = (
											<div className="one-block" key={ad.ad_id}>
												{Ad(ad)}
											</div>
										);

										if (rads.length === index + 1) {
											second = (
												<div className="one-block" key={ad.ad_id} ref={lastAdElementRef}>
													{Ad(ad)}
												</div>
											);
										}
										return (
											<div key={ad.ad_id} className="flex-blocks">
												{first} {second}
											</div>
										);
									}
									if (index % 2 == 0 && rads.length - 1 == index) {
										return (
											<div key={ad.ad_id} ref={lastAdElementRef}>
												{Ad(ad)}
											</div>
										);
									}
								})
							) : error ? (
								<Error />
							) : // addsArrDD.map((ad) => {
							// 	return <div key={ad.ad_id}>{Ad(ad)}</div>;
							// })
							// addsArrDD.map(ad => {
							// 	return <div key={ad.ad_id}>{Ad(ad)}</div>;
							// })
							!inited ? (
								''
							) : mode == MODE_ALL ? (
								<AdNotFound dropFilters={props.dropFilters} />
							) : mode == MODE_GIVEN ? (
								<AdNoGiven setAllMode={setAllMode} />
							) : (
								<AdNoWanted setAllMode={setAllMode} />
							)}
						</List>
					</Group>
				</PullToRefresh>
			</div>
		</>
	);
};

const mapStateToProps = (state) => {
	return {
		appID: state.vkui.appID,
		myID: state.vkui.myID,
		apiVersion: state.vkui.apiVersion,
		platform: state.vkui.platform,

		inputData: state.formData.forms,
	};
};

const mapDispatchToProps = {
	openSnackbar,
	openPopout,
	closePopout,
	setFormData,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddsTab);

//283 -> 380
