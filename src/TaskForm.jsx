import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Checkbox, TextField } from "@mui/material";
import { REQUEST_URL } from "./globals";
import { generateTaskId, generateCampaignCode } from "./utils/generators";
import { useState } from "react";
import SuccessModal from "./SuccessModal";
import "./styles/forms.css";
// import * as Yup from "yup";

// these will be dynamically taken from their login and generated
const userID = "12345";
const taskID = generateTaskId();
const campaignCode = generateCampaignCode();

// const validationSchema = Yup.object({
// 	organisation: Yup.string().required("Organisation is required"), // in future maybe we turn this into a dropdown with "add new?" and generate a uuid
// 	logo: Yup.mixed(),
// 	private: Yup.boolean(),
// 	visible: Yup.boolean(),
// title: Yup.string().required("Title is required"),
// 	description: Yup.string().required("Description is required"),
// });
const initialValues = {
	createdBy: userID, // hidden field populated dynamically
	organisation: "",
	logo: null,
	private: false,
	visible: false,
	title: "",
	description: "",
};

export default function TaskForm({ isVisible }) {
	const [successModalVisible, setSuccessModalVisible] = useState(false);

	if (!isVisible) return null;

	var taskTitle;
	var taskDescription;
	// formik has built in props regarding submission so we don't need to define them ourselves
	const handleSubmit = async (values) => {
		// will need to convert image to base 64
		// const imageBuffer = fs.readFileSync(imagePath);
		// const base64Image = imageBuffer.toString('base64');

		values = { ...values, taskID: taskID, campaignCode: campaignCode };
		console.log("Form data:", values);

		try {
			const response = await fetch(`${REQUEST_URL}/requests`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			});

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const result = await response.json();
			console.log("Success:", result);
			taskTitle = values.title;
			taskDescription = values.description;
			setSuccessModalVisible(true);
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<>
			{successModalVisible && (
				<SuccessModal
					taskTitle={taskTitle}
					taskDescription={taskDescription}
					taskID={taskID}
					campaignCode={campaignCode}
					setSuccessModalVisible={setSuccessModalVisible}
				/>
			)}

			<Formik
				initialValues={initialValues}
				// validation schema currently not valid
				onSubmit={handleSubmit}
			>
				{({ isSubmitting, setFieldValue }) => (
					<Form className="form task-request-form">
						<h2>Please tell us about your task request</h2>
						{/* Hidden field for Created By */}
						<Field type="hidden" name="createdBy" />
						<div>
							{/* Organisation */}
							<Field
								type="text"
								name="organisation"
								label="Organisation"
								as={TextField}
							/>
							<ErrorMessage
								name="organisation"
								component="div"
								className="error"
							/>

							{/* Logo */}

							<label>
								Logo <em>(optional)</em>:
							</label>
							<input
								type="file"
								name="logo"
								onChange={(event) => {
									setFieldValue("logo", event.currentTarget.files[0]);
								}}
							/>
						</div>

						{/* Private to Org */}
						<div>
							<label>
								<Field type="checkbox" name="private" as={Checkbox} />
								Is the data private? (Only members of the organisation can
								access)
							</label>
						</div>

						{/* Visible on Kapta Web */}
						<div>
							<label>
								<Field type="checkbox" name="visible" as={Checkbox} />
								Does the request appear on Kapta Web searches?
							</label>
						</div>
						{/* Title */}
						<Field name="title" as={TextField} label="Title" fullWidth />
						<ErrorMessage name="title" component="div" className="error" />

						{/* Description */}
						<Field
							name="description"
							as={TextField}
							label="Description"
							fullWidth
						/>
						<ErrorMessage
							name="description"
							component="div"
							className="error"
						/>

						{/* Submit Button */}
						<Button
							type="submit"
							disabled={isSubmitting}
							color="success"
							variant="contained"
						>
							Submit Request
						</Button>
					</Form>
				)}
			</Formik>
		</>
	);
}
