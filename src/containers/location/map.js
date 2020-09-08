import { connect } from 'react-redux';

import AdMap, { ON_REFRESH_CLICK } from './../../components/location/map';

const mapStateToProps = (state) => {
	return {
		inputData: state.formData.forms,
		activeStory: state.router.activeStory,
		activeContext: state.router.activeContext,
		
		dadataB: ON_REFRESH_CLICK,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AdMap);
