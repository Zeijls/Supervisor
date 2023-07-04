// Imports => React
import React, { useEffect, useMemo, memo } from 'react';
import clsx from 'clsx';

// Imports => Utilities
import { AcClasses } from '@utils';

const _CLASSES = {
	MAIN: 'ac-drawer',
	PLACEHOLDER: 'ac-drawer-placeholder',
	FLAT: 'ac-drawer--flat',
	STICKY: 'ac-drawer--sticky',
	HIDDEN: 'ac-drawer--hidden',
};

let classes = null;

const AcDrawer = ({
	children,
	sticky = false,
	flat,
	point = 1.2,
	className,
	placeholder = null,
}) => {
	useEffect(() => {
		classes = new AcClasses();

		addEvents().then(() => {
			handleScrollEvent();
		});

		return () => removeEvents();
	}, [sticky]);

	const addEvents = () => {
		return new Promise(resolve => {
			setTimeout(() => {
				const $drawer = document.getElementById(_CLASSES.MAIN);
				const $placeholder = document.getElementById(_CLASSES.PLACEHOLDER);
				const $header = document.getElementById('ac-header');
				const $introduction = $drawer.querySelector('.ac-action-introduction');

				const headerHeight = $header ? $header.clientHeight : 90;

				$placeholder.style.height = `${$drawer.offsetHeight}px`;
				$placeholder.style.top = `-${$drawer.offsetHeight - headerHeight}px`;

				if ($introduction) {
					$introduction.style.marginBottom = `-${$introduction.offsetHeight /
						2 +
						20}px`;
					$drawer.style.marginBottom = `${$introduction.offsetHeight / 2 +
						10}px`;
				}

				if (sticky) {
					const $scroller = document.getElementById('ac-scroller');
					if ($scroller) {
						$scroller.addEventListener('scroll', handleScrollEvent, {
							passive: true,
							capture: false,
						});
						handleScrollEvent();
					}
				}

				resolve();
			}, 1000);
		});
	};

	const removeEvents = () => {
		const $scroller = document.getElementById('ac-scroller');
		if ($scroller)
			$scroller.removeEventListener('scroll', handleScrollEvent, {
				passive: true,
				capture: false,
			});

		const $drawer = document.getElementById(_CLASSES.MAIN);
		const $placeholder = document.getElementById(_CLASSES.PLACEHOLDER);

		if ($placeholder) classes.removeClass($placeholder, _CLASSES.STICKY);
		if ($drawer) classes.removeClass($drawer, _CLASSES.STICKY);
	};

	const handleScrollEvent = event => {
		const $drawer = document.getElementById(_CLASSES.MAIN);
		const drawer_offset = $drawer.getBoundingClientRect();

		const $header = document.getElementById('ac-header');

		const $placeholder = document.getElementById(_CLASSES.PLACEHOLDER);

		const diff = drawer_offset.height + drawer_offset.top;
		const headerHeight = $header ? $header.clientHeight : 90;
		const offset_point = headerHeight * point;

		const $rows = $drawer.querySelectorAll('[rel="pop"]');

		const len = $rows.length;
		let n = 0;
		for (n; n < len; n++) {
			const $el = $rows[n];
			const bounding = $el.getBoundingClientRect();
			const top = bounding.top + 60;

			if (top <= offset_point) {
				classes.addClass($el, _CLASSES.HIDDEN);
			} else {
				classes.removeClass($el, _CLASSES.HIDDEN);
			}
		}

		if (diff <= headerHeight) {
			classes.addClass($placeholder, _CLASSES.STICKY);
			classes.addClass($drawer, _CLASSES.STICKY);
		} else {
			classes.removeClass($placeholder, _CLASSES.STICKY);
			classes.removeClass($drawer, _CLASSES.STICKY);
		}
	};

	const getStyleClassNames = useMemo(() => {
		return clsx(_CLASSES.MAIN, className, flat && _CLASSES.FLAT);
	}, [className, flat]);

	return (
		<>
			<section className={getStyleClassNames} id={_CLASSES.PLACEHOLDER}>
				{placeholder}
			</section>
			<section className={getStyleClassNames} id={_CLASSES.MAIN}>
				{children}
			</section>
		</>
	);
};

export default memo(AcDrawer);
