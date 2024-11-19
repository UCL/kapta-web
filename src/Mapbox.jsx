import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import { MAPBOX_TOKEN } from "./globals";
import "./styles/mapbox.css";

export function Map({ boundsVisible, polygonStore, taskListOpen }) {
	const map = useRef(null);

	// base map
	useEffect(() => {
		mapboxgl.accessToken = MAPBOX_TOKEN;

		map.current = new mapboxgl.Map({
			container: "map",
			style: "mapbox://styles/mapbox/dark-v11",
			zoom: 1.2,
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
			// currently will add to existing data, do we want to clear if it's from task list?
			const source = map.current.getSource("polygon-source");
			let existingData = source._data;

			if (!existingData || existingData.type !== "FeatureCollection") {
				existingData = {
					type: "FeatureCollection",
					features: [],
				};
			}

			// Ensure polygonStore is an array so we can use .map() even if it's one item
			const polygons = Array.isArray(polygonStore)
				? polygonStore
				: [polygonStore];
			// Set structure like this, particular attention to the [] around coordinates, otherwise polygon will not show
			const newFeatures = polygons.map((polygon) => ({
				type: "Feature",
				geometry: {
					type: "Polygon",
					coordinates: [polygon.coordinates],
				},
			}));

			const newData = {
				type: "FeatureCollection",
				features: [...existingData.features, ...newFeatures],
			};

			source.setData(newData);
		}

		//draw the polygons and their outlines
		if (boundsVisible) {
			if (!map.current.getLayer("polygon-fill")) {
				map.current.addLayer({
					id: "polygon-fill",
					type: "fill",
					source: "polygon-source",
					layout: {},
					paint: {
						"fill-color": "#ff6347",
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
						"line-color": "#e63621",
						"line-width": 4,
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
		const bounds = getBounds(polygonStore);

		map.current.fitBounds(bounds, {
			padding: 30,
			maxZoom: 8,
		});
	}, [polygonStore, boundsVisible]);

	const getBounds = (polygonStore) => {
		var bounds = new mapboxgl.LngLatBounds();
		if (Array.isArray(polygonStore)) {
			// only an array if multiple, unclear why there are slightly different structures

			polygonStore.forEach((array) => {
				if (array.type === "Polygon") {
					array.coordinates.forEach((coord) => {
						bounds.extend(coord);
					});
				} else {
					array.forEach((item) => {
						if (item.type === "Polygon") {
							item.coordinates.forEach((coord) => {
								bounds.extend(coord);
							});
						}
					});
				}
			});
		} else {
			const coordinates = polygonStore.coordinates;
			coordinates.forEach((coord) => {
				bounds.extend(coord);
			});
		}
		return bounds;
	};

	return <div id="map" className={taskListOpen ? "splitscreen" : ""}></div>;
}
