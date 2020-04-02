import React, { useState, useEffect, useRef } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { Div, Select, FormLayout } from '@vkontakte/vkui';

let request_id = 0;

export const NoRegion = { id: -1, title: '' };

async function updateCities(apiVersion, setCities, id, rgs, token) {
	const params = { v: apiVersion, access_token: token, country_id: id };
	// if (rgs) {
	// 	console.log('region exist', rgs);
	// 	params.region_id = rgs.id;
	// }
	const ci = await bridge.send('VKWebAppCallAPIMethod', {
		method: 'database.getCities',
		request_id: 'city' + request_id,
		params: params,
	});

	request_id++;
	setCities(ci.response.items);
	return ci.response.items;
}

// async function updateRegions(apiVersion, setRegions, id, token) {
// 	const rgs = await bridge.send('VKWebAppCallAPIMethod', {
// 		method: 'database.getRegions',
// 		request_id: 'region' + request_id,
// 		params: { v: apiVersion, access_token: token, country_id: id },
// 	});

// 	request_id++;
// 	setRegions(rgs.response.items);
// 	return rgs.response.items;
// }

export const Location = (
	appID,
	apiVersion,
	vkPlatform,
	country,
	setCountry,
	// region,
	// setRegion,
	city,
	setCity,
	setDefault
) => {
	const [countries, setCountries] = useState([NoRegion]);
	// const [regions, setRegions] = useState([NoRegion]);
	const [cities, setCities] = useState([NoRegion]);

	const [countryID, setCountryID] = useState(country.id);
	// const [regionID, setRegionID] = useState(1);
	const [cityID, setCityID] = useState(city.id);

	const [accessToken, setAccessToken] = useState('');

	async function getUserLocation() {
		console.log('VKWebAppGetUserInfo:');
		const data = await bridge.send('VKWebAppGetUserInfo', {});

		if (country == NoRegion) {
			setCountry(data.country);
			setCountryID(data.country.id);
		}
		console.log('data.city.title', data.city.title);
		if (city == NoRegion) {
			setCity(data.city);
			setCityID(data.city.id);
		}
	}

	async function setLocationInfo() {
		const el = await bridge.send('VKWebAppGetAuthToken', { app_id: appID, scope: '' });
		setAccessToken(el.access_token);
		const vkctrs = await bridge.send('VKWebAppCallAPIMethod', {
			method: 'database.getCountries',
			request_id: 'api' + request_id,
			params: { v: apiVersion, access_token: el.access_token },
		});

		const ctrs = vkctrs.response.items;

		console.log('ctrsctrs', ctrs);
		request_id++;
		setCountries(ctrs);
		// const rgs = updateRegions(apiVersion, setRegions, 1, el.access_token);
		const cts = await updateCities(apiVersion, setCities, 1, null, el.access_token);
		return { ctrs, cts };
	}

	async function init(appID) {
		if (appID == 0) {
			return;
		}
		let { ctrs, cts } = await setLocationInfo();

		console.log('setDefault', setDefault);
		if (setDefault) {
			getUserLocation();
		}
	}

	function chooseCountry(e) {
		if (e.target.value == -1) {
			setCountry(NoRegion);
			return;
		}
		const c = countries.filter(v => v.id == e.target.value)[0];
		setCountry(c);

		// setRegion(NoRegion);
		// setRegionID(-1);

		setCity(NoRegion);
		setCityID(-1);

		// updateRegions(apiVersion, setRegions, c.id, accessToken);
		updateCities(apiVersion, setCities, c.id, null, accessToken);
	}

	useEffect(() => {
		init(appID);
	}, [appID]);

	useEffect(() => {
		setCityID(city.id);
	}, [city]);

	useEffect(() => {
		setCountryID(country.id);
	}, [country]);

	console.log('country!!', country);
	console.log('city!!', city);
	// setCountryID(countries.map(v => v.title).indexOf(country));
	// setCityID(cities.map(v => v.title).indexOf(city));

	return (
		<Div
			style={{
				display: vkPlatform == 'desktop_web' ? 'flex' : 'block',
				padding: '0px',
			}}
		>
			<FormLayout>
				<Select top="Страна" value={countryID} onChange={chooseCountry}>
					{[
						<option key={-112} value={-1}>
							Не определена
						</option>,
						...countries.map((v, i) => {
							return (
								<option key={v.id} value={v.id}>
									{v.title}
								</option>
							);
						}),
					]}
				</Select>
			</FormLayout>

			{/* <FormLayout>
				<Select
					top="Регион"
					value={regionID}
					onClick={e => {
						const c = regions[e.target.value];
						if (!c || e.target.value.length == 0) {
							setRegion(NoRegion);
							return;
						}
						setRegion(c);
						updateCities(apiVersion, setCities, country.id, c, accessToken);
					}}
				>
					<option key={-1} value={-1}>
						Не определен
					</option>
					{regions.map((v, i) => {
						return (
							<option key={v.id} value={v.id}>
								{v.title}
							</option>
						);
					})}
				</Select>
			</FormLayout> */}

			<FormLayout>
				<Select
					top="Город"
					value={cityID}
					onChange={e => {
						if (e.target.value == -1) {
							setCity(NoRegion);
							return;
						}
						const c = cities.filter(v => v.id == e.target.value)[0];
						setCity(c);
					}}
				>
					{[
						<option key={-122323} value={-1}>
							Не определен
						</option>,
						...cities.map((v, i) => {
							return (
								<option key={v.id} value={v.id}>
									{v.title}
								</option>
							);
						}),
					]}
				</Select>
			</FormLayout>
		</Div>
	);
};
