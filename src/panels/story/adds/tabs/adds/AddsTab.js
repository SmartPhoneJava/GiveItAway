import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Group, Placeholder, Button } from '@vkontakte/vkui';

import Icon24Filter from '@vkontakte/icons/dist/24/filter';

import Add from './../../../../template/Add';
import Add6 from './../../../../template/Add6';
import Add5 from './../../../../template/Add5';
import Add4 from './../../../../template/Add4';
import Add3 from './../../../../template/Add3';
import Add2 from './../../../../template/Add2';
import Add0 from './../../../../template/Add0';

import useAdSearch from './useAdSearch';

import Error from './../../../../placeholders/error';
import AdNotFound from './../../../../placeholders/adNotFound';

import Man from './../../../../../img/man.jpeg';
import Cat from './../../../../../img/cat.jpg';
import Kitten from './../../../../../img/kitten.jpeg';
import Jins from './../../../../../img/jins.jpg';
import Tea from './../../../../../img/tea.jpg';
import Playstein from './../../../../../img/playstein.jpg';
import Bb from './../../../../../img/bb.jpg';

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

const AddsTab = (props) => {
	const [search, setSearch] = useState('');

	const [items, setItems] = useState([]);

	const [pageNumber, setPageNumber] = useState(1);

	let { inited, loading, ads, error, hasMore, newPage } = useAdSearch(
		props.setPopout,
		search,
		props.category,
		props.mode,
		pageNumber,
		5,
		props.deleteID,
		props.city,
		props.country,
		props.sort
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
		setPageNumber(1);
		props.setPopout(null);
	}

	function Ad(ad) {
		return (
			<Add6
				vkPlatform={props.vkPlatform}
				openUser={props.openUser}
				openAd={() => props.openAd(ad)}
				ad={ad}
				setPopout={props.setPopout}
				setSnackbar={props.setSnackbar}
				refresh={props.refresh}
				myID={props.myID}
				onCloseClick={props.onCloseClick}
				chooseAdd={props.chooseAdd}
			/>
		);
	}

	const width = document.body.clientWidth;
	console.log('width', width);

	console.log('loading', loading);

	return (
		<div style={{ background: '#F7F7F7' }}>
			<Search value={search} onChange={handleSearch} icon={<Icon24Filter />} onIconClick={props.onFiltersClick} />
			<Group>
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
								<div style={{ flex: 1 }} key={prev.ad_id}>
									{Ad(prev)}
								</div>
							);

							let second = (
								<div style={{ flex: 1 }} key={ad.ad_id}>
									{Ad(ad)}
								</div>
							);

							if (ads.length === index + 1) {
								second = (
									<div style={{ flex: 1 }} key={ad.ad_id} ref={lastAdElementRef}>
										{Ad(ad)}
									</div>
								);
							}
							return (
								<div style={{ display: 'flex' }}>
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
					//<Error />
					addsArrDD.map((ad) => {
						return <div key={ad.ad_id}>{Ad(ad)}</div>;
					})
				) : // addsArrDD.map(ad => {
				// 	return <div key={ad.ad_id}>{Ad(ad)}</div>;
				// })
				!inited ? (
					''
				) : (
					<AdNotFound dropFilters={props.dropFilters} />
				)}
			</Group>
		</div>
	);
};

export default AddsTab;
//283
