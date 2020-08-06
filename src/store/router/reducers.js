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
import { NO_DIRECTION, DIRECTION_BACK, DIRECTION_FORWARD } from './directionTypes';

const initialState = {
	activeStory: STORY_ADS,
	storiesHistory: [STORY_ADS],
	direction: NO_DIRECTION,
	from: '',
	to: '',

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

	scrollHistory: [],
	scrollPosition: { x: 0, y: 0 },
};

export const routerReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_PAGE: {
			const pos = { x: window.pageXOffset, y: window.pageYOffset };
			window.history.pushState(null, null);
			smoothScrollToTop();

			let panel = action.payload.panel;

			let Story = state.activeStory;
			let Panels = state.panelsHistory[Story] || [];
			Panels = [...Panels, panel];
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
				direction: DIRECTION_FORWARD,
				from: state.activePanels[Story],
				to: panel,

				scrollHistory: [...state.scrollHistory, pos],
				scrollPosition: { x: 0, y: 0 },
			};
		}

		case SET_DUMMY: {
			const pos = { x: window.pageXOffset, y: window.pageYOffset };
			let dummy = action.payload.dummy;

			let Story = state.activeStory;
			let dummies = state.dummies[Story] || [];

			return {
				...state,
				dummies: {
					...state.dummies,
					[Story]: [...dummies, dummy],
				},
				scrollHistory: [...state.scrollHistory, pos],
				scrollPosition: { x: 0, y: 0 },
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
			return {
				...state,
				activeProfile: profile,
				profileHistory: Profiles,
			};
		}

		case SET_PROFILE: {
			const pos = { x: window.pageXOffset, y: window.pageYOffset };
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

				direction: DIRECTION_FORWARD,
				from: state.activePanels[Story],
				to: panel,

				scrollHistory: [...state.scrollHistory, pos],
				scrollPosition: { x: 0, y: 0 },
			};
		}

		case SET_AD: {
			const pos = { x: window.pageXOffset, y: window.pageYOffset };
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

			const scrollHistory = [...state.scrollHistory, pos];

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

				direction: DIRECTION_FORWARD,
				from: state.activePanels[Story],
				to: panel,

				activeAd: ad,
				adHistory: Ads,

				scrollHistory,
				scrollPosition: { x: 0, y: 0 },
			};
		}

		case SET_STORY: {
			window.history.pushState(null, null);
			smoothScrollToTop();

			let story = action.payload.story;
			let save_to_history = action.payload.save_to_history;
			let panel = action.payload.panel || initialState.activePanels[story];

			let storiesHistory = state.storiesHistory || [];
			if (save_to_history) {
				storiesHistory = [...storiesHistory, state.activeStory];
			} else {
				VK.swipeBackOff();
			}

			const newState = save_to_history ? state : initialState;
			const scrollHistory = save_to_history
				? [
						...state.scrollHistory,
						{
							x: window.pageXOffset,
							y: window.pageYOffset,
						},
				  ]
				: [];

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

				direction: DIRECTION_FORWARD,
				from: state.activePanels[state.activeStory],
				to: panel,

				scrollHistory,
				scrollPosition: { x: 0, y: 0 },
			};
		}

		case GO_BACK: {
			let Story = state.activeStory;
			let Popout = state.popouts[Story];
			let Dummies = state.dummies[Story] || [];

			// если были открытые заглушки
			if (Dummies.length > 0) {
				Dummies.pop();
				const scrollHistory = state.scrollHistory;
				const scrollPosition = scrollHistory.length > 0 ? scrollHistory.pop() : state.scrollPosition;

				return {
					...state,

					direction: DIRECTION_BACK,
					from: '',
					to: '',

					dummies: {
						...state.dummies,
						[Story]: Dummies,
					},
					scrollHistory,
					scrollPosition,
				};
			}

			// если были открытые попауты
			if (Popout) {
				return {
					...state,
					direction: DIRECTION_BACK,
					from: '',
					to: '',
					popouts: {
						...state.popouts,
						[state.activeStory]: null,
					},
				};
			}

			let Modals = state.modalHistory[Story];
			// если были открытые модальные окна
			if (Modals && Modals.length > 0) {
				Modals.pop();
				let activeModal = null;
				if (Modals.length > 0) {
					activeModal = Modals[Modals.length - 1];
				}

				return {
					...state,
					direction: DIRECTION_BACK,
					from: '',
					to: '',
					activeModals: {
						...state.activeModal,
						[Story]: activeModal,
					},
					modalHistory: {
						...state.modalHistory,
						[Story]: Modals,
					},
				};
			}

			console.log('GO_BACK ELSE');

			let Panels = state.panelsHistory[Story] || [Story];
			let Stories = state.storiesHistory;
			Panels.pop();

			let finish = false;
			let Panel = state.activePanels[Story];
			let storyChange = false;

			if (Panels.length > 0) {
				Panel = Panels[Panels.length - 1];
			} else {
				Stories.pop();
				storyChange = true;
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
				return state;
			}
			// VK.swipeBackOff();

			let Profile = state.activeProfile;
			let Profiles = state.profileHistory;
			if (state.activePanels[Story] == PANEL_USER && !storyChange) {
				Profiles.pop();
				Profile = Profiles[Profiles.length - 1];
			}

			let Ad = state.activeAd;
			let Ads = state.adHistory;
			if (state.activePanels[Story] == PANEL_ONE && !storyChange) {
				Ads.pop();
				Ad = Ads[Ads.length - 1];
			}

			const scrollHistory = state.scrollHistory;
			const scrollPosition = scrollHistory.length > 0 ? scrollHistory.pop() : state.scrollPosition;

			console.log('GO_BACK history', scrollHistory, scrollPosition);
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

				direction: DIRECTION_BACK,
				from: state.activePanels[Story],
				to: Panel,

				activeAd: Ad,
				activeProfile: Profile,

				profileHistory: Profiles,
				adHistory: Ads,
				scrollHistory,
				scrollPosition,
			};
		}

		case SET_TAB: {
			window.history.pushState(null, null);

			const Story = state.activeStory;
			const tab = action.payload.tab;

			return {
				...state,
				direction: DIRECTION_FORWARD,
				from: '',
				to: '',
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
				snackbars: {},
			};
		}

		case OPEN_MODAL: {
			window.history.pushState(null, null);

			let Story = state.activeStory;
			let modal = action.payload.modal;
			let Modals = state.modalHistory[Story] || [];
			const direction = action.payload.direction ? action.payload.direction : DIRECTION_FORWARD;

			// console.log("OPEN_MODAL ", Story, activeModals, modalHistory)

			return {
				...state,
				direction,
				from: '',
				to: '',
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
				direction: DIRECTION_BACK,
				from: '',
				to: '',
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
				direction: DIRECTION_BACK,
				from: '',
				to: '',
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
