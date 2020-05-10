import {SET_FORM_DATA} from './actionTypes';
import { CREATE_AD_ITEM } from './types';

const initialState = {
    forms: {
        CREATE_AD_ITEM: {
            name:"",
            description: "",
            photoText: "",
            photosUrl: [],
        }
    }
};

export const formDataReducer = (state = initialState, action) => {

    switch (action.type) {

        case SET_FORM_DATA: {
            return {
                ...state,
                forms: {
                    ...state.forms,
                    [action.payload.form]: action.payload.data
                }
            };
        }

        default: {
            return state;
        }

    }

};