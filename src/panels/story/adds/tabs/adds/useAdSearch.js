import { useEffect, useState } from 'react';
import axios from 'axios';

import { Addr } from './../../../../../store/addr';

import { User } from './AddsTab/../../../../../../store/user';

import { CategoryNo } from './../../../../template/Categories';
import { NoRegion } from '../../../../template/Location';

let prevCategory = '';
let prevDeleteID = '';

export default function useAdSearch(query, category, mode, pageNumber, rowsPerPage, deleteID, city, region) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [ads, setAds] = useState([]);
	const [hasMore, setHasMore] = useState(false);

	useEffect(() => {
    setAds([]);
    pageNumber = 1
	}, [category, mode, query, city, region]);

	useEffect(() => {
		console.log('deleteID:', deleteID);
		if (deleteID > 0) {
			setAds(
				ads.filter(x => {
					console.log('x.ad_id', x.ad_id, x.ad_id != deleteID);
					return x.ad_id != deleteID;
				})
			);
		}
	}, [deleteID]);

	useEffect(() => {
		setLoading(true);
		setError(false);
		let cancel;

		if (prevCategory != category) {
			pageNumber = 1;
		}
		console.log('prevCategory:', prevCategory, category, pageNumber);
		prevCategory = category;

		let params = {
			rows_per_page: rowsPerPage,
			page: pageNumber,
			category: category,
		};
		if (category == '' || category == CategoryNo) {
			params = {
				rows_per_page: rowsPerPage,
				page: pageNumber,
			};
    }
    if (region && region != NoRegion) {
      console.log("regionregion", region)
      params.region=region.title
    }
    if (city && city != NoRegion) {
      console.log("citycity", city)
      params.district=city.title
    }
		if (mode != 'all') {
			params.author_id = User.getState().vk_id;
		}

		axios({
			method: 'GET',
			url: Addr.getState() + '/api/ad/find',
			params,
			cancelToken: new axios.CancelToken(c => (cancel = c)),
		})
			.then(res => {
				console.log('sucess', res);
				const newAds = res.data;
				setAds(prev => {
					return [...new Set([...prev, ...newAds])];
				});
				setHasMore(newAds.length > 0);
				setLoading(false);
			})
			.catch(e => {
				console.log('fail', e);
				if (axios.isCancel(e)) return;
				if (('' + e).indexOf('404') == -1) {
					setError(true);
				}
			});
		return () => cancel();
	}, [category, mode, query, pageNumber, city, region]);

	console.log('aaaaaaaaaaaaaaaaaaa', ads);
	return { newPage: pageNumber, ads, loading, error, hasMore };
}
