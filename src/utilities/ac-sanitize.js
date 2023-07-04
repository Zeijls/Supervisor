export const AcSanitize = (input) => {
	let result = `${input}`.replace(/[^a-z0-9áéíóúñü@?!#%$:\/ \.,_-]/gim, '');
	return result.trim();
};

export default AcSanitize;
