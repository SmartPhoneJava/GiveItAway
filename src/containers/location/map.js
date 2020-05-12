import { connect } from 'react-redux';

import { setGeoDataString, setGeoData } from '../../store/create_post/actions';

import AdMap, { ON_REFRESH_CLICK } from './../../components/location/map';

const mapStateToProps = (state) => {
	return {
		inputData: state.formData.forms,
		AD: state.ad,
		dadataB: ON_REFRESH_CLICK,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setGeoData: (s) => dispatch(setGeoData(s)),
		setGeoDataString: (s) => dispatch(setGeoDataString(s)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(AdMap);
