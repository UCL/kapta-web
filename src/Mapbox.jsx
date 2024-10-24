import mapboxgl from "mapbox-gl";
import { useEffect } from "react";
import { MAPBOX_TOKEN } from "./globals";
import "./styles/mapbox.css";

export function Map() {
	useEffect(() => {
		mapboxgl.accessToken = MAPBOX_TOKEN;

		const map = new mapboxgl.Map({
			container: "map",
			style: "mapbox://styles/mapbox/dark-v11",
			zoom: 1.5,
			center: [30, 50],
			projection: "globe",
		});
		map.on("load", () => {
			map.setFog({
				color: "grey",
				"high-color": "#232222",
				"horizon-blend": 0.02,
				"space-color": "#16161d",
				"star-intensity": 0,
			});
		});
	}, []);

	return <div id="map"></div>;
}
