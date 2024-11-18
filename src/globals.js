import { useContext } from "react";
import { UserContext } from "./utils/UserContext";

// export vars used throughout the app
export const REQUEST_URL = import.meta.env.VITE_REQUEST_URL;
export const WEB_POOL_ID = import.meta.env.VITE_WEB_POOL_ID;
export const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
export const REGION = import.meta.env.VITE_REGION;
export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
export const WA_CHAT_URL = import.meta.env.VITE_WA_CHAT_URL;

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

export const useUserStore = () => {
	return useContext(UserContext);
};
