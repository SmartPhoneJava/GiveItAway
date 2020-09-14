import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, PullToRefresh, Spinner, SimpleCell, Div, FormStatus } from '@vkontakte/vkui';

import { connect } from 'react-redux';

import Icon24Filter from '@vkontakte/icons/dist/24/filter';
import Icon16Clear from '@vkontakte/icons/dist/16/clear';

import Add7 from './../../../../template/Add7';
import axios from 'axios';

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
	GEO_TYPE_NO,
} from '../../../../../const/ads';
import { ADS_FILTERS, ADS_FILTERS_ON, GEO_DATA, ADS_FILTERS_S } from '../../../../../store/create_post/types';
import { openPopout, closePopout, updateContext } from '../../../../../store/router/actions';
import AdNoWanted from '../../../../placeholders/adNoWanted';
import { setFormData } from '../../../../../store/create_post/actions';
import AdNoGiven from '../../../../placeholders/adNoGiven';
import { NoRegion } from '../../../../../components/location/const';
import { CategoryNo } from '../../../../../components/categories/const';
import { ColumnsFunc } from '../../../../template/columns';
import { DIRECTION_BACK } from '../../../../../store/router/directionTypes';
import { pushToCache } from '../../../../../store/cache/actions';
import { STORY_ADS } from '../../../../../store/router/storyTypes';
import { TagsLabel, tag } from '../../../../../components/categories/label';
import { Collapse } from 'react-collapse';
import formPanel from '../../../../../components/template/formPanel';
import { Headers, handleNetworkError } from '../../../../../requests';
import { PANEL_ADS } from '../../../../../store/router/panelTypes';

let i = 0;

const SEARCH_MAX_LENGTH = 50;

const REASON_NO_SEARCH = 'reason: no search';
const REASON_SEARCH = 'reason: search - ';
const REASON_PAGE = 'reason: page - ';

const SEARCH_WAIT = 650;

const AddsTab = (props) => {
	const width = document.body.clientWidth;
	const { inputData, openPopout, closePopout, setFormData, dropFilters, activeStory, updateContext } = props;

	const activeModal = props.activeModals[STORY_ADS];

	const [tagsLabel, setTags] = useState([]);
	useEffect(() => {
		setTags(props.activeContext[props.activeStory].tags);
	}, [props.activeContext[props.activeStory].tags]);
	const [tagsNum, setTagsNum] = useState(0);
	useEffect(() => {
		setTagsNum(props.activeContext[props.activeStory].tagsNum);
	}, [props.activeContext[props.activeStory].tagsNum]);

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
	const [filtersOn, setFiltersOn] = useState(false);
	useEffect(() => {
		console.log('we have filters', props.activeContext[props.activeStory].filtersOn);
		setFiltersOn(props.activeContext[props.activeStory].filtersOn);
	}, [props.activeContext[props.activeStory].filtersOn]);
	useEffect(() => {
		if (activeModal || props.activePanels[props.activeStory] != PANEL_ADS) {
			return;
		}
		setSoftLoading(false);
		let s =
			inputData[activeStory + ADS_FILTERS_S] && inputData[activeStory + ADS_FILTERS_S].search != undefined
				? inputData[activeStory + ADS_FILTERS_S].search
				: '';

		setSearch(s);
		if (!searchR) {
			setSearchR(s);
		}

		const gt =
			(inputData[activeStory + ADS_FILTERS] ? inputData[activeStory + ADS_FILTERS].geotype : null) ||
			GEO_TYPE_FILTERS;
		setGeoType(gt);

		const rad = (inputData[activeStory + ADS_FILTERS] ? inputData[activeStory + ADS_FILTERS].radius : null) || 0;
		setRadius(rad);

		const geod = (inputData[activeStory + GEO_DATA] ? inputData[activeStory + GEO_DATA].geodata : null) || null;
		setGeodata(geod);

		const count =
			(inputData[activeStory + ADS_FILTERS] ? inputData[activeStory + ADS_FILTERS].country : null) || NoRegion;
		setCountry(count);

		const cit =
			(inputData[activeStory + ADS_FILTERS] ? inputData[activeStory + ADS_FILTERS].city : null) || NoRegion;
		setCity(cit);

		const categor =
			(inputData[activeStory + ADS_FILTERS] ? inputData[activeStory + ADS_FILTERS].category : null) || CategoryNo;
		setCategory(categor);

		const subcategor =
			(inputData[activeStory + ADS_FILTERS] ? inputData[activeStory + ADS_FILTERS].subcategory : null) ||
			CategoryNo;
		setSubcategory(subcategor);

		const incategor =
			(inputData[activeStory + ADS_FILTERS] ? inputData[activeStory + ADS_FILTERS].incategory : null) ||
			CategoryNo;
		setIncategory(incategor);

		const sor =
			(inputData[activeStory + ADS_FILTERS] ? inputData[activeStory + ADS_FILTERS].sort : null) || SORT_TIME;
		setSort(sor);

		const mod =
			(inputData[activeStory + ADS_FILTERS] ? inputData[activeStory + ADS_FILTERS].mode : null) || MODE_ALL;
		setMode(mod);

		const hasFilters =
			(gt == GEO_TYPE_FILTERS && cit != NoRegion) ||
			categor != CategoryNo ||
			(gt == GEO_TYPE_NEAR && rad != 0) ||
			(s != undefined && s != '');

		updateContext({ filtersOn: hasFilters });
		setFormData(activeStory + ADS_FILTERS_ON, {
			...inputData[activeStory + ADS_FILTERS],
			filtersOn: hasFilters,
		});
		let tags = [];

		if (categor != CategoryNo) {
			tags.push(
				tag(
					`категория: ${categor}`,
					null,
					null,
					null,
					() => {
						setFormData(activeStory + ADS_FILTERS, {
							...inputData[activeStory + ADS_FILTERS],
							category: null,
						});
					},
					<Icon16Clear
						onClick={() => {
							setFormData(activeStory + ADS_FILTERS, {
								...inputData[activeStory + ADS_FILTERS],
								category: null,
							});
						}}
						style={{ paddingLeft: '4px', cursor: 'pointer' }}
						fill="var(--accent)"
					/>
				)
			);
		}
		if (incategor != CategoryNo) {
			tags.push(
				tag(
					`подкатегория: ${incategor}`,
					null,
					null,
					null,
					() => {
						setFormData(activeStory + ADS_FILTERS, {
							...inputData[activeStory + ADS_FILTERS],
							incategory: null,
							subcategory: null,
						});
					},
					<Icon16Clear
						onClick={() => {
							setFormData(activeStory + ADS_FILTERS, {
								...inputData[activeStory + ADS_FILTERS],
								incategory: null,
								subcategory: null,
							});
						}}
						style={{ paddingLeft: '4px', cursor: 'pointer' }}
						fill="var(--accent)"
					/>
				)
			);
		} else if (subcategor != CategoryNo) {
			tags.push(
				tag(
					`подкатегория: ${subcategor}`,
					null,
					null,
					null,
					() => {
						setFormData(activeStory + ADS_FILTERS, {
							...inputData[activeStory + ADS_FILTERS],
							incategory: null,
							subcategory: null,
						});
					},
					<Icon16Clear
						onClick={() => {
							setFormData(activeStory + ADS_FILTERS, {
								...inputData[activeStory + ADS_FILTERS],
								incategory: null,
								subcategory: null,
							});
						}}
						style={{ paddingLeft: '4px', cursor: 'pointer' }}
						fill="var(--accent)"
					/>
				)
			);
		}
		if (s != '') {
			s = s.substr(0, SEARCH_MAX_LENGTH);
			tags.push(
				tag(
					`содержит текст: ${s}`,
					null,
					null,
					null,
					() => {
						setFormData(activeStory + ADS_FILTERS_S, {
							...inputData[activeStory + ADS_FILTERS_S],
							search: '',
						});
					},
					<Icon16Clear
						onClick={() => {
							setFormData(activeStory + ADS_FILTERS_S, {
								...inputData[activeStory + ADS_FILTERS_S],
								search: '',
							});
						}}
						style={{ paddingLeft: '4px', cursor: 'pointer' }}
						fill="var(--accent)"
					/>
				)
			);
		}
		if (gt == GEO_TYPE_FILTERS && cit != NoRegion) {
			tags.push(
				tag(
					`в городе: ${cit.title}`,
					null,
					null,
					null,
					() => {
						setFormData(activeStory + ADS_FILTERS, {
							...inputData[activeStory + ADS_FILTERS],
							city: null,
							geotype: GEO_TYPE_NO,
						});
					},
					<Icon16Clear
						onClick={() => {
							setFormData(activeStory + ADS_FILTERS, {
								...inputData[activeStory + ADS_FILTERS],
								city: null,
								geotype: GEO_TYPE_NO,
							});
						}}
						style={{ paddingLeft: '4px', cursor: 'pointer' }}
						fill="var(--accent)"
					/>
				)
			);
		}
		console.log('gt is ', gt);
		if (gt == GEO_TYPE_NEAR && rad != 0) {
			tags.push(
				tag(
					`около меня: ${rad} км`,
					null,
					null,
					null,
					() => {
						setFormData(activeStory + ADS_FILTERS, {
							...inputData[activeStory + ADS_FILTERS],
							geotype: GEO_TYPE_NO,
							radius: 0.5,
						});
					},
					<Icon16Clear
						onClick={() => {
							setFormData(activeStory + ADS_FILTERS, {
								...inputData[activeStory + ADS_FILTERS],
								geotype: GEO_TYPE_NO,
								radius: 0.5,
							});
						}}
						style={{ paddingLeft: '4px', cursor: 'pointer' }}
						fill="var(--accent)"
					/>
				)
			);
		}

		const tagsPanel =
			tags.length == 0 ? null : (
				<div style={{ paddingLeft: '8px', paddingRight: '8px' }}>
					{!searchValid && (
						<Div>
							<FormStatus
								header="Слишком длинный поисковый запрос"
								mode="error"
							>{`Максимальная длина: ${SEARCH_MAX_LENGTH} символов. Остальные символы игнорируются.`}</FormStatus>
						</Div>
					)}

					<TagsLabel Y={true} tags={tags} />
				</div>
			);
		updateContext({ tagsNum: tags.length, tags: tagsPanel });
	}, [props.inputData[activeStory + ADS_FILTERS], searchValid, props.activePanels[props.activeStory], activeModal]);

	const [searchValid, setSearchValid] = useState(true);
	const [searchR, setSearchR] = useState('');
	useEffect(() => {
		if (activeModal) {
			return;
		}
		let s = search;
		console.log('s isssss', s);
		if (s.length > SEARCH_MAX_LENGTH) {
			setSearchValid(false);
			s = s.substr(0, SEARCH_MAX_LENGTH);
		} else {
			setSearchValid(true);
		}
		let cleanupFunction = false;
		i++;
		let j = i;
		setTimeout(() => {
			if (j == i && !cleanupFunction) {
				setSearchR(s);
				setFormData(activeStory + ADS_FILTERS_S, { ...inputData[activeStory + ADS_FILTERS_S], search });
			}
		}, SEARCH_WAIT);
		return () => (cleanupFunction = true);
	}, [search]);

	const [refreshMe, setRefreshMe] = useState(1);
	const [pageNumber, setPageNumber] = useState(1);
	const [softLoading, setSoftLoading] = useState(false);

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
		console.log('activeModal', activeModal, filtersOn, props.cache.ignore_cache);
		if (activeModal || props.activePanels[props.activeStory] != PANEL_ADS) {
			return;
		}
		if (props.cache.ignore_cache) {
			props.pushToCache(false, 'ignore_cache');
			setGoBackDone(true);
		} else {
			if (props.direction == DIRECTION_BACK && !goBackDone) {
				setGoBackDone(true);
				return;
			}
		}

		setRads([]);
		setPageNumber(-1);
		setHasMore(true);
	}, [
		category,
		incategory,
		subcategory,
		mode,
		searchR,
		city,
		country,
		sort,
		geodata,
		geoType,
		radius,
		refreshMe,
		filtersOn,
	]);

	useEffect(() => {
		const c = ColumnsFunc(
			!width || width < 500,
			rads.map((ad) => Ad(ad)),
			5,
			2,
			lastAdElementRef
		);
		console.log('loook at rads.length', c.length);
		setCols(
			c.map((s, i) => (
				<div ref={lastAdElementRef} key={i}>
					{s}
				</div>
			))
		);
	}, [rads]);

	useEffect(() => {
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
			setRads(props.cache.ads_list || []);
			setPageNumber(props.cache.ads_page);
			setLoading(false);
			return;
		}
		if (!hasMore) {
			return;
		}
		if (pageNumber < 0) {
			setPageNumber(1);
			return;
		}
		let cancel;
		let cleanupFunction = false;

		if (props.direction == DIRECTION_BACK && !goBackDone) {
			if (pageNumber < props.cache.ads_page) {
				setRads(props.cache.ads_list || []);
				setPageNumber(props.cache.ads_page);
				return;
			} else if (pageNumber == props.cache.ads_page) {
				setGoBackDone(true);
				return;
			}
		}
		setLoading(true);
		setError(false);
		setError404(false);
		setInited(false);

		async function f() {
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
			console.log('city is city', category, subcategory, incategory);
			if (category != CategoryNo) {
				params.category = category;
				if (subcategory != CategoryNo) {
					params.subcat_list = subcategory;
				}
				if (incategory != CategoryNo) {
					params.subcat = incategory;
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

			console.log('mode is', mode, User.getState().vk_id);
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
				headers: Headers(),
			})
				.then((res) => {
					const newAds = res.data;
					if (cleanupFunction || !isMounted) {
						return;
					}
					if (pageNumber == 1) {
						setRads(newAds);
					} else {
						setRads((prev) => [...prev, ...newAds]);
					}

					props.pushToCache([...rads, ...newAds], 'ads_list');
					props.pushToCache(pageNumber, 'ads_page');

					setHasMore(newAds.length > 0);
					setLoading(false);

					setInited(true);
				})
				.catch((error) =>
					handleNetworkError(error, null, (e) => {
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
							setPageNumber((prev) => (prev == 1 ? 1 : prev - 1));
						}
						setLoading(false);

						setInited(true);
						if (pageNumber == 1) {
							setRads([]);
						}
					})
				);
		}
		f();
		return () => {
			cancel();
			cleanupFunction = true;
		};
	}, [pageNumber]);

	const [adsComponent, setAdsComponent] = useState();

	useEffect(() => {
		if (loading && !softLoading) {
			openPopout(<Spinner size="large" />);
			setAdsComponent(
				<PullToRefresh
					style={{ opacity: '0' }}
					onRefresh={() => {
						setPullLoading(true);

						setTimeout(() => {
							setPullLoading(false);
							setRefreshMe((prev) => prev + 1);
						}, 150);
					}}
					isFetching={pullLoading}
				>
					{cols}
				</PullToRefresh>
			);
		} else {
			setAdsComponent(
				<PullToRefresh
					style={{ opacity: '1' }}
					onRefresh={() => {
						setPullLoading(true);

						setTimeout(() => {
							setPullLoading(false);
							setRefreshMe((prev) => prev + 1);
						}, 150);
					}}
					isFetching={pullLoading}
				>
					{cols}
				</PullToRefresh>
			);
			closePopout();
		}
		return () => {
			closePopout();
		};
	}, [loading, pullLoading, cols]);

	const observer = useRef();
	const lastAdElementRef = useCallback(
		(node) => {
			// if (loading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					setSoftLoading(true);
					setPageNumber((prev) => prev + 1);
				}
			});
			if (node) observer.current.observe(node);
		},
		[loading, hasMore]
	);

	function handleSearch(e) {
		setSearch(e.target.value);
		var input = document.getElementById('searchMain');
		if (input) {
			const focus = function () {
				input.focus();
			};
			input.removeEventListener('focusout', focus);
			input.addEventListener('focusout', focus);
		} else {
			console.log('searchMain baaad');
		}
		closePopout();
	}

	const setAllMode = () => {
		setFormData(activeStory + ADS_FILTERS, { ...inputData[activeStory + ADS_FILTERS], mode: MODE_ALL });
	};

	function Ad(ad) {
		return (
			<Add7
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

	const [body, setBody] = useState(<></>);
	useEffect(() => {
		setBody(
			<div
				className="ads_feed"
				style={{
					whiteSpace: rads.length > 0 ? 'nowrap' : 'normal',
				}}
			>
				{mode != MODE_WANTED && (
					<>
						<div style={{ display: 'flex' }}>
							<Search
								id="searchMain"
								style={{
									transition: '0.3s',
								}}
								key="search"
								// onBlur={() => searchRef.current.focus }
								value={search}
								onChange={handleSearch}
								icon={<Icon24Filter style={{ cursor: 'pointer' }} />}
								onIconClick={props.onFiltersClick}
								after={null}
							/>
							{/* </div> */}
							{tagsNum > 1 && (
								<div
									style={{
										cursor: filtersOn ? 'pointer' : null,
										transition: '0.3s',
										width: filtersOn ? '100%' : '0%',
									}}
								>
									<SimpleCell
										style={{ padding: '0px', margin: '0px' }}
										before={<Icon24Dismiss />}
										mode="secondary"
										onClick={dropFilters}
									/>
								</div>
							)}
						</div>
						<Collapse isOpened={filtersOn}>{tagsLabel}</Collapse>
					</>
				)}

				<>
					{adsComponent}

					{!loading &&
						(rads.length > 0 ? null : error ? (
							<Error />
						) : filtersOn ? (
							<AdNotFound dropFilters={dropFilters} />
						) : mode == MODE_ALL ? (
							<AdNotFound dropFilters={dropFilters} />
						) : mode == MODE_GIVEN ? (
							<AdNoGiven setAllMode={setAllMode} />
						) : (
							<AdNoWanted setAllMode={setAllMode} />
						))}
				</>
			</div>
		);
	}, [
		mode,
		loading,
		search,
		adsComponent,
		pullLoading,
		softLoading,
		filtersOn,
		props.inputData,
		props.activeModals,
		cols,
		tagsNum,
	]);

	return body;
};

const mapStateToProps = (state) => {
	return {
		appID: state.vkui.appID,
		myID: state.vkui.myID,
		activeStory: state.router.activeStory,
		apiVersion: state.vkui.apiVersion,
		platform: state.vkui.platform,

		inputData: state.formData.forms,
		direction: state.router.direction,
		cache: state.cache,

		activeModals: state.router.activeModals,
		activeContext: state.router.activeContext,
		activeStory: state.router.activeStory,
		activePanels: state.router.activePanels,
	};
};

const mapDispatchToProps = {
	openPopout,
	closePopout,
	setFormData,
	pushToCache,
	updateContext,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddsTab);

//283 -> 380 -> 418 -> 358 -> 406 -> 503 -> 885 -> 900 -> 1082
