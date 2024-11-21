import { Formik, Form, Field, ErrorMessage } from "formik";
import { Box, Button, Checkbox, TextField } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { generateTaskId, generateCampaignCode } from "./utils/generators";
import "./styles/forms.css";
import { CloseButton } from "./utils/Buttons";
import { createTask, updateTask } from "./utils/apiQueries";
// import * as Yup from "yup";

// these will be dynamically taken from their login and generated
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

export default function TaskForm({
	isVisible,
	setIsVisible,
	taskValues,
	user,
	showTaskSuccessModal,
}) {
	var initialValues = {
		createdBy: user.userId,
		organisation: user.organisation || "",
		logo: null,
		private: false,
		visible: false,
		title: "",
		description: "",
	};
	if (taskValues) {
		// for editing
		initialValues = {
			createdBy: taskValues.created_by,
			organisation: taskValues.organisation,
			logo: taskValues.logo,
			private: taskValues.private,
			visible: taskValues.visible,
			title: taskValues.task_title,
			description: taskValues.task_description,
			campaignCode: taskValues.campaign_code,
			taskID: taskValues.task_id,
		};
	}

	if (!isVisible) return null;

	const showSuccess = (msg) => {
		showTaskSuccessModal(msg);
		setIsVisible(false);
	};
	// formik has built in props regarding submission so we don't need to define them ourselves
	const handleSubmit = async (values) => {
		// will need to convert image to base 64
		// const imageBuffer = fs.readFileSync(imagePath);
		// const base64Image = imageBuffer.toString('base64');

		values = { ...values, taskID: taskID, campaignCode: campaignCode };
		try {
			const response = await createTask({ user, values });
			if (response) {
				let msg = {
					title: values.title,
					description: values.description,
					taskID: values.taskID,
					campaignCode: values.campaignCode,
				};
				showSuccess(msg);
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const handleEdit = async (values) => {
		try {
			const response = await updateTask({ user, values });
			if (response) {
				let msg = {
					title: values.title,
					description: values.description,
					taskID: values.taskID,
					campaignCode: values.campaignCode,
				};
				showSuccess(msg);
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<>
			<Formik
				initialValues={initialValues}
				// validation schema currently not valid
				onSubmit={taskValues ? handleEdit : handleSubmit}
			>
				{({ isSubmitting, setFieldValue }) => (
					<Form className="form task-request-form">
						<CloseButton setIsVisible={setIsVisible} />
						<h2 color="info">Tell us about your task</h2>
						<div className="form__body">
							{/* Hidden field for Created By */}
							<Field type="hidden" name="createdBy" />
							<Box display="flex" alignItems="stretch" justifyContent="center">
								{/* Organisation */}
								<Field
									type="text"
									name="organisation"
									label="Organisation name"
									as={TextField}
									size="small"
								/>
								<ErrorMessage
									name="organisation"
									component="div"
									className="error"
								/>

								{/* Logo */}

								<Button
									variant="contained"
									tabIndex={-1}
									startIcon={<CloudUploadIcon />}
									className="logo-btn"
								>
									Logo
									<input
										hidden
										type="file"
										name="logo"
										onChange={(event) => {
											setFieldValue("logo", event.currentTarget.files[0]);
										}}
									/>
								</Button>
							</Box>

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
							<Field
								name="title"
								as={TextField}
								label="Title"
								required
								fullWidth
							/>
							<ErrorMessage name="title" component="div" className="error" />

							{/* Description */}
							<Field
								name="description"
								as={TextField}
								label="Description"
								fullWidth
								required
							/>
							<ErrorMessage
								name="description"
								component="div"
								className="error"
							/>

							{/* Campaign Code when editing */}
							{taskValues && (
								<p>Your campaign code: {initialValues.campaignCode}</p>
							)}

							{/* Submit Button */}
							<Button
								type="submit"
								disabled={isSubmitting}
								color="success"
								variant="contained"
								className="btn--submit"
							>
								{taskValues ? "Edit Task" : "Submit Request"}
							</Button>
						</div>
					</Form>
				)}
			</Formik>
		</>
	);
}
