import { setDeal, setIsDealer, setDealer, setSubs, setCost } from './actions';
import { store } from '../..';
import { getDeal, getSubscribers, getCost, getCashback } from '../../requests';
import { getUser } from '../../panels/story/profile/requests';

export async function updateDealInfo(successCallback, failCallback) {
	const myID = store.getState().vkui.myID;
	const ad_id = store.getState().ad.ad_id;
	const successC = successCallback || (() => {});
	const failC = failCallback || (() => {});
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
					successC()
				},
				(e) => {
					store.dispatch(setDealer(null));
					failC()
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

export async function updateSubs(successCallback, failCallback) {
	let cancel = false;
	const successC = successCallback || (() => {});
	const failC = failCallback || (() => {});
	const ad_id = store.getState().ad.ad_id;
	getSubscribers(
		ad_id,
		(s) => {
			store.dispatch(setSubs(s));
			successC();
		},
		(e) => {
			store.dispatch(setSubs([]));
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
				successC();
			},
			(e) => {
				console.log('error cashback', e);
				store.dispatch(setCost(0));
				failC();
			}
		);
	} else {
		getCost(
			ad_id,
			(data) => {
				console.log('set cost', data.bid);
				store.dispatch(setCost(data.bid));
				successC();
			},
			(e) => {
				console.log('error cost', e);
				store.dispatch(setCost(0));
				failC();
			}
		);
	}

	return;
}
