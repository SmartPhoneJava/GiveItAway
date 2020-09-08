import { setDeal, setIsDealer, setDealer, setSubs, setCost } from './actions';
import { store } from '../..';
import { getDeal, getSubscribers, getCost, getCashback } from '../../requests';
import { getUser } from '../../panels/story/profile/requests';
import { updateContext } from '../router/actions';

export async function updateDealInfo(successCallback, failCallback) {
	const myID = store.getState().vkui.myID;
	const ad_id = store.getState().ad.ad_id;
	const successC = successCallback || (() => {});
	const failC = failCallback || (() => {});
	getDeal(
		ad_id,
		(d) => {
			store.dispatch(setDeal(d));
			store.dispatch(setIsDealer(d.subscriber_id == myID));
			store.dispatch(updateContext({ deal: d, isDealer: d.subscriber_id == myID }));
			getUser(
				d.subscriber_id,
				(user) => {
					store.dispatch(setDealer(user));
					store.dispatch(updateContext({ dealer: user }));
					successC(d, d.subscriber_id == myID, user);
				},
				(e) => {
					store.dispatch(setDealer(null));
					store.dispatch(updateContext({ dealer: null }));
					failC();
				}
			);
		},
		(e) => {
			console.log('ERROR updateDealInfo:', e);
			store.dispatch(setDeal(null));
			store.dispatch(setIsDealer(false));
			store.dispatch(setDealer(null));
			store.dispatch(updateContext({ deal: null, isDealer: false, dealer: null }));
			failC();
		}
	);
}

const SUBS_AMOUNT = 10;

export async function updateSubs(successCallback, failCallback) {
	let cancel = false;
	const successC = successCallback || (() => {});
	const failC = failCallback || (() => {});
	const ad_id = store.getState().ad.ad_id;
	getSubscribers(
		ad_id,
		(s) => {
			store.dispatch(setSubs(s));
			store.dispatch(updateContext({ subs: s }));
			successC(s);
		},
		(e) => {
			store.dispatch(setSubs([]));
			store.dispatch(updateContext({ subs: [] }));
			failC;
		},
		SUBS_AMOUNT
	);

	return () => {
		cancel = true;
	};
}

export async function updateCost(isSub, successCallback, failCallback) {
	let cancel = false;
	const successC = successCallback || (() => {});
	const failC = failCallback || (() => {});
	const ad_id = store.getState().ad.ad_id;

	if (isSub) {
		getCashback(
			ad_id,
			(data) => {
				console.log('set cashback', data.bid);
				store.dispatch(setCost(data.bid));
				successC(data.bid);
			},
			(e) => {
				console.log('error cashback', e);
				store.dispatch(setCost(0));
				store.dispatch(updateContext({ cost: 0 }));
				failC();
			}
		);
	} else {
		getCost(
			ad_id,
			(data) => {
				store.dispatch(setCost(data.bid));
				successC(data.bid);
			},
			(e) => {
				console.log('error cost', e);
				store.dispatch(setCost(0));
				store.dispatch(updateContext({ cost: 0 }));
				failC();
			}
		);
	}

	return;
}
