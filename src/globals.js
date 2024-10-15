// export vars used throughout the app
export const REQUEST_URL = import.meta.env.REQUEST_URL;
export const WEB_POOL_ID = import.meta.env.WEB_POOL_ID;
export const CLIENT_ID = import.meta.env.CLIENT_ID;
export const REGION = import.meta.env.REGION;

export let cognito = null;
export let hasCognito = false;
if (WEB_POOL_ID !== "null" && CLIENT_ID !== "null") {
	// checking for null string due to amplify store
	hasCognito = true;
	cognito = {
		userPoolId: WEB_POOL_ID,
		userPoolClientId: CLIENT_ID,
		region: REGION,
	};
}
