// Imports => React
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import ReactCSSTransitionReplace from 'react-css-transition-replace';
import { useHistory } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Utilities
import {
	AcIsSet,
	AcIsNull,
	AcIsEmptyString,
	AcIsEmail,
	AcSupportsWEBP,
	AcGetState,
	AcSaveState,
} from '@utils';

// Imports => Constants
import {
	DEFAULT_ROUTE,
	KEYS,
	ROUTES,
	THEMES,
	TITLES,
	TYPES,
	VARIANTS,
} from '@constants';

// Imports => Atoms
import { AcContainer, AcRow, AcColumn } from '@atoms/ac-grid';
import AcImage from '@atoms/ac-image/ac-image.web';
import AcCard from '@atoms/ac-card/ac-card.web';
import AcHeading from '@atoms/ac-heading/ac-heading.web';
import AcRichContent from '@atoms/ac-rich-content/ac-rich-content.web';
import AcTextInput from '@atoms/ac-text-input/ac-text-input.web';
import AcButton from '@atoms/ac-button/ac-button.web';

const _CLASSES = {
	MAIN: 'ac-page ac-page--fullscreen ac-login',
};

const AcForgotPassword = ({ store }) => {
	const history = useHistory();
	const { is_loading } = store.auth;
	const [success, setSuccess] = useState(false);
	const [email, setEmail] = useState('');
	const [errors, setErrors] = useState({
		[KEYS.EMAIL]: undefined,
	});

	useEffect(() => {}, []);

	const hasErrors = useMemo(() => {
		const result = !AcIsNull(errors[KEYS.EMAIL]);
		return result;
	}, [email, errors]);

	const handleFormSubmit = async (event) => {
		if (event && event.preventDefault) event.preventDefault();
		if (hasErrors) return;

		await store.auth
			.forgot_password({ email })
			.then(() => {
				setSuccess(true);
			})
			.catch((error) => {
				setSuccess(false);
			});
	};

	const handleToLogin = (event) => {
		if (event && event.preventDefault) event.preventDefault();

		const { replace } = history;
		if (replace) replace(ROUTES.LOGIN.path);
	};

	const handleInputValidation = useCallback((name, value, type) => {
		let result = errors;

		switch (name) {
			case KEYS.EMAIL:
				if (!AcIsSet(value) || AcIsEmptyString(value)) {
					result[name] = 'Email address is required';
				} else if (!AcIsEmptyString(value) && !AcIsEmail(value)) {
					result[name] = 'This is not a valid email address';
				} else {
					result[name] = null;
				}
				break;

			default:
		}

		setErrors(result);

		return result[name];
	}, []);

	const handleInputChange = (event, name, value, type) => {
		if (event && event.persist) event.persist();

		switch (name) {
			case KEYS.EMAIL:
				setEmail(value);
				break;

			default:
		}
	};

	const getEmailInputOptions = useMemo(() => {
		return {
			label: 'Your email address',
			placeholder: 'name@domain.com',
			type: TYPES.EMAIL,
			name: KEYS.EMAIL,
			value: email,
			required: true,
			focus: true,
			disabled: is_loading,
			validation: handleInputValidation,
			autoComplete: 'new-password',
			callback: handleInputChange,
		};
	}, [email, is_loading, handleInputValidation]);

	const getSubmitButtonOptions = useMemo(() => {
		return {
			type: TYPES.SUBMIT,
			theme: THEMES.ALPHA,
			disabled: hasErrors || is_loading,
			loading: is_loading,
			title: 'Send me a recovery link',
			callback: handleFormSubmit,
		};
	}, [email, hasErrors, is_loading, handleFormSubmit]);

	const getToLoginButtonOptions = useMemo(() => {
		return {
			type: TYPES.BUTTON,
			theme: THEMES.OMEGA,
			variant: VARIANTS.TEXT,
			disabled: is_loading,
			title: 'To login',
			callback: handleToLogin,
		};
	}, [is_loading, handleToLogin]);

	const getMainClassNames = useMemo(() => {
		return clsx(_CLASSES.MAIN);
	}, []);

	return (
		<div className={getMainClassNames}>
			<AcContainer fluid>
				<AcRow>
					<AcColumn
						xxs={12}
						xs={{ size: 10, offset: 1 }}
						sm={{ size: 8, offset: 2 }}
						md={{ size: 6, offset: 3 }}
						lg={{ size: 4, offset: 4 }}
					>
						<AcCard className={'h-padding-x-15 h-padding-y-15'}>
							<ReactCSSTransitionReplace
								transitionName="fade-wait"
								transitionEnterTimeout={500}
								transitionLeaveTimeout={500}
							>
								<div key={success}>
									{!success && (
										<form
											method={'post'}
											autoComplete={'off'}
											onSubmit={handleFormSubmit}
										>
											<AcContainer
												className={'h-text--align-left h-padding-y-20'}
											>
												<AcRow>
													<AcColumn>
														<AcHeading rank={3}>
															{TITLES.FORGOT_PASSWORD}
														</AcHeading>
													</AcColumn>
												</AcRow>

												<AcRow>
													<AcColumn>
														<AcRichContent
															content={
																'<p>Enter your email address which you use to log in to this portal. You will receive a recovery link to create a new password.</p>'
															}
														/>
													</AcColumn>
												</AcRow>

												<AcRow className={'h-margin-top-15'}>
													<AcColumn>
														<AcTextInput {...getEmailInputOptions} />
													</AcColumn>
												</AcRow>

												<AcRow className={'h-margin-top-25'}>
													<AcColumn
														xxs={12}
														xs={5}
														sm={4}
														className={
															'h-text--align-left h-flex-v-align-center'
														}
													>
														<AcButton {...getToLoginButtonOptions}>
															<span>Back to login</span>
														</AcButton>
													</AcColumn>

													<AcColumn
														xxs={12}
														xs={7}
														sm={8}
														className={'h-text--align-right'}
													>
														<AcButton {...getSubmitButtonOptions}>
															<span>Send me a recovery link</span>
														</AcButton>
													</AcColumn>
												</AcRow>
											</AcContainer>
										</form>
									)}
									{success && (
										<AcContainer
											className={'h-text--align-left h-padding-y-20'}
										>
											<AcRow>
												<AcColumn>
													<AcHeading rank={3}>
														{TITLES.FORGOT_PASSWORD}
													</AcHeading>
												</AcColumn>
											</AcRow>

											<AcRow>
												<AcColumn>
													<AcRichContent
														content={
															'<p class="h-margin-bottom-20">If an account exist with your email address, an email has been sent with a recovery link and further instructions.</p><p><strong>Please check your inbox</strong>.</p>'
														}
													/>
												</AcColumn>
											</AcRow>

											<AcRow className={'h-margin-top-25'}>
												<AcColumn
													className={'h-text--align-left h-flex-v-align-center'}
												>
													<AcButton {...getToLoginButtonOptions}>
														<span>Back to login</span>
													</AcButton>
												</AcColumn>
											</AcRow>
										</AcContainer>
									)}
								</div>
							</ReactCSSTransitionReplace>
						</AcCard>
					</AcColumn>
				</AcRow>
			</AcContainer>
		</div>
	);
};

export default withStore(observer(AcForgotPassword));
