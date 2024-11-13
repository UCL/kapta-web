import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import { MAPBOX_TOKEN } from "./globals";
import "./styles/mapbox.css";

export function Map({ boundsVisible, polygonStore }) {
	const map = useRef(null);
	// base map
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

	// adding polygon source data
	useEffect(() => {
		if (!map.current || !map.current.isStyleLoaded() || !polygonStore) return;
		console.log(
			"poly source:",
			polygonStore,
			typeof polygonStore,
			polygonStore.length
		);

		if (!map.current.getSource("polygon-source")) {
			map.current.addSource("polygon-source", {
				type: "geojson",
				data: {
					type: "Feature",
					geometry: {
						type: "Polygon",
						coordinates: [polygonStore.coordinates],
					},
				},
			});
		} else {
			const source = map.current.getSource("polygon-source");
			polygonStore.map((polygon) => {
				source.setData({
					type: "Feature",
					geometry: {
						type: "Polygon",
						coordinates: [polygon.coordinates],
					},
				});
			});
		}

		if (boundsVisible) {
			if (!map.current.getLayer("polygon-fill")) {
				map.current.addLayer({
					id: "polygon-fill",
					type: "fill",
					source: "polygon-source",
					layout: {},
					paint: {
						"fill-color": "#0080ff",
						"fill-opacity": 0.6,
					},
				});
				map.current.moveLayer("polygon-fill");
				// outline
				map.current.addLayer({
					id: "polygon-outline",
					type: "line",
					source: "polygon-source",
					paint: {
						"line-color": "#0d335a",
						"line-width": 5,
					},
				});
				map.current.moveLayer("polygon-outline");
			} else {
				// make sure they're at the top
				map.current.moveLayer("polygon-fill");
				map.current.moveLayer("polygon-outline");
			}
		} else {
			// if bounds not visible, remove polygon layer
			if (map.current.getLayer("polygon-fill")) {
				map.current.removeLayer("polygon-fill");
			}
		}

		// fit to polygon and center it
		var bounds = new mapboxgl.LngLatBounds();
		if (polygonStore.length > 1) {
			polygonStore.forEach((polygon) => {
				polygon.coordinates.forEach((coord) => {
					bounds.extend(coord);
				});
			});
		} else {
			const coordinates = polygonStore.coordinates;
			bounds = coordinates.reduce((bounds, coord) => {
				return bounds.extend(coord);
			}, new mapboxgl.LngLatBounds());
		}

		map.current.fitBounds(bounds, {
			padding: 20,
		});
	}, [polygonStore, boundsVisible]);

	return <div id="map"></div>;
}
