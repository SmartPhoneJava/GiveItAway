import {
	ADD_PROFILE,
	ADD_AD,
	SET_PAGE,
	GO_BACK,
	OPEN_POPOUT,
	CLOSE_POPOUT,
	OPEN_SNACKBAR,
	CLOSE_SNACKBAR,
	OPEN_MODAL,
	CLOSE_MODAL,
	CLOSE_ALL_MODALS,
	SET_STORY,
	SET_PROFILE,
	SET_AD,
	SET_DUMMY,
	SET_TAB,
} from './actionTypes';

import * as VK from '../../services/VK';
import { smoothScrollToTop } from '../../services/_functions';
import { STORY_ADS, STORY_CREATE } from './storyTypes';
import { PANEL_ADS, PANEL_CREATE, PANEL_USER, PANEL_ONE } from './panelTypes';
import { AdDefault, TAB_ADS } from '../../const/ads';

import { store } from '../../index';
import { backToPrevAd } from '../detailed_ad/actions';

const initialState = {
	activeStory: STORY_ADS,
	storiesHistory: [STORY_ADS],

	activePanels: {
		[STORY_ADS]: PANEL_ADS,
		[STORY_CREATE]: PANEL_CREATE,
	},
	panelsHistory: {
		[STORY_ADS]: [PANEL_ADS],
		[STORY_CREATE]: [PANEL_CREATE],
	},
	activeTabs: {
		[STORY_ADS]: TAB_ADS,
	},

	activeProfile: -1,
	profileHistory: [],

	activeAd: AdDefault,
	adHistory: [],

	activeModals: {
		[STORY_ADS]: null,
		[STORY_CREATE]: null,
	},
	modalHistory: {
		[STORY_ADS]: [],
		[STORY_CREATE]: [],
	},

	popouts: {
		[STORY_ADS]: null,
		[STORY_CREATE]: null,
	},
	snackbars: {},

	dummies: {},

	scrollPosition: [],
};

export const routerReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_PAGE: {
			window.history.pushState(null, null);
			smoothScrollToTop();

			let panel = action.payload.panel;

			let Story = state.activeStory;
			let Panels = state.panelsHistory[Story] || [];
			Panels = [...Panels, panel];

			console.log('page is here', Story, panel, Panels);
			VK.swipeBackOn();

			return {
				...state,

				activePanels: {
					...state.activePanels,
					[Story]: panel,
				},
				panelsHistory: {
					...state.panelsHistory,
					[Story]: Panels,
				},

				scrollPosition: [...state.scrollPosition, window.pageYOffset],
			};
		}

		case SET_DUMMY: {
			let dummy = action.payload.dummy;

			let Story = state.activeStory;
			let dummies = state.dummies[Story] || [];

			return {
				...state,
				dummies: {
					...state.dummies,
					[Story]: [...dummies, dummy],
				},
			};
		}

		case ADD_PROFILE: {
			let profile = action.payload.profile;
			let Profile = state.activeProfile;
			let Profiles = state.profileHistory;
			if (Profile == -1) {
				Profile = profile;
			}
			Profiles = Profile ? [...Profiles, Profile] : Profiles;
			console.log('set activeProfile', profile);
			return {
				...state,
				activeProfile: profile,
				profileHistory: Profiles,
			};
		}

		case SET_PROFILE: {
			window.history.pushState(null, null);
			smoothScrollToTop();

			let panel = action.payload.panel;
			let profile = action.payload.profile;

			let Story = state.activeStory;
			let Panels = state.panelsHistory[Story] || [];
			let Profiles = state.profileHistory;

			Panels = [...Panels, panel];
			Profiles = state.activeProfile ? [...Profiles, state.activeProfile] : Profiles;

			console.log('SET_PROFILE', state.activeProfile, Profiles);

			VK.swipeBackOn();

			return {
				...state,

				activePanels: {
					...state.activePanels,
					[Story]: panel,
				},
				panelsHistory: {
					...state.panelsHistory,
					[Story]: Panels,
				},

				activeProfile: profile,
				profileHistory: Profiles,

				scrollPosition: [...state.scrollPosition, window.pageYOffset],
			};
		}

		case ADD_AD: {
			let ad = action.payload.ad;
			let Ads = state.adHistory;
			Ads = state.activeAd ? [...Ads, state.activeAd] : Ads;
			return {
				...state,
				activeAd: ad,
				adHistory: Ads,
			};
		}

		case SET_AD: {
			window.history.pushState(null, null);
			smoothScrollToTop();

			let panel = action.payload.panel;
			let ad = action.payload.ad;

			let Story = state.activeStory;
			let Panels = state.panelsHistory[Story] || [];
			let Ads = state.adHistory;

			Panels = [...Panels, panel];
			Ads = state.activeAd ? [...Ads, state.activeAd] : Ads;

			VK.swipeBackOn();

			return {
				...state,

				activePanels: {
					...state.activePanels,
					[Story]: panel,
				},
				panelsHistory: {
					...state.panelsHistory,
					[Story]: Panels,
				},

				activeAd: ad,
				adHistory: Ads,

				scrollPosition: [...state.scrollPosition, window.pageYOffset],
			};
		}

		case SET_STORY: {
			window.history.pushState(null, null);
			smoothScrollToTop()

			let story = action.payload.story;
			let save_to_history = action.payload.save_to_history;
			let panel = action.payload.panel || initialState.activePanels[story];

			let storiesHistory = state.storiesHistory || [];
			if (save_to_history) {
				storiesHistory = [...storiesHistory, state.activeStory];
			} else {
				VK.swipeBackOff();
			}
			console.log('looook', panel, save_to_history);

			const newState = save_to_history ? state : initialState;

			return {
				...newState,
				activeStory: story,
				storiesHistory,
				activePanels: {
					...newState.activePanels,
					[story]: panel,
				},
				panelsHistory: {
					...newState.panelsHistory,
					[story]: [panel],
				},
				scrollPosition: [window.pageYOffset],
			};
		}

		case GO_BACK: {
			let Panel = state.activePanel;
			let Story = state.activeStory;

			let Popout = state.popouts[Story];

			let Dummies = state.dummies[Story] || [];
			// если были открытые заглушки
			if (Dummies.length > 0) {
				Dummies.pop();
				return {
					...state,
					dummies: {
						...state.dummies,
						[Story]: Dummies,
					},
				};
			}

			// если были открытые попауты
			if (Popout) {
				return {
					...state,
					popouts: {
						...state.popouts,
						[state.activeStory]: null,
					},
				};
			}

			let Modals = state.modalHistory[Story];

			// если были открытые модальные окна
			if (Modals.length > 0) {
				Modals.pop();
				let activeModal = null;
				if (Modals.length > 0) {
					activeModal = Modals[Modals.length - 1];
				}

				return {
					...state,
					activeModal: {
						...state.activeModal,
						[Story]: activeModal,
					},
					modalHistory: {
						...state.modalHistory,
						[Story]: Modals,
					},
				};
			}

			let Panels = state.panelsHistory[Story] || [Story];
			let Stories = state.storiesHistory;
			Panels.pop();

			let finish = false;

			if (Panels.length > 0) {
				Panel = Panels[Panels.length - 1];
			} else {
				Stories.pop();
				if (Stories.length > 0) {
					Story = Stories[Stories.length - 1];

					Panels = state.panelsHistory[Story];
					Panel = Panels[Panels.length - 1];
				} else {
					finish = true;
				}
			}

			if (finish) {
				VK.closeApp();
				return;
			}
			// VK.swipeBackOff();

			let Profile = state.activeProfile;
			let Profiles = state.profileHistory;
			if (state.activePanel == PANEL_USER) {
				Profiles.pop();
				Profile = Profiles[Profiles.length - 1];
			}

			let Ad = state.activeAd;
			let Ads = state.adHistory;
			if (state.activePanel == PANEL_ONE) {
				Ads.pop();
				Ad = Ads[Ads.length - 1];
				store.dispatch(backToPrevAd());
			}

			const scrollPosition = state.scrollPosition || [];
			scrollPosition.pop();

			return {
				...state,

				activePanels: {
					...state.activePanels,
					[Story]: Panel,
				},
				panelsHistory: {
					...state.panelsHistory,
					[Story]: Panels,
				},

				activeStory: Story,

				activeAd: Ad,
				activeProfile: Profile,

				profileHistory: Profiles,
				adHistory: Ads,
				scrollPosition,
			};
		}

		case SET_TAB: {
			window.history.pushState(null, null);

			const Story = state.activeStory;
			const tab = action.payload.tab;

			return {
				...state,
				activeTabs: {
					...state.activeTabs,
					[Story]: tab,
				},
			};
		}

		case OPEN_POPOUT: {
			window.history.pushState(null, null);

			const Story = state.activeStory;
			const popout = action.payload.popout;

			return {
				...state,
				popouts: {
					...state.popouts,
					[Story]: popout,
				},
			};
		}

		case CLOSE_POPOUT: {
			const Story = state.activeStory;
			return {
				...state,
				popouts: {
					...state.popouts,
					[Story]: null,
				},
			};
		}

		case OPEN_SNACKBAR: {
			window.history.pushState(null, null);

			const Story = state.activeStory;
			const Panel = state.activePanels[Story];
			const snackbar = action.payload.snackbar;

			// console.log('we set snackbar', snackbar)

			return {
				...state,
				snackbars: {
					...state.snackbars,
					[Panel]: snackbar,
				},
			};
		}

		case CLOSE_SNACKBAR: {
			const Story = state.activeStory;
			const Panel = state.activePanels[Story];
			return {
				...state,
				snackbars: {
					...state.snackbars,
					[Panel]: null,
				},
			};
		}

		case OPEN_MODAL: {
			window.history.pushState(null, null);

			let Story = state.activeStory;
			let modal = action.payload.modal;
			let Modals = state.modalHistory[Story] || [];

			return {
				...state,
				activeModals: {
					...state.activeModals,
					[Story]: modal,
				},
				modalHistory: {
					...state.modalHistory,
					[Story]: [...Modals, modal],
				},
			};
		}

		case CLOSE_MODAL: {
			let Story = state.activeStory;
			let modal = null;
			let Modals = state.modalHistory[Story] || [modal];
			Modals.pop();

			if (Modals.length > 0) {
				modal = Modals[Modals.length - 1];
			}

			return {
				...state,
				activeModals: {
					...state.activeModals,
					[Story]: modal,
				},
				modalHistory: {
					...state.modalHistory,
					[Story]: Modals,
				},
			};
		}

		case CLOSE_ALL_MODALS: {
			let Story = state.activeStory;

			return {
				...state,
				activeModals: {
					...state.activeModals,
					[Story]: null,
				},
				modalHistory: {
					...state.modalHistory,
					[Story]: [],
				},
			};
		}

		default: {
			return state;
		}
	}
};
