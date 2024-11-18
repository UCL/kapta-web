import { useContext } from "react";
import { UserContext } from "./utils/UserContext";

// export vars used throughout the app
export const REQUEST_URL = import.meta.env.VITE_REQUEST_URL;
export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
export const WA_CHAT_URL = import.meta.env.VITE_WA_CHAT_URL;

export const useUserStore = () => {
	return useContext(UserContext);
};
