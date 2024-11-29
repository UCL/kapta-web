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
