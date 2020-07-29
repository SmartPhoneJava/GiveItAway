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
	CellButton,
	Placeholder,
	Button,
} from '@vkontakte/vkui';

import Icon56ErrorOutline from '@vkontakte/icons/dist/56/error_outline';

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

import { AnimateGroup } from 'react-animation';

import {
	SORT_TIME,
	GEO_TYPE_FILTERS,
	GEO_TYPE_NEAR,
	MODE_ALL,
	MODE_GIVEN,
	MODE_WANTED,
} from '../../../../../const/ads';
import { ADS_FILTERS, GEO_DATA } from '../../../../../store/create_post/types';
import { openPopout, closePopout, setStory } from '../../../../../store/router/actions';
import AdNoWanted from '../../../../placeholders/adNoWanted';
import { setFormData } from '../../../../../store/create_post/actions';
import AdNoGiven from '../../../../placeholders/adNoGiven';
import { NoRegion } from '../../../../../components/location/const';
import { CategoryNo } from '../../../../../components/categories/const';
import { ColumnsFunc } from '../../../../template/columns';
import { DIRECTION_BACK, NO_DIRECTION } from '../../../../../store/router/directionTypes';
import { pushToCache } from '../../../../../store/cache/actions';
import { STORY_ADS } from '../../../../../store/router/storyTypes';

let i = 0;

const SEARCH_WAIT = 650;

const AddsTab = (props) => {
	const width = document.body.clientWidth;
	const { inputData, openPopout, closePopout, setFormData, dropFilters } = props;

	const activeModal = props.activeModals[STORY_ADS];

	const [geoType, setGeoType] = useState(GEO_TYPE_FILTERS);
	const [radius, setRadius] = useState(0);
	const [geodata, setGeodata] = useState();
	const [country, setCountry] = useState(NoRegion);
	const [city, setCity] = useState(NoRegion);
	const [category, setCategory] = useState(CategoryNo);
	const [subcategory, setSubcategory] = useState(CategoryNo);
	const [incategory, setIncategory] = useState(CategoryNo);
	const [sort, setSort] = useState(SORT_TIME);
	const [mode, setMode] = useState(MODE_ALL);
	const [search, setSearch] = useState('');
	const [prevInputData, setPrevInputData] = useState();
	useEffect(() => {
		if (activeModal) {
			return;
		}
		console.log('look at', inputData[ADS_FILTERS]);
		const s = inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].search : null || '';
		if (s == undefined) {
			setSearch('');
		} else {
			setSearch(s);
		}

		const gt = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].geotype : null) || GEO_TYPE_FILTERS;
		setGeoType(gt);

		const rad = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].radius : null) || 0;
		setRadius(rad);

		const geod = (inputData[GEO_DATA] ? inputData[GEO_DATA].geodata : null) || null;
		setGeodata(geod);

		const count = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].country : null) || NoRegion;
		setCountry(count);

		const cit = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].city : null) || NoRegion;
		setCity(cit);

		console.log('set city', cit, activeModal);

		const categor = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].category : null) || CategoryNo;
		setCategory(categor);

		const subcategor = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].subcategory : null) || CategoryNo;
		setSubcategory(subcategor);

		const incategor = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].incategory : null) || CategoryNo;
		setIncategory(incategor);

		const sor = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].sort : null) || SORT_TIME;
		setSort(sor);

		const mod = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].mode : null) || MODE_ALL;
		setMode(mod);
	}, [props.inputData[ADS_FILTERS]]);

	const [searchR, setSearchR] = useState('');
	useEffect(() => {
		if (activeModal) {
			return;
		}
		let cleanupFunction = false;
		i++;
		let j = i;
		setTimeout(() => {
			if (j == i && !cleanupFunction) {
				setSearchR(search);
				setFormData(ADS_FILTERS, { ...inputData[ADS_FILTERS], search });
			}
		}, SEARCH_WAIT);
		return () => (cleanupFunction = true);
	}, [search]);

	const [refreshMe, setRefreshMe] = useState(1);
	const [pageNumber, setPageNumber] = useState(1);
	const [filtersOn, setFiltersOn] = useState(false);
	useEffect(() => {
		if (activeModal) {
			return;
		}
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
	const [pullLoading, setPullLoading] = useState(false);
	const [rads, setRads] = useState([]);
	const [goBackDone, setGoBackDone] = useState(false);
	const [hasMore, setHasMore] = useState(true);

	const [cols, setCols] = useState([]);

	useEffect(() => {
		setPullLoading(!error404 && loading);
	}, [error404, loading]);

	useEffect(() => {
		if (activeModal) {
			return;
		}
		if (props.cache.ignore_cache) {
			props.pushToCache(false, 'ignore_cache');
			setGoBackDone(true);
		} else {
			if (props.direction == DIRECTION_BACK && !goBackDone) {
				return;
			}
		}
		setRads([]);
		setCols([]);
		setPageNumber(-1);
		setInited(false);
		setHasMore(true);
	}, [category, mode, searchR, city, country, sort, geodata, geoType, radius, refreshMe]);

	useEffect(() => {
		const c = ColumnsFunc(
			!width || width < 500,
			rads.map((ad) => Ad(ad)),
			5,
			2,
			lastAdElementRef
		);

		setCols(
			c.map((s, i) => (
				<div ref={lastAdElementRef} key={i}>
					{s}
				</div>
			))
		);
	}, [rads]);

	useEffect(() => {
		if (activeModal) {
			return;
		}
		console.log('props.deleteID', props.deleteID);
		if (props.deleteID > 0) {
			setRads(
				(rads) =>
					rads.filter((x) => {
						return x.ad_id != props.deleteID;
					}) || []
			);
		}
	}, [props.deleteID]);

	useEffect(() => {
		if (activeModal) {
			console.log('i will set these', props.cache.ads_list);
			setRads(props.cache.ads_list || []);
			setPageNumber(props.cache.ads_page);
			setInited(true);
			setLoading(false);
			return;
		}
		console.log('BEFORE LOOK hasMore', hasMore, pageNumber);
		if (!hasMore) {
			return;
		}
		if (pageNumber < 0) {
			setPageNumber(1);
			return;
		}
		let cancel;
		let cleanupFunction = false;
		setLoading(true);
		setError(false);
		setError404(false);
		setInited(false);

		console.log('BEFORE LOOK', goBackDone);

		if (props.direction == DIRECTION_BACK && !goBackDone) {
			// setAds(props.cache.ads_list);
			if (pageNumber < props.cache.ads_page) {
				setRads(props.cache.ads_list || []);
				setPageNumber(props.cache.ads_page);
				setInited(true);
				setLoading(false);
				return;
			} else if (pageNumber == props.cache.ads_page) {
				setInited(true);
				setLoading(false);
				setGoBackDone(true);
				return;
			}
		}

		async function f() {
			if (rads.length == 0) {
				openPopout(<Spinner size="large" />);
			}

			let rowsPerPage = 4;
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
					setRads((prev) => [...prev, ...newAds]);

					props.pushToCache([...rads, ...newAds], 'ads_list');
					props.pushToCache(pageNumber, 'ads_page');

					setHasMore(newAds.length > 0);
					setLoading(false);
					closePopout();
					setInited(true);
				})
				.catch((e) => {
					console.log('fail', e);
					props.pushToCache([...rads], 'ads_list');
					props.pushToCache(pageNumber, 'ads_page');

					if (axios.isCancel(e)) return;
					if (('' + e).indexOf('404') == -1) {
						console.log('real err', e);

						setError(true);
					} else {
						console.log('non real err', e);
						setError404(true);
						setHasMore(false);
						setPageNumber((prev) => prev - 1);
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
	}, [pageNumber]);

	const observer = useRef();
	const lastAdElementRef = useCallback(
		(node) => {
			// if (loading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					setPageNumber((prev) => prev + 1);
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
				openAd={() => {
					props.openAd(ad);
				}}
				ad={ad}
				setPopout={openPopout}
				refresh={props.refresh}
				myID={props.myID}
				onCloseClick={props.onCloseClick}
			/>
		);
	}

	return (
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
					whiteSpace: rads.length > 0 ? 'nowrap' : 'normal',
				}}
			>
				{mode != MODE_WANTED ? (
					<div style={{ display: 'flex', background: 'var(--background_content)' }}>
						<Search
							key="search"
							autoFocus={true}
							// onBlur={() => searchRef.current.focus }
							value={search}
							onChange={handleSearch}
							icon={<Icon24Filter />}
							onIconClick={props.onFiltersClick}
						/>
						{filtersOn ? (
							<PanelHeaderButton mode="secondary" size="m" onClick={dropFilters}>
								<div style={{ paddingRight: '10px' }}>
									<Avatar size={24}>
										<Icon24Dismiss />
									</Avatar>
								</div>
							</PanelHeaderButton>
						) : null}
					</div>
				) : null}

				{/* <AnimateGroup animationIn="fadeInUp" animationOut="popOut" duration={500}> */}
				{cols}
				{/* </AnimateGroup> */}

				{rads.length > 0 ? null : error ? (
					<Error />
				) : !inited ? (
					<></>
				) : mode == MODE_ALL ? (
					<AdNotFound dropFilters={dropFilters} />
				) : mode == MODE_GIVEN ? (
					<AdNoGiven setAllMode={setAllMode} />
				) : (
					<AdNoWanted setAllMode={setAllMode} />
				)}
			</div>
		</PullToRefresh>
	);
};

const mapStateToProps = (state) => {
	return {
		appID: state.vkui.appID,
		myID: state.vkui.myID,
		apiVersion: state.vkui.apiVersion,
		platform: state.vkui.platform,

		inputData: state.formData.forms,
		direction: state.router.direction,
		cache: state.cache,

		activeModals: state.router.activeModals,
	};
};

const mapDispatchToProps = {
	openPopout,
	closePopout,
	setFormData,
	setStory,
	pushToCache,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddsTab);

//283 -> 380 -> 418 -> 358 -> 406 -> 503
