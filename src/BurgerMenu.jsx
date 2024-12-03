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
			content: `<h4>Legal Notice</h4>
			<p>
This website is operated by <strong>Wisdom of the Crowd Labs Ltd</strong>, a not-for-profit UCL spinout company registered in England and Wales.<br>
<strong>Registered Office:</strong> ExCiteS C/O WCL, Geography Department, University College London, Gower St, London, United Kingdom, WC1E 6BT<br>
<strong>Company Registration Number:</strong> 15934186<br>
<strong>Contact:</strong> info@kapta.earth<br>
All content on this website is protected by copyright and other applicable laws. Wisdom of the Crowd Labs Ltd accepts no liability for external links or third-party content.<br>
<strong>Governing Law:</strong> This website and its use are governed by the laws of England and Wales</p>`,
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
						<Typography>
							Contact us on{" "}
							<Button onClick={() => (window.location.href = WA_CHAT_URL)}>
								WhatsApp
							</Button>{" "}
							or email us at{" "}
							<Button
								onClick={() =>
									(window.location.href =
										"mailto:info@kapta.earth?subject=Kapta Web Feedback")
								}
							>
								info@kapta.earth
							</Button>
						</Typography>
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
					<Typography variant="caption" id="legal-notice" color="seondary-dark">
						Legal Notice
						<p>
							This website is operated by{" "}
							<strong>Wisdom of the Crowd Labs Ltd</strong>, a not-for-profit
							UCL spinout company registered in England and Wales.<br></br>
							<strong>Registered Office:</strong> ExCiteS C/O WCL, Geography
							Department, University College London, Gower St, London, United
							Kingdom, WC1E 6BT<br></br>
							<strong>Company Registration Number:</strong> 15934186<br></br>
							<strong>Contact:</strong> info@kapta.earth<br></br>
							All content on this website is protected by copyright and other
							applicable laws. Wisdom of the Crowd Labs Ltd accepts no liability
							for external links or third-party content.<br></br>
							<strong>Governing Law:</strong> This website and its use are
							governed by the laws of England and Wales
						</p>
					</Typography>
				</div>
			</Drawer>
		</>
	);
}
