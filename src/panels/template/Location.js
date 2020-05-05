// import React, { useState, useEffect, useRef } from 'react';
// import bridge from '@vkontakte/vk-bridge';
// import { Div, Select, FormLayout } from '@vkontakte/vkui';

// let request_id = 0;

// export const NoRegion = { id: -1, title: '' };

// async function updateCities(apiVersion, setCities, id, token) {
// 	bridge
// 		.send('VKWebAppCallAPIMethod', {
// 			method: 'database.getCities',
// 			request_id: 'city' + request_id,
// 			params: {
// 				v: apiVersion,
// 				access_token: token,
// 				country_id: id,
// 			},
// 		})
// 		.then((response) => {
// 			setCities(response.response.items);
// 			return response;
// 		})
// 		.catch((error) => {
// 			console.log('VKWebAppCallAPIMethod:', error);
// 		});

// 	request_id++;
// }

// // async function updateRegions(apiVersion, setRegions, id, token) {
// // 	const rgs = await bridge.send('VKWebAppCallAPIMethod', {
// // 		method: 'database.getRegions',
// // 		request_id: 'region' + request_id,
// // 		params: { v: apiVersion, access_token: token, country_id: id },
// // 	});

// // 	request_id++;
// // 	setRegions(rgs.response.items);
// // 	return rgs.response.items;
// // }

// export const Location = (appID, apiVersion, vkPlatform, country, setCountry, city, setCity, setDefault) => {
// 	const [countries, setCountries] = useState([NoRegion]);
// 	// const [regions, setRegions] = useState([NoRegion]);
// 	const [cities, setCities] = useState([NoRegion]);

// 	const [countryID, setCountryID] = useState(country.id);
// 	// const [regionID, setRegionID] = useState(1);
// 	const [cityID, setCityID] = useState(city.id);

// 	const [accessToken, setAccessToken] = useState('');

// 	async function getUserLocation() {
// 		bridge
// 			.send('VKWebAppGetUserInfo', {})
// 			.then((data) => {
// 				if (country == NoRegion) {
// 					setCountry(data.country);
// 					setCountryID(data.country.id);
// 				}
// 				if (city == NoRegion) {
// 					setCity(data.city);
// 					setCityID(data.city.id);
// 				}
// 				return data;
// 			})
// 			.catch((error) => {
// 				console.log('VKWebAppGetUserInfo:', error);
// 			});
// 	}

// 	async function setLocationInfo() {
// 		bridge
// 			.send('VKWebAppGetAuthToken', { app_id: appID, scope: '' })
// 			.then((res) => {
// 				console.log('sucess VKWebAppGetAuthToken', res.access_token);
// 				return res.access_token;
// 			})
// 			.then((access_token) => {
// 				setAccessToken(access_token);
// 				bridge
// 					.send('VKWebAppCallAPIMethod', {
// 						method: 'database.getCountries',
// 						request_id: 'api' + request_id,
// 						params: { v: apiVersion, access_token },
// 					})
// 					.then((response) => {
// 						console.log('sucess VKWebAppCallAPIMethod', response.response.items);
// 						return response.response.items;
// 					})
// 					.then((ctrs) => {
// 						setCountries(ctrs);
// 						updateCities(apiVersion, setCities, 1, access_token);
// 						return ctrs;
// 					})
// 					.catch((error) => {
// 						console.log('VKWebAppCallAPIMethod:', error);
// 					});
// 				return access_token;
// 			})
// 			.catch((error) => {
// 				console.log('VKWebAppGetAuthToken:', error);
// 			});
// 		request_id++;
// 	}

// 	function chooseCountry(e) {
// 		if (e.target.value == -1) {
// 			setCountry(NoRegion);
// 			return;
// 		}
// 		const c = countries.filter((v) => v.id == e.target.value)[0];
// 		setCountry(c);

// 		setCity(NoRegion);
// 		setCityID(-1);

// 		// updateRegions(apiVersion, setRegions, c.id, accessToken);
// 		updateCities(apiVersion, setCities, c.id, accessToken);
// 	}

// 	useEffect(() => {
// 		if (appID == 0) {
// 			return;
// 		}
// 		setLocationInfo();

// 		if (setDefault) {
// 			getUserLocation();
// 		}
// 	}, [appID]);

// 	useEffect(() => {
// 		setCityID(city.id);
// 	}, [city]);

// 	useEffect(() => {
// 		setCountryID(country.id);
// 	}, [country]);

// 	const width = document.body.clientWidth;
// 	//vkPlatform == 'desktop_web'
// 	return (
// 		<Div
// 			style={{
// 				display: width > 400 ? 'flex' : 'block',
// 				padding: '0px',
// 			}}
// 		>
// 			<FormLayout style={{ flex: 1 }}>
// 				<Select top="Страна" value={countryID} onChange={chooseCountry}>
// 					{[
// 						<option key={-112} value={-1}>
// 							Не определена
// 						</option>,
// 						...countries.map((v, i) => {
// 							return (
// 								<option key={v.id} value={v.id}>
// 									{v.title}
// 								</option>
// 							);
// 						}),
// 					]}
// 				</Select>
// 			</FormLayout>

// 			{/* <FormLayout>
// 				<Select
// 					top="Регион"
// 					value={regionID}
// 					onClick={e => {
// 						const c = regions[e.target.value];
// 						if (!c || e.target.value.length == 0) {
// 							setRegion(NoRegion);
// 							return;
// 						}
// 						setRegion(c);
// 						updateCities(apiVersion, setCities, country.id, c, accessToken);
// 					}}
// 				>
// 					<option key={-1} value={-1}>
// 						Не определен
// 					</option>
// 					{regions.map((v, i) => {
// 						return (
// 							<option key={v.id} value={v.id}>
// 								{v.title}
// 							</option>
// 						);
// 					})}
// 				</Select>
// 			</FormLayout> */}

// 			<FormLayout style={{ flex: 1 }}>
// 				<Select
// 					top="Город"
// 					value={cityID}
// 					onChange={(e) => {
// 						if (e.target.value == -1) {
// 							setCity(NoRegion);
// 							return;
// 						}
// 						const c = cities.filter((v) => v.id == e.target.value)[0];
// 						setCity(c);
// 					}}
// 				>
// 					{[
// 						<option key={-122323} value={-1}>
// 							Не определен
// 						</option>,
// 						...cities.map((v, i) => {
// 							return (
// 								<option key={v.id} value={v.id}>
// 									{v.title}
// 								</option>
// 							);
// 						}),
// 					]}
// 				</Select>
// 			</FormLayout>
// 		</Div>
// 	);
// };
