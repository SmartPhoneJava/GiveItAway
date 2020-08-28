import React, { useState, useEffect } from 'react';
import { PanelHeader, PanelHeaderBack, Footer, Link } from '@vkontakte/vkui';

import { STORY_ADS } from './../store/router/storyTypes';
import { PANEL_USER, PANEL_ABOUT } from './../store/router/panelTypes';

import { connect } from 'react-redux';
import { goBack, setPage } from '../store/router/actions';

import Profile from './story/profile/Profile';

const ProfilePanel = (props) => {
	const [profileName, setProfileName] = useState('Профиль');

	const { panelsHistory, snackbars } = props;
	const { setReduxAd, goBack, setPage } = props;
	const historyLen = panelsHistory ? (panelsHistory[STORY_ADS] ? panelsHistory[STORY_ADS].length : 0) : 0;

	const openAboutPanel = () => {
		setPage(PANEL_ABOUT);
	};

	return (
		<>
			<PanelHeader
				left={historyLen <= 1 ? null : <PanelHeaderBack style={{ cursor: 'pointer' }} onClick={goBack} />}
			>
				<p className="panel-header"> {profileName} </p>
			</PanelHeader>
			<Profile setProfileName={setProfileName} setReduxAd={setReduxAd} />
			{snackbars[PANEL_USER]}
			<Footer>
				<Link style={{ cursor: 'pointer' }} onClick={openAboutPanel}>
					О приложении
				</Link>
			</Footer>
		</>
	);
};

const mapStateToProps = (state) => {
	return {
		panelsHistory: state.router.panelsHistory,
		snackbars: state.router.snackbars,
	};
};

const mapDispatchToProps = {
	goBack,
	setPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePanel);
