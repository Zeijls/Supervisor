// Imports => React
import React, { useMemo, memo } from 'react';
import clsx from 'clsx';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

// Imports => Atoms
import AcToaster from '@atoms/ac-toaster/ac-toaster.web';

const _CLASSES = {
	MAIN: 'ac-toaster-hoc',
	TRANSITION: 'ac-toaster-transition',
};

const AcToasterHoc = ({ queue, callback }) => {
	const handleCallback = (id) => {
		if (callback) callback(id);
	};

	const getStyleClassNames = useMemo(() => {
		return clsx(_CLASSES.MAIN);
	}, []);

	const renderToasts = useMemo(() => {
		if (!queue) return null;

		const len = queue.length;
		let n = 0;
		let result = [];

		for (n; n < len; n++) {
			const toast = queue[n];

			const object = (
				<CSSTransition
					classNames={_CLASSES.TRANSITION}
					timeout={{ enter: 1000, exit: 1000 }}
					key={`ac-toaster-${toast.id}`}
				>
					<AcToaster {...toast} callback={handleCallback} />
				</CSSTransition>
			);

			result.push(object);
		}

		return result;
	}, [queue]);

	return (
		<TransitionGroup className={getStyleClassNames}>
			{renderToasts}
		</TransitionGroup>
	);
};

export default AcToasterHoc;
