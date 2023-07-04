// Imports => Vendor
import axios from 'axios';

// Imports => MOBX
import { makeObservable, observable, computed, action } from 'mobx';

// Imports => Constants
import { KEYS } from '@constants';

// Imports => Utilities
import {
	AcSanitize,
	AcAutoLoad,
	AcAutoSave,
	AcSaveState,
	AcRemoveState,
	AcIsSet,
	AcIsNull,
	AcFormatErrorMessage,
	AcFormatErrorCode,
	AcIsUndefined,
} from '@utils';

const _default = {
	options: {},
	profile: null,
};

let app = {};

export class ProfileStore {
	constructor(store) {
		makeObservable(this);

		app.store = store;
	}

	@observable
	profile = null;

	@computed
	get current_profile() {
		return this.profile;
	}

	@computed
	get current_role() {
		return this.profile && this.profile.role;
	}

	@computed
	get current_roles() {
		return this.profile && this.profile.roles;
	}

	@computed
	get current_permissions() {
		return this.profile && this.profile.permissions;
	}

	@observable
	loading = {
		status: false,
		message: null,
	};

	@computed
	get is_loading() {
		return this.loading.status;
	}

	@action
	setLoading = (state, message) => {
		this.loading = {
			status: state || false,
			message,
		};
	};

	@observable
	busy = {
		status: false,
		message: null,
	};

	@computed
	get is_busy() {
		return this.busy.status;
	}

	@action
	setBusy = (state, message) => {
		this.busy = {
			status: state || false,
			message,
		};
	};

	@action
	setProfile = (object) => {
		return new Promise(async (resolve) => {
			let profile = object;
			const { permissions } = profile;

			if (permissions) {
				const len = permissions.length;
				let n = 0;
				let formatted = {};

				for (n; n < len; n++) {
					const item = permissions[n];
					formatted[item.toUpperCase()] = true;
				}

				profile.permissions = formatted;
			}

			await this.set(KEYS.PROFILE, profile, true);
			resolve();
		});
	};

	@action
	who_am_i = () => {
		this.setLoading(true);

		return app.store.api.profile
			.who_am_i()
			.then(async (response) => {
				await this.setProfile(response);

				this.setLoading(false);

				return response;
			})
			.catch((error) => {
				if (!axios.isCancel(error)) {
					app.store.toasters.add({
						variant: 'error',
						title: 'Failed to retreive your profile',
						description: AcFormatErrorMessage(error),
						code: AcFormatErrorCode(error),
					});
				}

				this.setLoading(false);

				if (!axios.isCancel(error)) throw error;
			});
	};

	@action
	update = (data) => {
		this.setBusy(true);

		return app.store.api.profile
			.update(data)
			.then((response) => {
				this.set(KEYS.PROFILE, response, true);

				app.store.toasters.add({
					variant: 'success',
					description: 'Profile details saved successfully.',
				});

				this.setBusy(false);
				return response;
			})
			.catch((error) => {
				this.setBusy(false);

				if (!axios.isCancel(error))
					app.store.toasters.add({
						variant: 'error',
						title: 'Failed to update your profile',
						description: AcFormatErrorMessage(error),
					});

				if (!axios.isCancel(error)) throw error;
			});
	};

	@action
	set = (target, value, save) => {
		if (!AcIsSet(target)) return;
		if (AcIsUndefined(this[target])) return;
		if (AcIsUndefined(value)) return;

		return new Promise((resolve) => {
			this[target] = value;
			if (save) AcSaveState(target, value);
			resolve();
		});
	};

	@action
	setState = (target, property, value, save) => {
		if (!AcIsSet(target)) return;
		if (AcIsUndefined(this[target])) return;
		if (!AcIsSet(property)) return;
		if (AcIsUndefined(value)) return;

		this[target][property] = value;
		if (save) AcSaveState(target, value);
	};

	@action
	reset = (target, save = true) => {
		if (!AcIsSet(target)) return;
		if (AcIsUndefined(this[target])) return;

		return new Promise((resolve) => {
			this[target] = _default[target];
			if (save && AcIsNull(_default[target])) {
				AcRemoveState(target);
			} else if (save) {
				AcSaveState(target, _default[target]);
			}

			resolve();
		});
	};
}

export default ProfileStore;
