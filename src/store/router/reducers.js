import {
	ADD_PROFILE,
	ADD_AD,
	SET_PAGE,
	GO_BACK,
	OPEN_POPOUT,
	CLOSE_POPOUT,
	OPEN_MODAL,
	CLOSE_MODAL,
	SET_STORY,
	SET_PROFILE,
	SET_AD,
} from './actionTypes';

import * as VK from '../../services/VK';
import { smoothScrollToTop } from '../../services/_functions';
import { STORY_ADS, STORY_CREATE } from './storyTypes';
import { PANEL_ADS, PANEL_CREATE, PANEL_USER, PANEL_ONE } from './panelTypes';
import { AdDefault } from '../../panels/template/AddMore2';

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

	popouts: [],

	scrollPosition: [],
};

export const routerReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_PAGE: {
			window.history.pushState(null, null);

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

		case ADD_PROFILE: {
			let profile = action.payload.profile;
			let Profiles = state.profileHistory;
			Profiles = state.activeProfile ? [...Profiles, state.activeProfile] : Profiles;
			console.log('set activeProfile', profile);
			return {
				...state,
				activeProfile: profile,
				profileHistory: Profiles,
			};
		}

		case SET_PROFILE: {
			window.history.pushState(null, null);

			let panel = action.payload.panel;
			let profile = action.payload.profile;

			let Story = state.activeStory;
			let Panels = state.panelsHistory[Story] || [];
			let Profiles = state.profileHistory;

			Panels = [...Panels, panel];
			Profiles = state.activeProfile ? [...Profiles, state.activeProfile] : Profiles;

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

			VK.swipeBackOff();

			let story = action.payload.story;

			return {
				...initialState,
				activeStory: story,
				scrollPosition: [window.pageYOffset],
			};
		}

		case GO_BACK: {
			let Panel = state.activePanel;
			let Story = state.activeStory;

			let popoutsData = state.popouts;

			// если были открытые попауты
			if (popoutsData.length > 0) {
				popoutsData.pop();

				return {
					...state,
					popouts: popoutsData,
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
			}

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
			};
		}

		case OPEN_POPOUT: {
			window.history.pushState(null, null);

			return {
				...state,
				popouts: {
					...state.popouts,
					[state.activeStory]: action.payload.popout,
				},
			};
		}

		case CLOSE_POPOUT: {
			return {
				...state,
				popouts: {
					...state.popouts,
					[state.activeStory]: null,
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

		default: {
			return state;
		}
	}
};
