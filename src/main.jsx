import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { UserProvider } from "./utils/UserContext.jsx";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { cyan, red, purple, teal } from "@mui/material/colors";

const theme = createTheme({
	palette: {
		mode: "dark",
		primary: teal,
		secondary: purple,
		info: cyan,
		error: red,
		warning: {
			main: "#E3D026",
			light: "#E9DB5D",
			dark: "#A29415",
			contrastText: "#242105",
		},
		white: {
			main: "#f5f5f5",
			contrastText: "#242105",
		},
	},
});

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<UserProvider>
			{" "}
			<ThemeProvider theme={theme}>
				<App />{" "}
			</ThemeProvider>
		</UserProvider>
	</StrictMode>
);
