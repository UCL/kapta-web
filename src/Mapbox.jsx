import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import { MAPBOX_TOKEN } from "./globals";
import "./styles/mapbox.css";

export function Map({ boundsVisible }) {
	const map = useRef(null);
	useEffect(() => {
		mapboxgl.accessToken = MAPBOX_TOKEN;

		map.current = new mapboxgl.Map({
			container: "map",
			style: "mapbox://styles/mapbox/dark-v11",
			zoom: 1.5,
			center: [30, 50],
			projection: "globe",
		});
		map.current.on("load", () => {
			map.current.setFog({
				color: "grey",
				"high-color": "#232222",
				"horizon-blend": 0.02,
				"space-color": "#16161d",
				"star-intensity": 0,
			});
		});
	}, []);

	useEffect(() => {
		if (!map.current || !map.current.isStyleLoaded()) return;

		if (boundsVisible) {
			if (!map.current.getLayer("polygon-layer")) {
				map.current.addLayer({
					id: "polygon-layer",
					type: "fill",
					source: "polygon",
					layout: {},
					paint: {
						"fill-color": "#0080ff",
						"fill-opacity": 0.5,
					},
				});
			}
		} else {
			if (map.current.getLayer("polygon-layer")) {
				map.current.removeLayer("polygon-layer");
			}
		}
	}, [boundsVisible]);

	return <div id="map"></div>;
}
