import { REQUEST_URL } from "../globals";

export const getMetadata = async (id) => {
	// TODO: get metadata from dynamodb for task id, maybe combine into other function

	try {
		const response = await fetch(`${REQUEST_URL}/requests/${id}`);
		const result = await response.json();
		const metadata = JSON.parse(result);
		console.log(metadata);

		return metadata;
	} catch (error) {
		console.error("Error fetching tasks:", error);
	}
};
export const fetchMyTasks = async ({ user, setIsLoading }) => {
	try {
		const response = await fetch(
			`${REQUEST_URL}/requests/createdby/${user.userId}`,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: user.idToken,
				},
			}
		);
		const result = await response.json();
		console.log("result", result);
		const fetchedTasks = JSON.parse(result);
		return fetchedTasks;
	} catch (error) {
		console.error("Error fetching tasks:", error);
	} finally {
		setIsLoading(false);
	}
};

export const fetchMyODTasks = async ({ user }) => {
	console.log(`${REQUEST_URL}/requests/opendata/createdby/${user.userId}`);
	try {
		const response = await fetch(
			`${REQUEST_URL}/requests/opendata/createdby/${user.userId}`,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: user.idToken,
				},
			}
		);
		const result = await response.json();
		console.log("result", result);
		const fetchedTasks = JSON.parse(result);
		return fetchedTasks;
	} catch (error) {
		console.error("Error fetching tasks:", error);
	}
};

export const fetchODTasks = async ({ user, setIsLoading }) => {
	try {
		const response = await fetch(`${REQUEST_URL}/requests/opendata`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: user.idToken,
			},
		});
		const result = await response.json();
		console.log("result", result);
		const fetchedTasks = JSON.parse(result);
		return fetchedTasks;
	} catch (error) {
		console.error("Error fetching tasks:", error);
	} finally {
		setIsLoading(false);
	}
};
