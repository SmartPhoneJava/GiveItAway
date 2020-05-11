import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { ScreenSpinner } from '@vkontakte/vkui';

import { Addr, BASE_AD } from './../../../../../store/addr';

import { User } from './AddsTab/../../../../../../store/user';

import { store } from "./../../../../../index"
import { openPopout, closePopout } from '../../../../../store/router/actions';
import { MODE_WANTED, MODE_ALL } from '../../../../../const/ads';
import { CategoryNo } from '../../../../../components/categories/Categories';

export default function useAdSearch(
	isMounted,
	query,
	category,
	mode,
	pageNumber,
	rowsPerPage,
	deleteID,
	city,
	country,
	sort,
	geodata
) {
	const [inited, setInited] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [ads, setAds] = useState([]);
	const [hasMore, setHasMore] = useState(false);

	useEffect(() => {
		setAds([]);
		pageNumber = 1;
	}, [category, mode, query, city, country, sort, geodata]);

	useEffect(() => {
		console.log('deleteID', deleteID);
		if (deleteID > 0) {
			setAds(
				ads.filter((x) => {
					return x.ad_id != deleteID;
				})
			);
		}
	}, [deleteID]);

	useEffect(() => {
		let cleanupFunction = false;
		store.dispatch(openPopout(<ScreenSpinner size="large" />))
		
		setLoading(true);
		setError(false);
		setInited(false);
		let cancel;

		let params = {
			rows_per_page: rowsPerPage,
			page: pageNumber,
			category: category,
			sort_by: sort,
		};
		if (category == '' || category == CategoryNo) {
			params = {
				rows_per_page: rowsPerPage,
				page: pageNumber,
			};
		}

		if (geodata) {
			params.lat = geodata.lat;
			params.long = geodata.long;
		}

		if (city && city.id != -1) {
			params.district = city.title;
		}

		console.log('before check', geodata);
		if (country && country.id != -1) {
			params.region = country.title;
		}

		let url = BASE_AD + 'find';
		if (mode != MODE_ALL && mode != MODE_WANTED) {
			params.author_id = User.getState().vk_id;
		} else if (mode == MODE_WANTED) {
			url = BASE_AD + 'wanted';
		}

		console.log('use cleanupFunction ', cleanupFunction);

		axios({
			method: 'GET',
			url: Addr.getState() + url,
			params,
			withCredentials: true,
			cancelToken: new axios.CancelToken((c) => (cancel = c)),
		})
			.then((res) => {
				console.log('look cleanupFunction ', cleanupFunction);
				console.log('useAdsearch', res);
				const newAds = res.data;
				if (cleanupFunction || !isMounted) {
					return
				}
				setAds((prev) => {
					return [...new Set([...prev, ...newAds])];
				});
				setHasMore(newAds.length > 0);
				setLoading(false);
				store.dispatch(closePopout())
				setInited(true);
			})
			.catch((e) => {
				console.log('fail', e);
				if (axios.isCancel(e)) return;
				if (('' + e).indexOf('404') == -1) {
					setError(true);
				}
				store.dispatch(closePopout())
				setInited(true);
			});
		return () => {
			cancel()
			cleanupFunction = true
		}
	}, [category, mode, query, pageNumber, city, country, sort, geodata]);

	return { inited, newPage: pageNumber, ads, loading, error, hasMore };
}
