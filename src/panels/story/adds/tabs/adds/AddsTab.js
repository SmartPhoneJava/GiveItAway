import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
	Search,
	Group,
	ScreenSpinner,
	PanelHeaderButton,
	Avatar,
	Banner,
	List,
	PullToRefresh,
	Spinner,
} from '@vkontakte/vkui';

import { connect } from 'react-redux';

import Icon24Filter from '@vkontakte/icons/dist/24/filter';

import Add7 from './../../../../template/Add7';
import axios from 'axios';

import './addsTab.css';

import Error from './../../../../placeholders/error';
import AdNotFound from './../../../../placeholders/adNotFound';

import { Addr, BASE_AD } from './../../../../../store/addr';

import { User } from './AddsTab/../../../../../../store/user';

import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss';

import { bounce } from 'react-animations';
import Radium, { StyleRoot } from 'radium';

import { AnimateOnChange, AnimateGroup } from 'react-animation';

const stylesAnimation = {
	bounce: {
		animation: 'x 5s',
		animationName: Radium.keyframes(bounce, 'bounce'),
	},
};

import {
	SORT_TIME,
	GEO_TYPE_FILTERS,
	GEO_TYPE_NEAR,
	MODE_ALL,
	MODE_GIVEN,
	MODE_WANTED,
} from '../../../../../const/ads';
import { ADS_FILTERS, GEO_DATA } from '../../../../../store/create_post/types';
import { openPopout, closePopout } from '../../../../../store/router/actions';
import AdNoWanted from '../../../../placeholders/adNoWanted';
import { setFormData } from '../../../../../store/create_post/actions';
import AdNoGiven from '../../../../placeholders/adNoGiven';
import { NoRegion } from '../../../../../components/location/const';
import { CategoryNo } from '../../../../../components/categories/const';
import Columns, { ColumnsFunc } from '../../../../template/columns';

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

	const { inputData, openPopout, closePopout, setFormData } = props;

	const geoType = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].geotype : null) || GEO_TYPE_FILTERS;
	const radius = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].radius : null) || 0;
	const geodata = (inputData[GEO_DATA] ? inputData[GEO_DATA].geodata : null) || null;
	const country = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].country : null) || NoRegion;
	const city = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].city : null) || NoRegion;
	const category = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].category : null) || CategoryNo;
	const subcategory = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].subcategory : null) || CategoryNo;
	const incategory = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].incategory : null) || CategoryNo;
	const sort = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].sort : null) || SORT_TIME;
	const mode = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].mode : null) || MODE_ALL;

	const [refreshMe, setRefreshMe] = useState(1);
	const [pageNumber, setPageNumber] = useState(1);
	const [ppageNumber, setPpageNumber] = useState(1);

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
	const width = document.body.clientWidth;

	const [inited, setInited] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [error404, setError404] = useState(false);
	const [pullLoading, setPullLoading] = useState(false);
	const [ads, setAds] = useState([]);
	const [rads, setRads] = useState([]);
	const [hasMore, setHasMore] = useState(false);

	useEffect(() => {
		setPullLoading(!error404 && loading);
	}, [error404, loading]);

	useEffect(() => {
		setAds([]);
		setPageNumber(1);
		setPpageNumber(1);
		setCols([]);
	}, [category, mode, searchR, city, country, sort, geodata, geoType, radius, refreshMe]);

	const [cols, setCols] = useState([]);

	useEffect(() => {
		if (rads.length == 0) {
			return;
		}
		const c = ColumnsFunc(
			!width || width < 500,
			rads.map((ad) => Ad(ad)),
			5,
			2,
			lastAdElementRef
		);
		setCols(c.map((s) => <div>{s}</div>));
	}, [rads]);

	useEffect(() => {
		console.log('loading real is', loading, hasMore);
	}, [loading, hasMore]);

	useEffect(() => {
		console.log('loading is', loading, ads);
		if (rads.length == 0) {
			setRads(ads);
		} else if (!loading || error404) {
			setTimeout(() => {
				console.log('lallala', loading, ads);
				setRads(ads);
			}, 50);
		}
	}, [loading, error404]);

	useEffect(() => {
		console.log('props.deleteID', props.deleteID);
		if (props.deleteID > 0) {
			setRads((rads) =>
				rads.filter((x) => {
					return x.ad_id != props.deleteID;
				})
			);
			setAds((ads) =>
				ads.filter((x) => {
					return x.ad_id != props.deleteID;
				})
			);
		}
	}, [props.deleteID]);

	useEffect(() => {
		let cancel;
		let cleanupFunction = false;
		setLoading(true);
		setError(false);
		setError404(false);
		setInited(false);

		async function f() {
			if (rads.length == 0) {
				openPopout(<Spinner size="large" />);
			}

			let rowsPerPage = 12;
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
				if (subcategory != CategoryNo) {
					params.subcat_list = subcategory;
					if (incategory != CategoryNo) {
						params.subcat = incategory;
					}
				}
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
						console.log('real err', e);
						setError(true);
					} else {
						console.log('non real err', e);
						setError404(true);
						setHasMore(false);
					}
					setLoading(false);
					closePopout();
					setInited(true);
				});
		}
		f();
		return () => {
			cancel();
			cleanupFunction = true;
		};
	}, [category, mode, searchR, pageNumber, city, country, sort, geoType, geodata, radius, refreshMe]);

	const observer = useRef();
	const lastAdElementRef = useCallback(
		(node) => {
			if (loading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				console.log('sadsadsadsadsadsa', hasMore, pageNumber);
				if (entries[0].isIntersecting && hasMore) {
					setPageNumber(ppageNumber + 1);
					setPpageNumber(pageNumber + 1);
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
		console.log('ad called', loading, ad.header);
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

	return (
		<>
			<PullToRefresh
				onRefresh={() => {
					setRefreshMe((prev) => prev + 1);
				}}
				isFetching={pullLoading}
			>
				<div
					style={{
						height: 'auto',
						display: 'flex',
						// background: 'var(--background_page)',
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

					<Group>
						<AnimateGroup animationIn="fadeInUp" animationOut="popOut" duration={500}>
							{cols.map((s) => (
								<div>{s}</div>
							))}
						</AnimateGroup>

						{rads.length > 0 ? null : error ? (
							<Error />
						) : !inited ? (
							''
						) : mode == MODE_ALL ? (
							<AdNotFound dropFilters={props.dropFilters} />
						) : mode == MODE_GIVEN ? (
							<AdNoGiven setAllMode={setAllMode} />
						) : (
							<AdNoWanted setAllMode={setAllMode} />
						)}
					</Group>
				</div>
			</PullToRefresh>
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
	openPopout,
	closePopout,
	setFormData,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddsTab);

//283 -> 380 -> 418 -> 358 -> 406
