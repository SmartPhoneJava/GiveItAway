import { connect } from 'react-redux';

import { setGeoDataString, setGeoData } from '../../store/create_post/actions';

import AdMap from './../../components/location/map';

const mapStateToProps = (state) => {
	return {
		inputData: state.formData.forms,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setGeoData: (s) => dispatch(setGeoData(s)),
		setGeoDataString: (s) => dispatch(setGeoDataString(s)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(AdMap);
