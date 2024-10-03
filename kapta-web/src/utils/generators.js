export const generateRequestId = () => {
	return crypto.randomUUID().substring(0, 10);
};

export const generateShortcode = () => {
	// generate 6 character alphanumeric access code
	return crypto.randomUUID().replace(/-/g, "").substring(0, 6).toUpperCase();
};
