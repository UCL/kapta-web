import { useState, useCallback, createContext, useEffect } from "react";
import { initiateAuthRefresh, signOut } from "./auth";

// Create the User Context
export const UserContext = createContext();

// Custom hook to use user context is exported from globals

export const UserProvider = ({ children }) => {
	const [idToken, setIdToken] = useState(null);
	const [accessToken, setAccessToken] = useState(null);
	const [refreshToken, setRefreshToken] = useState(null);
	const [displayName, setDisplayName] = useState(null);
	const [email, setEmail] = useState(null);
	const [userId, setUserId] = useState(null);
	const [loggedIn, setLoggedIn] = useState(false);
	const [organisation, setOrganisation] = useState(null);

	const setUserDetails = useCallback((userDetails) => {
		// for some reason these differ from time to time
		const idToken = userDetails.idToken || userDetails.IdToken;
		const accessToken = userDetails.accessToken || userDetails.AccessToken;
		const refreshToken = userDetails.refreshToken || userDetails.RefreshToken;

		const base64Payload = idToken.split(".")[1];
		const decodedIdTokenPayload = JSON.parse(atob(base64Payload));

		const dName = decodedIdTokenPayload["preferred_username"];
		setDisplayName(dName);
		const sub = decodedIdTokenPayload["sub"];
		setEmail(decodedIdTokenPayload["email"]);
		const org = decodedIdTokenPayload["custom:organisation"];
		if (org !== undefined || org !== null || org !== "null") {
			setOrganisation(org);
		}

		setUserId(sub);

		setAccessToken(accessToken);
		setIdToken(idToken);
		setRefreshToken(refreshToken);
		setLoggedIn(true);
		setLocalStorage(idToken, accessToken, refreshToken); // the states won't have been updated in time, so use the original prop, same for the return (specific to the login flow)
		return { dName, sub };
	}, []);

	function isTokenValid(token) {
		const base64Payload = token.split(".")[1];
		const decodedToken = JSON.parse(atob(base64Payload));
		const expirationTime = decodedToken.exp;
		const currentTime = Math.floor(Date.now() / 1000);

		return expirationTime > currentTime;
	}

	const getLocalStorageTokens = useCallback(() => {
		return {
			idToken: localStorage.getItem("KW-idToken"),
			accessToken: localStorage.getItem("KW-accessToken"),
			refreshToken: localStorage.getItem("KW-refreshToken"),
		};
	}, []);

	// Function to refresh tokens
	const refresh = useCallback(
		async (refreshToken) => {
			// this might be getting called on app launch
			if (refreshToken !== null && refreshToken !== "null") {
				const response = await initiateAuthRefresh(refreshToken);
				const authResult = response.AuthenticationResult;
				setUserDetails({
					accessToken: authResult.AccessToken,
					idToken: authResult.IdToken,
					refreshToken: authResult.RefreshToken,
				});
			}
		},
		[setUserDetails]
	);

	// Check for user tokens from localStorage and update user info
	const checkForDetails = useCallback(async () => {
		let userDetails = getLocalStorageTokens();
		// check each of the tokens is there and not "null"

		const userDetailsNotNull =
			userDetails.idToken !== "null" &&
			userDetails.idToken !== undefined &&
			userDetails.idToken !== null &&
			userDetails.accessToken !== "null" &&
			userDetails.accessToken !== undefined &&
			userDetails.accessToken !== null;

		if (userDetailsNotNull) {
			const isValid = await isTokenValid(userDetails.idToken);
			if (!isValid) {
				if (userDetails.refreshToken && userDetails.refreshToken !== "null") {
					await refresh(userDetails.refreshToken);
					try {
						userDetails = getLocalStorageTokens();
						await isTokenValid();
						setUserDetails(userDetails);
					} catch (error) {
						console.error("Error refreshing tokens", error);
					}
				}
			} else {
				setUserDetails(userDetails);
				return true;
			}
		} else return false; // user will have to log in again
	}, [setUserDetails, getLocalStorageTokens, refresh]);

	useEffect(() => {
		checkForDetails();
	}); // check for details when component mounts ie app starts

	// update localStorage values
	const setLocalStorage = (idToken, accessToken, refreshToken) => {
		localStorage.setItem("KW-idToken", idToken || "null"); // Save as "null" if null
		localStorage.setItem("KW-accessToken", accessToken || "null");
		localStorage.setItem("KW-refreshToken", refreshToken || "null");
	};

	// Function to log out
	const logout = useCallback(() => {
		if (accessToken) {
			signOut(accessToken).then(
				(response) => {
					console.info("Successfully signed out", response);
				},
				(error) => {
					console.error("Error signing out", error);
				}
			);
		}
		// Clear localStorage and state
		localStorage.removeItem("KW-accessToken");
		localStorage.removeItem("KW-idToken");
		localStorage.removeItem("KW-refreshToken");
		setIdToken(null);
		setAccessToken(null);
		setRefreshToken(null);
		setLoggedIn(false);
	}, [accessToken]);

	return (
		<UserContext.Provider
			value={{
				idToken,
				accessToken,
				refreshToken,
				displayName,
				email,
				userId,
				loggedIn,
				refresh,
				logout,
				setUserDetails,
				checkForDetails,
				organisation,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};
