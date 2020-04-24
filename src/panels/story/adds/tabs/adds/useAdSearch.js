import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { ScreenSpinner } from '@vkontakte/vkui';

import { Addr } from './../../../../../store/addr';

import { User } from './AddsTab/../../../../../../store/user';

import { CategoryNo } from './../../../../template/Categories';

export default function useAdSearch(
	setPopout,
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
		setPopout(<ScreenSpinner size="large" />);
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
			params.lat=geodata.lat
			params.long=geodata.long
		}

		if (city && city.id != -1) {
			params.district = city.title;
		}

		console.log('before check', geodata);
		if (country && country.id != -1) {
			params.region = country.title;
		}

		let url = '/api/ad/find';
		if (mode != 'all' && mode != 'wanted') {
			params.author_id = User.getState().vk_id;
		} else if (mode == 'wanted') {
			url = '/api/ad/wanted';
		}

		axios({
			method: 'GET',
			url: Addr.getState() + url,
			params,
			withCredentials: true,
			cancelToken: new axios.CancelToken((c) => (cancel = c)),
		})
			.then((res) => {
				console.log('useAdsearch', res);
				const newAds = res.data;
				setAds((prev) => {
					return [...new Set([...prev, ...newAds])];
				});
				setHasMore(newAds.length > 0);
				setLoading(false);
				setPopout(null);
				setInited(true);
			})
			.catch((e) => {
				console.log('fail', e);
				if (axios.isCancel(e)) return;
				if (('' + e).indexOf('404') == -1) {
					setError(true);
				}
				setPopout(null);
				setInited(true);
			});
		return () => cancel();
	}, [category, mode, query, pageNumber, city, country, sort, geodata]);


	return { inited, newPage: pageNumber, ads, loading, error, hasMore };
}
