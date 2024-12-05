export function isMobileDevice() {
	const userAgent = navigator.userAgent || navigator.vendor || window.opera;

	// Check for iPad separately since it might not be detected as mobile
	if (/iPad/.test(userAgent) && !window.MSStream) {
		return false; // Treat iPads as non-mobile devices
	}

	// Check for other mobile devices
	return /android|iPhone|iPod|avantgo|blackberry|bada|bb|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile|netfront|nokia|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up(\.browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
		userAgent.toLowerCase()
	);
}

export const slugify = (str) => {
	str = str.replace(/^\s+|\s+$/g, ""); // trim leading/trailing white space
	str = str.toLowerCase();
	str = str
		.replace(/[^a-z0-9 -]/g, "") // remove any non-alphanumeric characters
		.replace(/\s+/g, "-") // replace spaces with hyphens
		.replace(/-+/g, "-"); // remove consecutive hyphens
	return str;
};

export function checkPasswordStrength(password) {
	const checks = {
		minLength: password.length >= 8,
		hasLowercase: /[a-z]/.test(password),
		hasUppercase: /[A-Z]/.test(password),
		hasDigit: /\d/.test(password),
		hasSymbol: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
	};

	return checks;
}