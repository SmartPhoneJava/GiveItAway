import {SET_FORM_DATA, SET_GEO_DATA, SET_GEO_DATA_STRING, SET_FIAS} from './actionTypes';

export const setFormData = (formName, inputData) => (
    {
        type: SET_FORM_DATA,
        payload: {
            form: formName,
            data: inputData,
        }
    }
);

export const setGeoData = (activeStory, geodata) => (
    {
        type: SET_GEO_DATA,
        payload: {
            geodata,
            activeStory,
        }
    }
);

export const setGeoDataString = (activeStory, geodata_string) => (
    {
        type: SET_GEO_DATA_STRING,
        payload: {
            geodata_string,
            activeStory,
        }
    }
);

export const setFias = (fias) => (
    {
        type: SET_FIAS,
        payload: {
            fias,
        }
    }
);