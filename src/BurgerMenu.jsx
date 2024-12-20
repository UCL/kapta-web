import React, { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import InfoIcon from "@mui/icons-material/Info";
import GroupsIcon from "@mui/icons-material/Groups";
import LogoutIcon from "@mui/icons-material/Logout";
import GitHubIcon from "@mui/icons-material/GitHub";
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
import { GITHUB_URL, useUserStore, WA_CHAT_URL } from "./globals";
import { KaptaSVGIconWhite } from "./utils/icons";

export default function BurgerMenu({
	isOpen,
	setIsOpen,
	setNoticeVisible,
	setPosterVisible,
}) {
	const [expandedPanel, setExpandedPanel] = useState(false);
	const [expandedSubPanel, setExpandedSubPanel] = useState(false);
	const user = useUserStore();

	const handlePosterClick = () => {
		setPosterVisible(true);
		setIsOpen(false);
	};
	const mailto = "mailto:info@kapta.earth?subject=Kapta Web Feedback";
	useEffect(() => {
		const observer = new MutationObserver((mutationsList, observer) => {
			for (let mutation of mutationsList) {
				if (mutation.type === "childList") {
					const imgElement = document.querySelector(
						'img[alt="Is this the first-ever WhatsApp Map?"]'
					);
					if (imgElement) {
						imgElement.addEventListener("click", handlePosterClick);
						observer.disconnect(); // Stop observing once the element is found and event listener is attached
					}
				}
			}
		});

		observer.observe(document.body, { childList: true, subtree: true });

		return () => {
			observer.disconnect(); // Cleanup observer on component unmount
		};
	}, [isOpen]);

	const toggleDrawer = (open) => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}
		setIsOpen(open);
	};

	const handleLogout = () => {
		user.logout();
		toggleDrawer(false)({ type: null });
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
		satoUrl: "https://www.linkedin.com/in/satoki-kawabata/",
		gabrielUrl: "",
		jeromeUrl:
			"https://www.ucl.ac.uk/anthropology/people/academic-and-teaching-staff/jerome-lewis",
	};
	const menuSections = [
		{
			title: "Kapta",
			icon: <KaptaSVGIconWhite />,
			subtitle:
				"Kapta is a platform that brings people together to create and share WhatsApp Maps",
			content: "",
		},
		{
			title: "Work with us",
			icon: <GroupsIcon />,
			subtitle:
				"We are open to building partnerships. Let's explore how Kapta can support your work.",
			content: `Contact us at <a href="${mailto}">
				info@kapta.earth</a>`,
		},
		{
			title: "Discover",
			icon: <TravelExploreIcon />,
			subtitle: "",
			hasSubTabs: true,
			subTabs: [
				{
					title: "Case Studies",
					content: `<div><h4>Is this the first-ever WhatsApp Map?</h4><img src="/Poster_cs_1.svg" alt="Is this the first-ever WhatsApp Map?" onClick="${handlePosterClick}" style="cursor: pointer;" />
					<p>The traditional method of assessing water infrastructure relies on field surveyors, a process that is often slow and costly. This can pose challenges for timely decision-making, especially in regions facing drought and hunger. In May 2024, pastoralists from various villages were engaged in the data collection process. Organised into WhatsApp groups and using Kapta, they facilitated faster and more efficient assessments by creating WhatsApp Maps on water infrastructure. Within just a few days, these WhatsApp mappers determined that 75% of the water infrastructure was non-functional, providing local authorities with accurate, ground-level information to take quicker and more informed action.</p></div><p><em>More case studies coming soon.</em></p>`,
				},
				{
					title: "Extreme Citizen Science",
					content: `Kapta is inspired by <a href="https://www.ucl.ac.uk/geography/research/research-centres/extreme-citizen-science-excites">Extreme Citizen Science</a>, an inclusive approach to citizen science that enables people from all backgrounds, regardless of their literacy, technical, or scientific skills, to co-design and participate in scientific research addressing local challenges. It combines interdisciplinary methodologies and tailored technologies to empower communities, particularly in underrepresented or marginalised areas, to collect, visualise, analyse, and use data for informed decision-making and advocacy.`,
				},
			],
		},
		{
			title: "About",
			icon: <InfoIcon />,
			subtitle: "",
			hasSubTabs: true,
			subTabs: [
				{
					title: "Ethics",
					content: `<p>
We prioritise enhancing the capabilities of individuals and communities impacted by our work, ensuring that every action serves a meaningful purpose and aligns with the public interest. Ethics is at the core of our decisions, helping us build trust and foster collective intelligence. By focusing on fairness, transparency, and inclusivity, we develop solutions that empower people to make better decisions in an increasingly complex world shaped by global environmental changes. Our work is guided by a commitment to contribute to a more equitable, sustainable, and socially responsible future for all.
</p><p>We embrace open-source principles to promote collective progress and serve the public interest. By sharing our tools and methods openly, we enable others to adapt them to diverse challenges and encourage broader participation in knowledge sharing. This approach fosters collaboration across geographies and cultures, driving solutions that benefit society as a whole.</p>`,
				},
				{
					title: "Careers",
					content: `<p>Join our dynamic team! We combine the creativity of academic research with the agility of a company, guided by a shared commitment to ethics, citizen science technology and collective intelligence. If you are curious about our work and want to contribute to innovative solutions for real-world challenges, we would love to hear from you - reach out at <a href=${mailto}>info@kapta.earth</a>.</p>
`,
				},
				{
					title: "Team",
					content: `<div>Founders:<ul>
					<li><a href='${urls.fabienUrl}'>Fabien Moustard</a></li>
					<li><a href='${urls.marcosUrl}'>Marcos Moreu</a></li></ul>
Team:<ul><li><a href='${urls.tomUrl}'>Tom Couch,  Software development</a></li>
<li><a href='${urls.amandaUrl}'>Amanda Ho-Lyn, Software development</a></li>
<li><a href='${urls.jedUrl}'>Jed Stevenson, Field implementation </a></li>
<li><a href='${urls.desUrl}'>Dessalegn Teckle, Field implementation</a></li>
<li><a href='${urls.satoUrl}'>Satoki Kawabata, Strategic planning </a></li>
<li><a href='${urls.gabrielUrl}'>Gabriel Dufourcq, Strategic planning </a></li></ul>
Advisors:<ul>
<li><a href='${urls.mukiUrl}'>Muki Haklay, UCL Geography</a></li>
<li><a href='${urls.claireUrl}'>Claire Ellul, UCL  Civil Environmental and Geomatic Engineering</a></li>
<li><a href='${urls.jeromeUrl}'>Jerome Lewis, UCL Anthropology</a></li>
<li><a href='${urls.jonathanUrl}'>Jonathan Cooper, UCL Advanced Research Computing</a></li>

</div>`,
				},
			],
		},
	];
	const handleAccordionChange = (panel) => (event, isExpanded) => {
		setExpandedPanel(isExpanded ? panel : false);
	};
	const handleSubAccordionChange = (subPanel) => (event, isExpanded) => {
		setExpandedSubPanel(isExpanded ? subPanel : false);
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
								<AccordionDetails>
									{section.hasSubTabs
										? section.subTabs.map((subTab, subIndex) => (
												<Accordion
													key={subTab.title}
													expanded={
														expandedSubPanel === `subPanel${index}${subIndex}`
													}
													onChange={handleSubAccordionChange(
														`subPanel${index}${subIndex}`
													)}
												>
													<AccordionSummary
														expandIcon={<ExpandMoreIcon />}
														aria-controls={`subPanel${index}${subIndex}a-content`}
														id={`subPanel${index}${subIndex}a-header`}
													>
														<Typography variant="subtitle1">
															{subTab.title}
														</Typography>
													</AccordionSummary>
													<AccordionDetails>
														<Typography variant="body2">
															{parse(subTab.content)}
														</Typography>
													</AccordionDetails>
												</Accordion>
										  ))
										: parse(section.content)}
								</AccordionDetails>
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
							<Button onClick={() => (window.location.href = mailto)}>
								info@kapta.earth
							</Button>
						</Typography>
						<Button
							startIcon={<GitHubIcon />}
							onClick={() => (window.location.href = GITHUB_URL)}
							variant="text"
							color="secondary"
						>
							GitHub
						</Button>
					</div>
					{user.loggedIn && (
						<Button
							onClick={handleLogout}
							endIcon={<LogoutIcon />}
							className="btn--logout"
							color="secondary"
						>
							Logout
						</Button>
					)}
					<Typography variant="caption" id="legal-notice">
						© 2024 Wisdom of the Crowd Labs (WCL), All rights reserved -{" "}
						<a
							onClick={(e) => {
								toggleDrawer(false)(e);
								setNoticeVisible(true);
							}}
						>
							Legal Notice
						</a>
					</Typography>
				</div>
			</Drawer>
		</>
	);
}
