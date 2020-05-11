import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Group, PanelHeaderButton, Avatar, Banner, List, PullToRefresh } from '@vkontakte/vkui';

import { connect } from 'react-redux';

import Icon24Filter from '@vkontakte/icons/dist/24/filter';

import Add7 from './../../../../template/Add7';

import useAdSearch from './useAdSearch';

import './addsTab.css';

import Error from './../../../../placeholders/error';
import AdNotFound from './../../../../placeholders/adNotFound';

import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss';

import Man from './../../../../../img/man.jpeg';
import Cat from './../../../../../img/cat.jpg';
import Kitten from './../../../../../img/kitten.jpeg';
import Jins from './../../../../../img/jins.jpg';
import Tea from './../../../../../img/tea.jpg';
import Playstein from './../../../../../img/playstein.jpg';
import Bb from './../../../../../img/bb.jpg';
import { SORT_TIME, GEO_TYPE_FILTERS, MODE_ALL, MODE_GIVEN } from '../../../../../const/ads';
import { ADS_FILTERS } from '../../../../../store/create_post/types';
import { openSnackbar, openPopout, closePopout } from '../../../../../store/router/actions';
import AdNoWanted from '../../../../placeholders/adNoWanted';
import { setFormData } from '../../../../../store/create_post/actions';
import AdNoGiven from '../../../../placeholders/adNoGiven';
import { NoRegion } from '../../../../../components/location/const';
import { CategoryNo } from '../../../../../components/categories/Categories';

const addsArrDD = [
	{
		ad_id: 3201,
		status: 'offer',
		header: 'Отдам котенка',
		anonymous: false,
		text:
			'Кому то нужны маленькие пушистики\nИм очень нужен дом\n......\nФотка старая котята ещё не роделись , просто показываю какие будут\n.. лучше же отдать в хорошие руки чем топить',
		creation_date: '12.12.2012',
		feedback_type: 'comments',
		extra_field: '',
		category: 'animals',
		district: 'Яблочная улица',
		region: 'Барнаул',
		pathes_to_photo: [
			{ AdPhotoId: 1, PhotoUrl: Cat },
			{ AdPhotoId: 2, PhotoUrl: Bb },
			{ AdPhotoId: 3, PhotoUrl: Tea },
		],
		author: {
			vk_id: 45863670,
			name: 'Семен',
			surname: 'Eфимов',
			photo_url: Man,
		},
	},
	{
		ad_id: 3202,
		status: 'offer',
		header: 'Отдам котёнка, мальчик',
		anonymous: false,
		text:
			'Отдам котёнка, мальчик. 1 месяц, кушает пока только молочко, к лотку приучается. Котёнок от кошки крысыловки и британского кота. У кошки второй помёт. Котёнком заниматься не когда, так как у меня грудной ребёнок. Возможна доставка по Ленинску',
		creation_date: '13.12.2012',
		feedback_type: 'ls',
		category: 'animals',
		extra_field: '',
		district: 'Гусевский переулок',
		region: 'Екатеринбург',
		pathes_to_photo: [
			{ AdPhotoId: 1, PhotoUrl: Kitten },
			{ AdPhotoId: 2, PhotoUrl: Bb },
			{ AdPhotoId: 3, PhotoUrl: Tea },
		],
		author: {
			vk_id: 2,
			name: 'Алёна',
			surname: 'Чернышева',
			photo_url: Man,
		},
	},
	{
		ad_id: 3203,
		status: 'offer',
		header: 'Меняю вещи',
		anonymous: false,
		text:
			'Отдам за сахар и растительное масло все вещи в хорошем состоянии. Джинсы размер 27, лосины размер 44, брюки размер 46, кофта размер М, Игрушки отдам за растительное масло. Не бронирую пишите кто действительно будет забирать.',
		creation_date: '14.12.2012',
		category: 'clothers',
		pm: false,
		feedback_type: 's',
		comments_counter: 4,
		extra_field: 'Звоните по номеру 89268923412',
		district: 'Ленинский район',
		region: 'Урюпинск',
		pathes_to_photo: [
			{ AdPhotoId: 1, PhotoUrl: Jins },
			{ AdPhotoId: 2, PhotoUrl: Bb },
			{ AdPhotoId: 3, PhotoUrl: Tea },
		],
		author: {
			vk_id: 3,
			name: 'Иришка',
			surname: 'Воронина',
			photo_url: Man,
		},
	},
	{
		ad_id: 3204,
		status: 'offer',
		header: 'Ловите штукатурку',
		anonymous: false,
		text: `НАЗНАЧЕНИЕ:
      Для высококачественного оштукатуривания вручную потолков и стен с обычным твердым основанием (бетон, кирпич, цементная штукатурка), а также поверхностей из пенополистирола, ЦСП;
      Для внутренних работ;
      Для гладких бетонных потолочных и стеновых поверхностей.
      ПРЕИМУЩЕСТВА:
      Гладкая поверхность;
      Не трескается даже при толстом слое;
      Универсальность материала — одновременное оштукатуривание и шпаклевание, изготовление декоративных элементов, Ремонтные и реставрационные работы;
      Высокая водоудерживающая способность;
      Регулирует влажностный режим в помещении — «дышит», создавая благоприятный микроклимат в помещении;
      Материал изготовлен из экологически чистого природного минерала (гипса) и не содержит вредных для здоровья человека веществ.
      `,
		creation_date: '13.12.2012',
		feedback_type: 's',
		extra_field:
			'Спрятала огромное полотно текста в контактах. Попробуйте правильно вывести это все. Ахахахахахаххаха. Кто что думает о фильме Джеентельмены? По моему там не хватает экшена :Р',
		category: 'build',
		district: 'Улица строителей',
		region: 'Могилев',
		pathes_to_photo: [
			{ AdPhotoId: 1, PhotoUrl: Bb },
			{ AdPhotoId: 2, PhotoUrl: Jins },
			{ AdPhotoId: 3, PhotoUrl: Tea },
		],
		author: {
			vk_id: 4,
			name: 'Ирина',
			surname: 'Черыжкина',
			photo_url: Man,
		},
	},
	{
		ad_id: 3205,
		status: 'offer',
		header: 'Плэйстешн',
		anonymous: false,
		text: `Новый плэйстейшн купили сегодня в Sony center на меге на розыбакиева. Даже ни разу не подключали все абсолютно новое чек гарантийный талон...дали еще 2 купона на покупки в Еврика и Бош...нужны деньги срочно...купили за 128 790 отдаем за бесплатно но торг уместен...
      `,
		creation_date: '15.12.2012',
		feedback_type: 's',
		comments_counter: 100,
		extra_field:
			'договоримся звоните...87479754978, 87075000804...плэйстешн, джостик, 3 диска все в наборе и с пакетом от sony и с чеком',
		category: 'play',
		district: 'Алматы',
		region: 'Алматы',
		pathes_to_photo: [
			{ AdPhotoId: 1, PhotoUrl: Playstein },
			{ AdPhotoId: 2, PhotoUrl: Jins },
			{ AdPhotoId: 3, PhotoUrl: Tea },
		],
		author: {
			vk_id: 5,
			name: 'Нурмухаммед',
			surname: 'Нурдаулет',
			photo_url: Man,
		},
	},
	{
		ad_id: 3206,
		status: 'waiting',
		header: 'Отдаю много всякого',
		anonymous: true,
		text: `Анон. Отдам чаи 500 тг. Роутер 10тыс тг, книга 500тг. Отдам даром туфли 37 размера
      `,
		creation_date: '15.12.2012',
		feedback_type: 'comments',
		extra_field: '87016073540',
		category: 'products, electronics, books, clothers',
		pathes_to_photo: [
			{ AdPhotoId: 1, PhotoUrl: Tea },
			{ AdPhotoId: 2, PhotoUrl: Jins },
			{ AdPhotoId: 3, PhotoUrl: Tea },
		],
		location: '',
		district: '',
		region: '',
		author: {
			vk_id: 6,
			name: 'Петя',
			surname: 'Сидоров',
			photo_url: Man,
		},
	},
];

let i = 0;

const SEARCH_WAIT = 500;

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
	const geodata = (inputData[ADS_FILTERS] ? inputData[ADS_FILTERS].geodata : null) || null;
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

	let { inited, loading, ads, error, hasMore, newPage } = useAdSearch(
		isMounted,
		searchR,
		category,
		mode,
		pageNumber,
		5,
		props.deleteID,
		city,
		country,
		sort,
		geodata,
		refreshMe
	);

	const observer = useRef();
	const lastAdElementRef = useCallback(
		(node) => {
			if (loading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					setPageNumber((prevPageNumber) => newPage + 1);
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
				setSnackbar={openSnackbar}
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
						disabled
						placeholder="Поиск недоступен"
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
						console.log("refreshMe")
						setPageNumber(1);
						setRefreshMe((prev) => prev + 1);
					}}
					isFetching={loading}
				>
					<Group>
						<List>
							{ads.length > 0 ? (
								ads.map((ad, index) => {
									if (!width || width < 500) {
										if (ads.length === index + 1) {
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

										if (ads.length === index + 1) {
											second = (
												<div className="one-block" key={ad.ad_id} ref={lastAdElementRef}>
													{Ad(ad)}
												</div>
											);
										}
										return (
											<div className="flex-blocks">
												{first} {second}
											</div>
										);
									}
									if (index % 2 == 0 && ads.length - 1 == index) {
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
