export const AcUUID = prefix => {
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let text = '';

	for (let i = 0; i < 12; i++) {
		text += characters.charAt(Math.floor(Math.random() * characters.length));
	}

	if (prefix) text = prefix + '-' + text;

	return text;
};

export default AcUUID;
