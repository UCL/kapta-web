import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { UserProvider } from "./utils/UserContext.jsx";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
	pink,
	red,
	amber,
	orange,
	deepOrange,
	grey,
} from "@mui/material/colors";
import { isMobileDevice } from "./utils/generalUtils.js";
import TempMobileApp from "./TempMobileApp.jsx";

const theme = createTheme({
	palette: {
		mode: "dark",
		primary: deepOrange,
		secondary: amber,
		info: pink,
		error: red,
		warning: {
			main: "#E3D026",
			light: "#E9DB5D",
			dark: "#A29415",
			contrastText: "#16161d",
		},
		white: {
			main: "#f5f5f5",
			contrastText: "#16161d",
		},
		orange: { main: orange[800] },
		tomato: {
			main: "#ff6347",
			light: "#ffa592",
			dark: "#e63621",
			contrastText: "#16161d",
		},
		muted: { main: grey[500] },
	},
	cssVariables: true,
});
const isMobile = isMobileDevice();
console.log("isMobile", isMobile);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<UserProvider>
			{" "}
			<ThemeProvider theme={theme}>
				{isMobile ? <TempMobileApp /> : <App />}{" "}
			</ThemeProvider>
		</UserProvider>
	</StrictMode>
);
