import { REQUEST_URL } from "../globals";

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

export const fetchODTasks = async ({ user }) => {
	try {
		const response = await fetch(`${REQUEST_URL}/requests/opendata`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: user.idToken,
			},
		});
		const result = await response.json();
		if (result.length > 0) {
			const fetchedTasks = JSON.parse(result);
			return fetchedTasks;
		}
	} catch (error) {
		console.error("Error fetching tasks:", error);
	}
};

export const createTask = async ({ user, values }) => {
	try {
		const response = await fetch(`${REQUEST_URL}/requests`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: user.idToken,
			},

			body: JSON.stringify(values),
		});

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const result = await response.json();
		return result;
	} catch (error) {
		console.error("Error:", error);
	}
};

export const updateTask = async ({ user, values }) => {
	try {
		const response = await fetch(`${REQUEST_URL}/requests/${values.taskID}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: user.idToken,
			},

			body: JSON.stringify(values),
		});

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const result = await response.json();
		return result;
	} catch (error) {
		console.error("Error:", error);
	}
};
