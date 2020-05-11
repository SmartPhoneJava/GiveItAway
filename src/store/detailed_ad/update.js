import { setDeal, setIsDealer, setDealer, setSubs, setCost } from './actions';
import { store } from '../..';
import { getDeal, getSubscribers, getCost } from '../../requests';
import { openSnackbar } from '../router/actions';
import { getUser } from '../../panels/story/profile/requests';

export function updateDealInfo() {
	const myID = store.getState().vkui.myID;
	const ad_id = store.getState().ad.ad_id;
	getDeal(
		ad_id,
		(d) => {
			console.log('we seee', d, myID);
			store.dispatch(setDeal(d));

			store.dispatch(setIsDealer(d.subscriber_id == myID));
			getUser(
				d.subscriber_id,
				(user) => {
					store.dispatch(setDealer(user));
				},
				(e) => {
					store.dispatch(setDealer(null));
				}
			);
		},
		(e) => {
			console.log('ERROR updateDealInfo:', e);
			store.dispatch(setDeal(null));
			store.dispatch(setIsDealer(false));
			store.dispatch(setDealer(null));
		}
	);
}

const SUBS_AMOUNT = 10;

export function updateSubs() {
	let cancel = false;
	const ad_id = store.getState().ad.ad_id;
	getSubscribers(
		ad_id,
		(s) => store.dispatch(setSubs(s)),
		(e) => store.dispatch(setSubs([])),
		SUBS_AMOUNT
	);

	return () => {
		cancel = true;
	};
}

export function updateCost() {
	let cancel = false;
	const ad_id = store.getState().ad.ad_id;
	getCost(
		ad_id,
		(data) => {
			console.log('set cost', data.bid);
			store.dispatch(setCost(data.bid));
		},
		(e) => {
			store.dispatch(setCost(0));
		}
	);

	return () => {
		cancel = true;
	};
}
