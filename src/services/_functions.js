import { store } from './../index';

export const smoothScrollToTop = () => {
	// const c = document.documentElement.scrollTop || document.body.scrollTop;

	// if (c > 30) {
	//     return;
	// }

	// if (c > 0) {
	//     window.requestAnimationFrame(smoothScrollToTop);
	//     window.scrollTo(0, c - c / 8);
	// }
	window.scrollTo(0, 0);
};

export const getActivePanel = (view) => {
	let panel = store.getState().router.activePanel;

	let panelsHistory = store.getState().router.panelsHistory;
	if (typeof panelsHistory[view] !== 'undefined') {
		panel = panelsHistory[view][panelsHistory[view].length - 1];
	}

	return panel;
};

export function openTab(url) {
    // Create link in memory
    var a = window.document.createElement("a");
    a.target = '_blank';
    a.href = url;
 
    // Dispatch fake click
    var e = window.document.createEvent("MouseEvents");
    e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
};
