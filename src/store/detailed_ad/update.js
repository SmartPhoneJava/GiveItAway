import { setDeal, setIsDealer, setDealer } from './actions';
import { store } from '../..';
import { getDeal } from '../../requests';
import { openSnackbar } from '../router/actions';
import { getUser } from '../../panels/story/profile/requests';

export function updateDealInfo() {
	let cancel = false;
	const myID = store.getState().vkui.myID;
	const ad_id = store.getState().ad.ad_id;
	getDeal(
		(v) => store.dispatch(openSnackbar(v)),
		ad_id,
		(d) => {
			if (cancel) {
				return;
			}
			store.dispatch(setDeal(d));
	
			store.dispatch(setIsDealer(d.subscriber_id == myID));
			getUser(null, null, d.subscriber_id, (user)=>{
				if (cancel) {
					return;
				}
				console.log("!!! deal", d)
				console.log("!!! setIsDealer", d.subscriber_id == myID)
				console.log("!!! user", user)
				// setDeal(d);
	
				// setIsDealer(d.subscriber_id == myID);
				// const subDeal = s.filter((v) => v.vk_id == d.subscriber_id);
				// const newDealer = subDeal.length > 0 ? subDeal[0] : null;
				// console.log("!!! newDealer", newDealer)
				store.dispatch(setDealer(user));
			}, (e)=>{
				console.log("some error happened")
			})
		
		},
		(e) => {
			console.log('error updateDealInfo', e);
		}
	);

	return () => {
		cancel = true;
	};
}
