import { Formik, Form, Field, ErrorMessage } from "formik";
import {
	Button,
	Checkbox,
	InputLabel,
	NativeSelect,
	TextField,
} from "@mui/material";
import { INVOKE_URL } from "./App";
// import * as Yup from "yup";

// these will be dynamically taken from their login and generated
const userID = "12345";
const requestID = "77783";

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
	organisation: "amanda",
	logo: null,
	private: true, // default true
	visible: true, // default true
	areaOfInterest: "aoi", // saving me time with testing...
	attributes: "testing,api,flow",
	description: "attempting to upload to dynamodb",
	status: "pending", // default status
};

export const RequestForm = () => {
	// formik has built in props regarding submission so we don't need to define them ourselves
	const handleSubmit = async (values) => {
		values = { ...values, requestID: requestID };
		console.log("Form data:", values);
		try {
			const response = await fetch(`${INVOKE_URL}items`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			});

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const data = await response.json();
			console.log("Success:", data);
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<Formik
			initialValues={initialValues}
			// validation schema currently not valid
			onSubmit={handleSubmit}
		>
			{({ isSubmitting, setFieldValue }) => (
				<Form>
					{/* Hidden field for Created By */}
					<Field type="hidden" name="createdBy" />

					{/* Organisation */}
					<Field
						type="text"
						name="organisation"
						label="Organisation"
						component={TextField}
					/>
					<ErrorMessage name="organisation" component="div" className="error" />

					{/* Logo */}
					<div>
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
							<Field type="checkbox" name="private" component={Checkbox} />
							Is the data private? (Only members of the organisation can access)
						</label>
					</div>

					{/* Visible on Kapta Web */}
					<div>
						<label>
							<Field
								type="checkbox"
								name="visible"
								component={Checkbox}
								label=""
							/>
							Does the request appear on Kapta Web searches?
						</label>
					</div>

					{/* Area of Interest */}
					<Field
						name="areaOfInterest"
						component={TextField}
						fullWidth
						label="Area of Interest"
						placeholder="This should be a list of polygons relevant to the area"
					/>
					<ErrorMessage
						name="areaOfInterest"
						component="div"
						className="error"
					/>

					{/* Attributes */}
					<Field
						name="attributes"
						component={TextField}
						label="Attributes (JSON)"
						fullWidth
					/>
					<ErrorMessage name="attributes" component="div" className="error" />

					{/* Description */}
					<Field
						name="description"
						component={TextField}
						label="Description (JSON)"
						fullWidth
					/>
					<ErrorMessage name="description" component="div" className="error" />

					{/* Status */}
					<InputLabel>
						Status
						<Field
							name="status"
							component={NativeSelect}
							type="select"
							style={{ paddingLeft: 20 }}
						>
							<option value="pending">Pending</option>
							<option value="published">Published</option>
							<option value="closed">Closed</option>
						</Field>
					</InputLabel>

					<ErrorMessage name="status" component="div" className="error" />

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
	);
};
