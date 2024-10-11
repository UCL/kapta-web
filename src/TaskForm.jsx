import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Checkbox, TextField } from "@mui/material";
import { REQUEST_URL } from "./App";
import { generateTaskId, generateCampaignCode } from "./utils/generators";
import { useState } from "react";
import SuccessModal from "./SuccessModal";
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
// 	areaOfInterest: Yup.string().required("Area of interest is required"), // is this just a list? Wasn't there talk about using the UN system of classification?
// 	attributes: Yup.string().required("Attributes are required"), // do we want to check these two are specifically JSON format?
// 	description: Yup.string().required("Description is required"),
// 	status: Yup.string()
// 		.oneOf(["pending", "published", "closed"], "Invalid status")
// 		.required("Status is required"), // do they actually choose this?
// });
const initialValues = {
	createdBy: userID, // hidden field populated dynamically
	organisation: "",
	logo: null,
	private: true, // default true
	visible: true, // default true
	title: "",
	description: "",
};

export default function TaskForm() {
	const [successModalVisible, setSuccessModalVisible] = useState(false);
	let taskTitle;
	let taskDescription;
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
					title={taskTitle}
					description={taskDescription}
					taskID={taskID}
					campaignCode={campaignCode}
					setSuccessModalVisible={setSuccessModalVisible}
				/>
			)}
			<h2>Please tell us about your request</h2>
			<Formik
				initialValues={initialValues}
				// validation schema currently not valid
				onSubmit={handleSubmit}
			>
				{({ isSubmitting, setFieldValue }) => (
					<Form className="task-request-form">
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
