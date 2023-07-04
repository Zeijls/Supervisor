// Imports => React
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AcScrollHOC = ({ children }) => {
	const location = useLocation();

	useEffect(
		() => {
			const $scroller = document.getElementById('ac-scroller');
			if ($scroller && $scroller.scrollTo) {
				$scroller.scrollTo(0, 0);
				window.scrollTo(0, 0);
			}
		},
		[location]
	);

	return children;
};

export default AcScrollHOC;
