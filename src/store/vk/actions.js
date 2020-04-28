import {
    SET_COLOR_SCHEME,
    SET_ACCESS_TOKEN,
    SET_ACTIVE_TAB,
    SET_SCROLL_POSITION,
    SET_SCROLL_POSITION_BY_ID,
    SET_MY_ID,
    SET_APP_ID,
    SET_API_VERSION,
    SET_PLATFORM,
    SET_MY_USER
} from './actionTypes';

export const setColorScheme = (scheme) => (
    {
        type: SET_COLOR_SCHEME,
        payload: scheme
    }
);

export const setAccessToken = (accessToken) => (
    {
        type: SET_ACCESS_TOKEN,
        payload: accessToken
    }
);

export const setActiveTab = (component, tab) => (
    {
        type: SET_ACTIVE_TAB,
        payload: {
            component,
            tab
        }
    }
);

export const setScrollPosition = (component, x = 0, y = 0) => (
    {
        type: SET_SCROLL_POSITION,
        payload: {
            component,
            x,
            y
        }
    }
);

export const setScrollPositionByID = (component) => (
    {
        type: SET_SCROLL_POSITION_BY_ID,
        payload: {
            component
        }
    }
);

export const setMyID = (myID) => (
    {
        type: SET_MY_ID,
        payload: myID
    }
);

export const setAppID = (appID) => (
    {
        type: SET_APP_ID,
        payload: appID
    }
);

export const setApiVersion = (apiVersion) => (
    {
        type: SET_API_VERSION,
        payload: apiVersion
    }
);

export const setPlatform = (vkPlatform) => (
    {
        type: SET_PLATFORM,
        payload: vkPlatform
    }
);

export const setMyUser = (myUser) => (
    {
        type: SET_MY_USER,
        payload: myUser
    }
);