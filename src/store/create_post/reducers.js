import { SET_FORM_DATA, SET_GEO_DATA, SET_GEO_DATA_STRING, SET_FIAS } from './actionTypes';
import { GEO_DATA } from './types';

const initialState = {
	forms: {
		CREATE_AD_ITEM: {
			name: '',
			description: '',
			photoText: '',
			photosUrl: [],
		},
	},
};

export const formDataReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_FORM_DATA: {
			return {
				...state,
				forms: {
					...state.forms,
					[action.payload.form]: action.payload.data,
				},
			};
		}

		case SET_GEO_DATA: {
            console.log("seeet SET_GEO_DATA", action.payload.geodata)
            const geodata = action.payload.geodata
			return {
				...state,
				forms: {
					...state.forms,
					[GEO_DATA]: {
                        ...state.forms[GEO_DATA],
                        geodata,
                    },
				},
			};
        }
        
        case SET_GEO_DATA_STRING: {
            console.log("seeet SET_GEO_DATA_STRING", action.payload.geodata_string)
            const geodata_string = action.payload.geodata_string
			return {
				...state,
				forms: {
					...state.forms,
					[GEO_DATA]: {
                        ...state.forms[GEO_DATA],
                        geodata_string,
                    },
				},
			};
        }
        
        case SET_FIAS: {
            const fias = action.payload.fias
			return {
				...state,
				forms: {
					...state.forms,
					[GEO_DATA]: {
                        ...state.forms[GEO_DATA],
                        fias,
                    },
				},
			};
		}

		default: {
			return state;
		}
	}
};
