import { REQUEST_URL } from "../globals";

export const fetchMyTasks = async ({ user }) => {
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
	}
};

export const fetchMyODTasks = async ({ user }) => {
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
export const fetchAllVisibleTasks = async ({ user }) => {
	try {
		const response = await fetch(`${REQUEST_URL}/requests/visible`, {
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

export const getDataFromBucket = async ({ user, task }) => {
	let taskId = task.task_id;
	const userID = user.idToken;
	try {
		const response = await fetch(`${REQUEST_URL}/requests/download/${taskId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: userID,
			},
		});

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const result = await response.json();
		const data = JSON.parse(result);
		if (data.taskID === taskId) {
			return { response: 200, content: data };
		} else {
			console.error("task details do not match");
			return { response: 409 };
		}
	} catch (error) {
		console.error("Error:", error);
	}
};
