import React, { useState, useEffect } from 'react';
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
	console.log('cities:', ci);
	setCities(ci.response.items);
}

async function updateRegions(apiVersion, setRegions, id, token) {
	const rgs = await bridge.send('VKWebAppCallAPIMethod', {
		method: 'database.getRegions',
		request_id: 'region' + request_id,
		params: { v: apiVersion, access_token: token, country_id: id },
	});

	request_id++;
	console.log('regions:', rgs);
	setRegions(rgs.response.items);
}

export const Location = (appID, apiVersion, vkPlatform, country, setCountry, region, setRegion, city, setCity) => {
	const [countries, setCountries] = useState([NoRegion]);
	const [regions, setRegions] = useState([NoRegion]);
	const [cities, setCities] = useState([NoRegion]);

	const [accessToken, setAccessToken] = useState('');

	useEffect(() => {
		console.log('appID', appID);
		async function loadDatabaseInfo() {
			const el = await bridge.send('VKWebAppGetAuthToken', { app_id: appID, scope: '' });
			setAccessToken(el.access_token);
			const ctrs = await bridge.send('VKWebAppCallAPIMethod', {
				method: 'database.getCountries',
				request_id: 'api' + request_id,
				params: { v: apiVersion, access_token: el.access_token },
			});

			console.log('el.access_token', el.access_token);
			request_id++;
			setCountries(ctrs.response.items);
			updateRegions(apiVersion, setRegions, 1, el.access_token);
			updateCities(apiVersion, setCities, 1, null, el.access_token);
		}
		loadDatabaseInfo();
	}, [appID]);

	return (
		<Div
			style={{
				display: vkPlatform == 'desktop_web' ? 'flex' : 'block',
				padding: '0px',
			}}
		>
			<FormLayout>
				<Select
					top="Страна"
					placeholder="Россия"
					onClick={e => {
						const c = countries[e.target.value];
						if (!c || e.target.value.length == 0) {
							return;
						}
						setCountry(c);
						setRegion(NoRegion);
						setCity(NoRegion);
						updateRegions(apiVersion, setRegions, c.id, accessToken);
						updateCities(apiVersion, setCities, c.id, null, accessToken);
					}}
				>
					{countries.map((v, i) => {
						if (v == country) {
							return (
								<option key={v.id} value={i} defaultChecked>
									{v.title}
								</option>
							);
						}
						return (
							<option key={v.id} value={i}>
								{v.title}
							</option>
						);
					})}
				</Select>
			</FormLayout>

			<FormLayout>
				<Select
					top="Регион"
					placeholder="Не указан"
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
					{regions.map((v, i) => {
						if (v == region) {
							return (
								<option key={v.id} value={i} defaultChecked>
									{v.title}
								</option>
							);
						}
						return (
							<option key={v.id} value={i}>
								{v.title}
							</option>
						);
					})}
				</Select>
			</FormLayout>

			<FormLayout>
				<Select
					top="Город"
					placeholder="Не указан"
					onClick={e => {
						console.log('cities[e.target.value]', e.target.value,"!", e.target.value.length == 0);
						const c = cities[e.target.value];
						if (!c || e.target.value.length == 0) {
							setCity(NoRegion);
							return;
						}
						setCity(c);
					}}
				>
					{cities.map((v, i) => {
						if (v == city) {
							return (
								<option key={v.id} value={i} defaultChecked>
									{v.title}
								</option>
							);
						}
						return (
							<option key={v.id} value={i}>
								{v.title}
							</option>
						);
					})}
				</Select>
			</FormLayout>
		</Div>
	);
};
