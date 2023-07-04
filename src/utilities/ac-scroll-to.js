// Imports => Utilities
import { AcIsSet } from '@utils';

// Easing
if (!AcIsSet(Math.easeInOutQuad)) {
	Math.easeInOutQuad = (t, b, c, d) => {
		t /= d / 2;
		if (t < 1) return (c / 2) * t * t + b;
		t--;
		return (-c / 2) * (t * (t - 2) - 1) + b;
	};
}

let AcScrollToTimer = null;

export const AcScrollTo = ($scroller, $target, offset, duration = 1000) => {
	clearTimeout(AcScrollToTimer);

	let _scroller = $scroller;
	let start = _scroller.scrollTop,
		to = $target ? $target.getBoundingClientRect().top - offset : 0,
		change = to,
		currentTime = 0,
		increment = 20;

	const animateScroll = () => {
		currentTime += increment;
		let val = Math.easeInOutQuad(currentTime, start, change, duration);

		_scroller.scrollTop = val;

		if (currentTime < duration) {
			AcScrollToTimer = setTimeout(animateScroll, increment);
		}
	};

	animateScroll();
};

export default AcScrollTo;
