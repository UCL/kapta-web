import {
	SignUpCommand,
	CognitoIdentityProviderClient,
	InitiateAuthCommand,
	GlobalSignOutCommand,
	ConfirmSignUpCommand,
	ResendConfirmationCodeCommand,
	ChangePasswordCommand,
	RespondToAuthChallengeCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import { cognito } from "../globals";
import { ConstructionOutlined } from "@mui/icons-material";

const signUp = async (values) => {
	const client = new CognitoIdentityProviderClient(cognito);

	const command = new SignUpCommand({
		ClientId: cognito.userPoolClientId,
		Username: values.email,
		Password: values.password,
		UserAttributes: [
			{
				Name: "email",
				Value: values.email,
			},
			{
				Name: "given_name",
				Value: values.givenName,
			},
			{
				Name: "family_name",
				Value: values.familyName,
			},
			{
				Name: "phone_number",
				Value: values.phoneNumber,
			},
			{
				Name: "preferred_username",
				Value: values.preferredUsername,
			},
			{
				Name: "custom:organisation",
				Value: values.organisation,
			},
		].filter((attr) => attr.Value !== undefined && attr.Value !== null),
	});
	try {
		const response = await client.send(command);
		if (response.$metadata.httpStatusCode === 200) {
			return { response: true };
		}
	} catch (error) {
		console.error("signup Error:", error, error.name);
		if (error.name === "UsernameExistsException") {
			return { response: 4469 };
		} else throw error;
	}
};

const confirmSignUp = async (code, recipient) => {
	const client = new CognitoIdentityProviderClient(cognito);
	const command = new ConfirmSignUpCommand({
		ClientId: cognito.userPoolClientId,
		Username: recipient,
		ConfirmationCode: code,
	});

	try {
		const response = await client.send(command);
		return response;
	} catch (error) {
		console.error("Error confirming user", error);
		throw error;
	}
};

const initiateAuth = async (email, password) => {
	const client = new CognitoIdentityProviderClient(cognito);
	const command = new InitiateAuthCommand({
		AuthFlow: "USER_PASSWORD_AUTH",
		AuthParameters: {
			USERNAME: email,
			PASSWORD: password,
		},
		ClientId: cognito.userPoolClientId,
	});
	try {
		const response = await client.send(command);
		return { response: response };
	} catch (error) {
		console.error("InitiateAuth Error:", error, error.name);
		if (error.name === "UserNotFoundException") {
			return { response: 4359 };
		} else if (error.name === "UserNotConfirmedException") {
			return { response: 4399 };
		} else throw error;
	}
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

const resendVerificationCode = async (email) => {
	const client = new CognitoIdentityProviderClient(cognito);

	try {
		const command = new ResendConfirmationCodeCommand({
			ClientId: cognito.userPoolClientId,
			Username: email,
		});
		const response = await client.send(command);
	} catch (error) {
		console.error("Error resending verification code:", error);
	}
};

const changePassword = async (session, values) => {
	const client = new CognitoIdentityProviderClient(cognito);
	const command = new ChangePasswordCommand({
		PreviousPassword: values.oldPassword,
		ProposedPassword: values.password,
		AccessToken: session,
	});
	console.log("Change Password Command", command);
	try {
		const response = await client.send(command);
		return response;
	} catch (error) {
		console.error("Error changing password:", error);
		throw error;
	}
};

const respondToPasswordChangeChallenge = async (session, values) => {
	const client = new CognitoIdentityProviderClient(cognito);
	const command = new RespondToAuthChallengeCommand({
		ChallengeName: "NEW_PASSWORD_REQUIRED",
		ClientId: cognito.userPoolClientId,
		Session: session,
		ChallengeResponses: {
			NEW_PASSWORD: values.password,
			USERNAME: values.email,
		},
	});
	try {
		const response = await client.send(command);
		return { response: response };
	} catch (error) {
		console.error("Error responding to password change challenge:", error);
		throw error;
	}
};

export {
	signUp,
	changePassword,
	confirmSignUp,
	initiateAuth,
	initiateAuthRefresh,
	signOut,
	resendVerificationCode,
	respondToPasswordChangeChallenge,
};
