import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";
import PeopleIcon from "@mui/icons-material/People";
import HelpIcon from "@mui/icons-material/Help";
import NextPlanIcon from "@mui/icons-material/NextPlan";
import LogoutIcon from "@mui/icons-material/Logout";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import {
	Drawer,
	List,
	ListItemIcon,
	IconButton,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Typography,
	Button,
} from "@mui/material";
import parse from "html-react-parser";
import { CloseButton } from "./utils/Buttons";
import "./styles/burger-menu.css";
import { useUserStore, WA_CHAT_URL } from "./globals";

export default function BurgerMenu({ isOpen, setIsOpen }) {
	const [expandedPanel, setExpandedPanel] = useState(false);

	const toggleDrawer = (open) => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}
		setIsOpen(open);
	};
	const user = useUserStore();
	const handleLogout = () => {
		user.logout();
		toggleDrawer(false);
	};
	const viewProfile = () => {
		console.log("todo: view profile");
	};
	const viewSettings = () => {
		console.log("todo: view settings");
	};
	const navItems = [
		{ text: "Logout", icon: <LogoutIcon />, function: handleLogout },
		// { text: "Profile", icon: <PersonIcon />, function: viewProfile },
		// { text: "Settings", icon: <SettingsIcon />, function: viewSettings },
	];

	const urls = {
		whatsappMapsUrl:
			"https://uclexcites.blog/2024/06/26/whatsapp-maps-connecting-users-and-producers-of-ground-information/",
		whatsappMapsUrlSpanish:
			"https://uclexcites-blog.translate.goog/2024/06/26/whatsapp-maps-connecting-users-and-producers-of-ground-information/?_x_tr_sl=auto&_x_tr_tl=es&_x_tr_hl=en-US&_x_tr_pto=wapp",
		extremeCitizenUrl: "https://www.youtube.com/watch?v=IgQc7GQ1m_Y",
		marcosUrl:
			"https://www.ucl.ac.uk/geography/people/research-staff/marcos-moreu",
		fabienUrl: "https://www.ucl.ac.uk/geography/fabien-moustard",
		tomUrl:
			"https://www.ucl.ac.uk/advanced-research-computing/people/tom-couch",
		mukiUrl: "https://www.ucl.ac.uk/geography/muki-haklay-facss",
		jonathanUrl:
			"https://www.ucl.ac.uk/advanced-research-computing/people/jonathan-cooper",
		claireUrl:
			"https://www.ucl.ac.uk/civil-environmental-geomatic-engineering/people/dr-claire-ellul",
		amandaUrl:
			"https://www.ucl.ac.uk/advanced-research-computing/people/amanda-ho-lyn",
		jedUrl: "https://www.durham.ac.uk/staff/jed-stevenson/",
		desUrl: "https://et.linkedin.com/in/dessalegn-tekle-02b848ba",
	};

	const menuSections = [
		{
			title: "About",
			icon: <InfoIcon />,
			subtitle: "Kapta Mobile is a Progressive Web App to create WhatsApp Maps",
			content: "",
		},
		{
			title: "People",
			icon: <PeopleIcon />,
			subtitle:
				"Kapta is being developed by the University College London (UCL) Extreme Citizen Science (ExCiteS) research group and the Advanced Research Computing Centre (UCL ARC).",
			content: `Currently the core Kapta team consists of:<br><ul className="bm__people-list"><li><a href='${urls.marcosUrl}'>Marcos Moreu, UCL Geography</a></li><li><a href='${urls.fabienUrl}'>Fabien Moustard, UCL Geography</a></li><li><a href='${urls.tomUrl}'>Tom Couch, UCL ARC</a></li><li><a href='${urls.mukiUrl}'>Muki Haklay, UCL Geography</a></li><li><a href='${urls.jonathanUrl}'>Jonathan Cooper, UCL ARC</a></li><li><a href='${urls.claireUrl}'>Claire Ellul, UCL CEGE</a></li><li><a href='${urls.amandaUrl}'>Amanda Ho-Lyn, UCL ARC</a></li><li><a href='${urls.jedUrl}'>Jed Stevenson, Durham University</a></li><li><a href='${urls.desUrl}'>Dessalegn Teckle, Addis Ababa University, NGO IPC</a></li></ul>`,
		},
		{
			title: "Why Kapta?",
			icon: <HelpIcon />,
			subtitle:
				"To popularise mapping and connect users and producers of ground information.",
			content: `See our latest blog and where this started in 2010:<br><li><a href='${urls.whatsappMapsUrl}'>WhatsApp Maps? Connecting users and producers of ground information</a></li><br><li><a href='${urls.extremeCitizenUrl}'>Extreme Citizen Science in the Congo rainforest</a></li>`,
		},
		{
			title: "What's Next?",
			icon: <NextPlanIcon />,
			subtitle:
				"Kapta:A (de)centralised crowdsourcing system to connect users and producers of ground information.",
			content: "",
		},
		{
			title: "Disclaimer",
			icon: <CampaignOutlinedIcon />,
			subtitle:
				"The Kapta team has made every effort to develop an app that parse WhatsApp chats to create WhatsApp Maps with the highest possible accuracy. However, we cannot accept responsibility for any errors, omissions, or inconsistencies that may occur.",
			content: ` Please always make your own judgement about the accuracy of the maps and validate the information using other sources. If you encounter any issues or have feedback, please reach out to us at <a href="mailto:geog.excites@ucl.ac.uk?subject=Kapta Mobile Feedback">geog.excites@ucl.ac.uk</a> or via WhatsApp at <a href=${WA_CHAT_URL}>+34 678380944.</a>`,
		},
	];
	const handleAccordionChange = (panel) => (event, isExpanded) => {
		setExpandedPanel(isExpanded ? panel : false);
	};
	return (
		<>
			<IconButton
				onClick={toggleDrawer(true)}
				edge="start"
				color="secondary"
				aria-label="open menu"
				className="btn--burger-menu"
			>
				<MenuIcon />
			</IconButton>
			<Drawer
				anchor="left"
				open={isOpen}
				onClose={toggleDrawer(false)}
				className="bm__drawer"
			>
				<CloseButton setIsVisible={setIsOpen} />
				<div className="bm__content">
					<List>
						{menuSections.map((section, index) => (
							<Accordion
								key={section.title}
								expanded={expandedPanel === `panel${index}`}
								onChange={handleAccordionChange(`panel${index}`)}
							>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls={`panel${index}a-content`}
									id={`panel${index}a-header`}
								>
									<ListItemIcon>{section.icon}</ListItemIcon>
									<Typography variant="h6">{section.title}</Typography>
								</AccordionSummary>
								<Typography
									variant="subtitle1"
									className="bm__content__subtitle"
								>
									{section.subtitle}
								</Typography>
								<AccordionDetails>{parse(section.content)}</AccordionDetails>
							</Accordion>
						))}
					</List>
					<div className="bm__footer">
						<Typography>Have feedback or want to get in touch?</Typography>
						<Button onClick={() => (window.location.href = WA_CHAT_URL)}>
							Contact Us
						</Button>
					</div>
					{user.loggedIn && (
						<Button
							onClick={handleLogout}
							endIcon={<LogoutIcon />}
							className="btn--logout"
						>
							Logout
						</Button>
					)}
				</div>
			</Drawer>
		</>
	);
}
