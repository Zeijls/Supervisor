// Imports => React
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import ReactCSSTransitionReplace from 'react-css-transition-replace';
import { useHistory } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import queryString from 'query-string-es5';
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
	AcIsLongEnough,
	AcHasUppercaseCharacters,
	AcHasLowercaseCharacters,
	AcHasNumericCharacter,
	AcHasSpecialCharacter,
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

const AcResetPassword = ({ store }) => {
	const history = useHistory();
	const { is_loading } = store.auth;

	const [success, setSuccess] = useState(false);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errors, setErrors] = useState({
		[KEYS.EMAIL]: undefined,
		[KEYS.PASSWORD]: undefined,
		[KEYS.CONFIRM_PASSWORD]: undefined,
	});

	useEffect(() => {}, []);

	const hasErrors = useMemo(() => {
		const result =
			!AcIsNull(errors[KEYS.EMAIL]) ||
			!AcIsNull(errors[KEYS.PASSWORD]) ||
			!AcIsNull(errors[KEYS.CONFIRM_PASSWORD]);
		return result;
	}, [email, password, confirmPassword, errors]);

	const passwordIsStrongEnough = useMemo(() => {
		const correctLength = AcIsLongEnough(password, 8);
		const containsUpperCase = AcHasUppercaseCharacters(password);
		const containsLowerCase = AcHasLowercaseCharacters(password);
		const containsNumeric = AcHasNumericCharacter(password);
		const containsSpecialCharacter = AcHasSpecialCharacter(password);

		return (
			correctLength &&
			containsUpperCase &&
			containsLowerCase &&
			containsNumeric &&
			containsSpecialCharacter
		);
	}, [password]);

	const handleFormSubmit = async (event) => {
		if (event && event.preventDefault) event.preventDefault();
		if (hasErrors) return;

		const parsed = queryString.parse(window.location.search);
		let token = null;
		if (parsed && parsed.token) token = parsed.token;

		await store.auth
			.reset_password({
				email,
				password,
				password_confirmation: confirmPassword,
				token,
			})
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

	const handleInputValidation = useCallback(
		(name, value, type) => {
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

				case KEYS.PASSWORD:
					if (!AcIsSet(value) || AcIsEmptyString(value)) {
						result[name] = 'Password is required';
					} else if (!passwordIsStrongEnough) {
						result[name] = 'Password is not strong enough';
					} else if (
						confirmPassword !== value &&
						!AcIsEmptyString(confirmPassword) &&
						confirmPassword.length > 0
					) {
						result[name] = 'Passwords do not match';
					} else {
						result[name] = null;
					}
					break;

				case KEYS.CONFIRM_PASSWORD:
					if (!AcIsSet(value) || AcIsEmptyString(value)) {
						result[name] = 'Re-enter your password to confirm your entry';
					} else if (
						password !== value &&
						!AcIsEmptyString(password) &&
						password.length > 0
					) {
						result[name] = 'Passwords do not match';
					} else {
						result[name] = null;
					}
					break;

				default:
			}

			setErrors(result);

			return result[name];
		},
		[email, password, confirmPassword, passwordIsStrongEnough]
	);

	const handleInputChange = (event, name, value, type) => {
		if (event && event.persist) event.persist();

		switch (name) {
			case KEYS.EMAIL:
				setEmail(value);
				break;

			case KEYS.PASSWORD:
				setPassword(value);
				break;

			case KEYS.CONFIRM_PASSWORD:
				setConfirmPassword(value);
				break;

			default:
		}
	};

	const getEmailInputOptions = useMemo(() => {
		return {
			label: 'Email address',
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

	const getPasswordInputOptions = useMemo(() => {
		return {
			label: 'New password',
			type: TYPES.PASSWORD,
			name: KEYS.PASSWORD,
			value: password,
			required: true,
			disabled: is_loading,
			validation: handleInputValidation,
			autoComplete: 'new-password',
			callback: handleInputChange,
		};
	}, [password, confirmPassword, is_loading, handleInputValidation]);

	const getConfirmPasswordInputOptions = useMemo(() => {
		return {
			label: 'Re-enter your new password',
			type: TYPES.PASSWORD,
			name: KEYS.CONFIRM_PASSWORD,
			value: confirmPassword,
			required: true,
			disabled: is_loading,
			validation: handleInputValidation,
			autoComplete: 'new-password',
			callback: handleInputChange,
		};
	}, [password, confirmPassword, is_loading, handleInputValidation]);

	const getInstructions = useMemo(() => {
		const correctLength = AcIsLongEnough(password, 8);
		const containsUpperCase = AcHasUppercaseCharacters(password);
		const containsLowerCase = AcHasLowercaseCharacters(password);
		const containsNumeric = AcHasNumericCharacter(password);
		const containsSpecialCharacter = AcHasSpecialCharacter(password);

		let result = '';

		result += `<li data-check="${correctLength}">
				is longer than <u>8 characters</u>
			</li>`;
		result += `<li data-check="${containsUpperCase}">
				contains an <u>uppercase</u> character
			</li>`;
		result += `<li data-check="${containsLowerCase}">
				contains a <u>lowercase</u> character
			</li>`;
		result += `<li data-check="${containsNumeric}">
				contains a <u>numeric</u> character
			</li>`;
		result += `<li data-check="${containsSpecialCharacter}">
				contains a <u>special</u> character
			</li>`;

		return `<ul>${result}</ul>`;
	}, [password, confirmPassword]);

	const getSubmitButtonOptions = useMemo(() => {
		return {
			type: TYPES.SUBMIT,
			theme: THEMES.ALPHA,
			disabled: hasErrors || is_loading,
			loading: is_loading,
			title: 'Send me a recovery link',
			callback: handleFormSubmit,
		};
	}, [
		email,
		password,
		confirmPassword,
		errors,
		hasErrors,
		is_loading,
		handleFormSubmit,
		passwordIsStrongEnough,
	]);

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
															{TITLES.RESET_PASSWORD}
														</AcHeading>
													</AcColumn>
												</AcRow>

												<AcRow>
													<AcColumn>
														<AcRichContent
															content={
																'<p>In order to <strong>protect your account</strong>, make sure your password:</p>'
															}
														/>
														<AcRichContent content={getInstructions} />
													</AcColumn>
												</AcRow>

												<AcRow>
													<AcColumn>
														<AcTextInput {...getEmailInputOptions} />
													</AcColumn>
												</AcRow>

												<AcRow>
													<AcColumn>
														<AcTextInput {...getPasswordInputOptions} />
													</AcColumn>
												</AcRow>

												<AcRow>
													<AcColumn>
														<AcTextInput {...getConfirmPasswordInputOptions} />
													</AcColumn>
												</AcRow>

												<AcRow className={'h-margin-top-15'}>
													<AcColumn
														xxs={12}
														xs={5}
														sm={4}
														className={
															'h-text--align-left h-flex-v-align-center'
														}
													>
														<AcButton {...getToLoginButtonOptions}>
															<span>To login</span>
														</AcButton>
													</AcColumn>

													<AcColumn
														xxs={12}
														xs={7}
														sm={8}
														className={'h-text--align-right'}
													>
														<AcButton {...getSubmitButtonOptions}>
															<span>Change password</span>
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
														{TITLES.RESET_PASSWORD}
													</AcHeading>
												</AcColumn>
											</AcRow>

											<AcRow>
												<AcColumn>
													<AcRichContent
														content={
															'<p class="h-margin-bottom-20">You new password has been saved. You can now proceed to login using your new password.</p>'
														}
													/>
												</AcColumn>
											</AcRow>

											<AcRow className={'h-margin-top-20'}>
												<AcColumn
													className={'h-text--align-left h-flex-v-align-center'}
												>
													<AcButton {...getToLoginButtonOptions}>
														<span>To login</span>
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

export default withStore(observer(AcResetPassword));
