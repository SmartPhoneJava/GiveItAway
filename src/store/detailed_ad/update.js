import { setDeal } from './actions';
import { store } from '../..';
import { getDeal } from '../../requests';
import { openSnackbar } from '../router/actions';

export function updateDealInfo() {
	let cancel = false;
	const myID = store.getState().vkui.myID;
	const s = store.getState().ad.subs;
	const ad_id = store.getState().ad.ad_id;

	getDeal(
		(v) => store.dispatch(openSnackbar(v)),
		ad_id,
		(d) => {
			if (cancel) {
				return;
			}
			setDeal(d);

			setIsDealer(d.subscriber_id == myID);
			const subDeal = s.filter((v) => v.vk_id == d.subscriber_id);
			const newDealer = subDeal.length > 0 ? subDeal[0] : null;
			setDealer(newDealer);
		},
		(e) => {
			console.log('error updateDealInfo', e);
		}
	);

	return () => {
		cancel = true;
	};
}
