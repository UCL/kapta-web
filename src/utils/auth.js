import {
	SignUpCommand,
	CognitoIdentityProviderClient,
	InitiateAuthCommand,
	GlobalSignOutCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import { cognito } from "../globals";

const validatePassword = (password) => {
	const lower = "abcdefghijklmnopqrstuvwxyz";
	const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const digits = "0123456789";
	const special = "!@#$%^&*()";

	if (password.length < 8) {
		// It's impossible to generate a passing password so break
		return "Please enter a password of at least 8 characters";
	}

	// Make sure password contains at least one character from each set
	const all = (arr, fn = Boolean) => arr.every(fn);
	const any = (arr, fn = Boolean) => arr.some(fn);
	let charSetPresence = [
		any(lower.split("").map((item) => password.includes(item))),
		any(upper.split("").map((item) => password.includes(item))),
		any(digits.split("").map((item) => password.includes(item))),
		any(special.split("").map((item) => password.includes(item))),
	];
	return all(charSetPresence);
};

const signUp = (email, password, displayName) => {
	const client = new CognitoIdentityProviderClient(cognito);

	const command = new SignUpCommand({
		ClientId: cognito.userPoolClientId,
		Username: email,
		Password: password,
		UserAttributes: [{ Name: "preferredUsername", Value: displayName }],
	});

	return client.send(command);
};

const initiateAuth = (email, password) => {
	console.log("initiating log in");
	const client = new CognitoIdentityProviderClient(cognito);
	const command = new InitiateAuthCommand({
		AuthFlow: "USER_SRP_AUTH",
		AuthParameters: {
			USERNAME: email,
			PASSWORD: password,
		},
		ClientId: cognito.userPoolClientId,
	});
	return client.send(command);
};

const initiateAuthRefresh = (refreshToken) => {
	const client = new CognitoIdentityProviderClient(cognito);
	const input = {
		AuthFlow: "REFRESH_TOKEN_AUTH",
		ClientId: cognito.userPoolClientId,
		AuthParameters: {
			REFRESH_TOKEN: refreshToken,
		},
	};
	const command = new InitiateAuthCommand(input);
	return client.send(command);
};

const signOut = (access_token) => {
	const client = new CognitoIdentityProviderClient(cognito);
	const command = new GlobalSignOutCommand({
		AccessToken: access_token,
	});
	return client.send(command);
};

export { signUp, validatePassword, initiateAuth, initiateAuthRefresh, signOut };
