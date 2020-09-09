import {
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
	SET_STORY_PROFILE,
	UPDATE_CONTEXT,
} from './actionTypes';

import * as VK from '../../services/VK';
import { smoothScrollToTop } from '../../services/_functions';
import { STORY_ADS, STORY_CREATE, STORY_NOTIFICATIONS, STORY_PROFILE } from './storyTypes';
import {
	PANEL_ADS,
	PANEL_CREATE,
	PANEL_USER,
	PANEL_NOTIFICATIONS,
	PANEL_SUBS,
	PANEL_COMMENTS,
	PANEL_MAP,
} from './panelTypes';
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
		[STORY_NOTIFICATIONS]: PANEL_NOTIFICATIONS,
		[STORY_PROFILE]: PANEL_USER,
	},
	panelsHistory: {
		[STORY_ADS]: [],
		[STORY_CREATE]: [],
		[STORY_NOTIFICATIONS]: [],
		[STORY_PROFILE]: [],
	},
	activeContext: {
		[STORY_ADS]: {},
		[STORY_CREATE]: {},
		[STORY_NOTIFICATIONS]: {},
		[STORY_PROFILE]: {},
	},
	historyContext: {
		[STORY_ADS]: [],
		[STORY_CREATE]: [],
		[STORY_NOTIFICATIONS]: [],
		[STORY_PROFILE]: [],
	},

	activeTabs: {
		[STORY_ADS]: TAB_ADS,
		[STORY_CREATE]: TAB_ADS,
		[STORY_NOTIFICATIONS]: TAB_ADS,
		[STORY_PROFILE]: TAB_ADS,
	},

	activeModals: {
		[STORY_ADS]: null,
		[STORY_CREATE]: null,
		[STORY_NOTIFICATIONS]: null,
		[STORY_PROFILE]: null,
	},
	modalHistory: {
		[STORY_ADS]: [],
		[STORY_CREATE]: [],
		[STORY_NOTIFICATIONS]: [],
		[STORY_PROFILE]: [],
	},

	popouts: {
		[STORY_ADS]: null,
		[STORY_CREATE]: null,
		[STORY_NOTIFICATIONS]: null,
		[STORY_PROFILE]: null,
	},
	snackbars: {},

	dummies: {},

	scrollHistory: {
		[STORY_ADS]: [],
		[STORY_CREATE]: [],
		[STORY_NOTIFICATIONS]: [],
		[STORY_PROFILE]: [],
	},
	scrollPosition: {
		[STORY_ADS]: { x: 0, y: 0 },
		[STORY_CREATE]: { x: 0, y: 0 },
		[STORY_NOTIFICATIONS]: { x: 0, y: 0 },
		[STORY_PROFILE]: { x: 0, y: 0 },
	},
};

export const routerReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_PAGE: {
			const pos = { x: window.pageXOffset, y: window.pageYOffset };
			window.history.pushState(null, null);
			smoothScrollToTop();

			const panel = action.payload.panel;
			const Story = state.activeStory;

			const newContext =
				panel == PANEL_SUBS || panel == PANEL_COMMENTS || panel == PANEL_MAP ? state.activeContext[Story] : {};

			VK.swipeBackOn();

			return {
				...state,

				activePanels: {
					...state.activePanels,
					[Story]: panel,
				},
				panelsHistory: {
					...state.panelsHistory,
					[Story]: [...state.panelsHistory[Story], state.activePanels[Story]],
				},

				activeContext: {
					...state.activeContext,
					[Story]: newContext,
				},
				historyContext: {
					...state.historyContext,
					[Story]: [...state.historyContext[Story], state.activeContext[Story]],
				},

				direction: DIRECTION_FORWARD,
				from: state.activePanels[Story],
				to: panel,

				scrollHistory: {
					...state.scrollHistory,
					[Story]: [...state.scrollHistory[Story], pos],
				},
				scrollPosition: {
					...state.scrollPosition,
					[Story]: { x: 0, y: 0 },
				},
			};
		}

		case SET_DUMMY: {
			let dummy = action.payload.dummy;
			const Story = state.activeStory;

			return {
				...state,
				dummies: {
					...state.dummies,
					[Story]: [dummy],
				},
			};
		}

		case SET_PROFILE: {
			const pos = { x: window.pageXOffset, y: window.pageYOffset };
			window.history.pushState(null, null);
			smoothScrollToTop();

			const panel = action.payload.panel;
			const profile = { vk_id: action.payload.profile };

			const Story = state.activeStory;

			VK.swipeBackOn();

			return {
				...state,

				activePanels: {
					...state.activePanels,
					[Story]: panel,
				},
				panelsHistory: {
					...state.panelsHistory,
					[Story]: [...state.panelsHistory[Story], state.activePanels[Story]],
				},

				activeContext: {
					...state.activeContext,
					[Story]: profile,
				},
				historyContext: {
					...state.historyContext,
					[Story]: [...state.historyContext[Story], state.activeContext[Story]],
				},

				direction: DIRECTION_FORWARD,
				from: state.activePanels[Story],
				to: panel,

				scrollHistory: {
					...state.scrollHistory,
					[Story]: [...state.scrollHistory[Story], pos],
				},
				scrollPosition: {
					...state.scrollPosition,
					[Story]: { x: 0, y: 0 },
				},
			};
		}

		case UPDATE_CONTEXT: {
			const Story = state.activeStory;
			const info = action.payload.info;

			return {
				...state,

				activeContext: {
					...state.activeContext,
					[Story]: { ...state.activeContext[Story], ...info },
				},
			};
		}

		case SET_AD: {
			const pos = { x: window.pageXOffset, y: window.pageYOffset };
			window.history.pushState(null, null);
			smoothScrollToTop();

			const panel = action.payload.panel;
			const ad = action.payload.ad;

			const Story = state.activeStory;

			VK.swipeBackOn();

			return {
				...state,

				activePanels: {
					...state.activePanels,
					[Story]: panel,
				},
				panelsHistory: {
					...state.panelsHistory,
					[Story]: [...state.panelsHistory[Story], state.activePanels[Story]],
				},

				activeContext: {
					...state.activeContext,
					[Story]: ad,
				},
				historyContext: {
					...state.historyContext,
					[Story]: [...state.historyContext[Story], state.activeContext[Story]],
				},

				direction: DIRECTION_FORWARD,
				from: state.activePanels[Story],
				to: panel,

				scrollHistory: {
					...state.scrollHistory,
					[Story]: [...state.scrollHistory[Story], pos],
				},
				scrollPosition: {
					...state.scrollPosition,
					[Story]: { x: 0, y: 0 },
				},
			};
		}

		case SET_STORY: {
			const pos = { x: window.pageXOffset, y: window.pageYOffset };
			window.history.pushState(null, null);
			smoothScrollToTop();

			const story = action.payload.story;
			const save_to_history = action.payload.save_to_history;
			const panel = action.payload.panel || initialState.activePanels[story];

			const the_same_story = story == state.activeStory;

			let storiesHistory = state.storiesHistory || [];
			if (save_to_history) {
				storiesHistory = [...storiesHistory, state.activeStory];
			} else {
				VK.swipeBackOff();
			}

			const newPanel = the_same_story ? panel : state.activePanels[story];
			const newPanelsHistory = the_same_story ? [] : state.panelsHistory[story];

			const newContext = the_same_story ? {} : state.activeContext[story];
			const newContextHistory = the_same_story ? [] : state.historyContext[story];

			return {
				...state,
				activeStory: story,
				storiesHistory,
				activePanels: {
					...state.activePanels,
					[story]: newPanel,
				},
				panelsHistory: {
					...state.panelsHistory,
					[story]: newPanelsHistory,
				},

				activeContext: {
					...state.activeContext,
					[story]: newContext,
				},
				historyContext: {
					...state.historyContext,
					[story]: newContextHistory,
				},

				direction: the_same_story ? DIRECTION_FORWARD : DIRECTION_BACK,

				from: state.activePanels[state.activeStory],
				to: panel,

				scrollHistory: {
					...state.scrollHistory,
					[story]: the_same_story ? [] : state.scrollHistory[story],
				},
				scrollPosition: {
					...state.scrollPosition,
					[story]: the_same_story
						? { x: 0, y: 0 }
						: state.scrollHistory[story][state.scrollHistory[story].length - 1],
				},
			};
		}

		case SET_STORY_PROFILE: {
			window.history.pushState(null, null);
			smoothScrollToTop();

			let story = STORY_PROFILE;
			let panel = PANEL_USER;
			const Story = state.activeStory;
			let storiesHistory = state.storiesHistory || [];
			storiesHistory = [...storiesHistory, Story];

			let panelsHistory = state.panelsHistory[story] || [];

			const the_same_story = story == state.activeStory;

			const newPanel = the_same_story ? panel : state.activePanels[story];
			const newPanelsHistory = the_same_story ? [panel] : panelsHistory;

			const activeContext = the_same_story
				? { vk_id: action.payload.profileID }
				: state.activeContext[STORY_PROFILE];
			const is_inited = activeContext.backUser != null;

			const newContextHistory = the_same_story ? [] : state.historyContext[story];

			return {
				...state,
				activeStory: story,
				storiesHistory,
				activePanels: {
					...state.activePanels,
					[story]: newPanel,
				},
				panelsHistory: {
					...state.panelsHistory,
					[story]: newPanelsHistory,
				},

				activeContext: {
					...state.activeContext,
					[story]: activeContext,
				},
				historyContext: {
					...state.historyContext,
					[story]: newContextHistory,
				},

				direction: the_same_story || !is_inited ? DIRECTION_FORWARD : DIRECTION_BACK,
				from: state.activePanels[state.activeStory],
				to: panel,

				scrollHistory: {
					...state.scrollHistory,
					[story]: the_same_story ? [] : state.scrollHistory[Story],
				},
				scrollPosition: {
					...state.scrollPosition,
					[story]: the_same_story
						? { x: 0, y: 0 }
						: state.scrollHistory[story][state.scrollHistory[story].length - 1],
				},
			};
		}

		case GO_BACK: {
			const Story = state.activeStory;
			let Popout = state.popouts[Story];
			let Dummies = state.dummies[Story] || [];

			console.log("fast GO_BACK", state)
			// если были открытые заглушки
			if (Dummies.length > 0) {
				Dummies.pop();

				return {
					...state,

					direction: DIRECTION_BACK,
					from: '',
					to: '',

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
			VK.swipeBackOn()

			// обновляем панель

			// убрать все setStory

			let Panels = state.panelsHistory[Story];
			if (Panels.length == 0) {
				VK.closeApp();
				return state;
			}

			const oldPanel = state.activePanels[Story];
			const newPanel = state.panelsHistory[Story][state.panelsHistory[Story].length - 1];

			let newContext = state.historyContext[Story][state.historyContext[Story].length - 1];
			newContext =
				oldPanel == PANEL_COMMENTS || oldPanel == PANEL_SUBS
					? { ...newContext, ...state.activeContext[Story] }
					: newContext;

			const newScroll = state.scrollHistory[Story][state.scrollHistory[Story].length - 1];

			return {
				...state,

				activePanels: {
					...state.activePanels,
					[Story]: newPanel,
				},
				panelsHistory: {
					...state.panelsHistory,
					[Story]: state.panelsHistory[Story].slice(0, state.panelsHistory[Story].length - 1),
				},

				activeContext: {
					...state.activeContext,
					[Story]: newContext,
				},
				historyContext: {
					...state.historyContext,
					[Story]: state.historyContext[Story].slice(0, state.historyContext[Story].length - 1),
				},

				direction: DIRECTION_BACK,
				from: state.activePanels[Story],
				to: state.panelsHistory[state.panelsHistory[Story].length - 1],

				scrollHistory: {
					...state.scrollHistory,
					[Story]: state.scrollHistory[Story].slice(0, state.scrollHistory[Story].length - 1),
				},
				scrollPosition: {
					...state.scrollPosition,
					[Story]: newScroll,
				},
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

			return {
				...state,
				snackbars: {
					...state.snackbars,
					[Panel]: snackbar,
				},
			};
		}

		case CLOSE_SNACKBAR: {
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
			
			VK.swipeBackOff()
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
			} else {
				VK.swipeBackOn()
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
			VK.swipeBackOn()

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

// 740 -> 850 -> 665
