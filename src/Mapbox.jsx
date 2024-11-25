import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import { MAPBOX_TOKEN } from "./globals";
import "./styles/mapbox.css";

export function Map({ boundsVisible, polygonStore, taskListOpen, focusTask }) {
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

		// source does not exist
		if (!map.current.getSource("polygon-source")) {
			// not an array of polygons
			if (!Array.isArray(polygonStore)) {
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
				const newData = {
					type: "FeatureCollection",
					features: polygonStore.map((polygon) => ({
						type: "Feature",
						geometry: {
							type: "Polygon",
							coordinates: [polygon.coordinates],
						},
					})),
				};

				map.current.addSource("polygon-source", {
					type: "geojson",
					data: newData,
				});
			}
		} else {
			// source already exists, used when viewing task list and clicking between tasks
			let source = map.current.getSource("polygon-source");
			let existingData = source._data;

			if (!existingData || existingData.type !== "FeatureCollection") {
				existingData = {
					type: "FeatureCollection",
					features: [],
				};
			}

			// resetting data points
			if (map.current.getLayer("datapoints-layer")) {
				map.current.removeLayer("datapoints-layer");
			}

			// Ensure polygonStore is an array so we can use .map() even if it's one item (the initial one)
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

		if (bounds) {
			map.current.fitBounds(bounds, {
				padding: 200,
			});
		}
	}, [polygonStore, boundsVisible]);

	// fly to and show data points
	useEffect(() => {
		// flying to task when multiple loaded
		if (!map.current || !map.current.isStyleLoaded() || !focusTask) return;

		if (focusTask && focusTask.geo_bounds) {
			map.current.flyTo({
				center: focusTask.geo_bounds.coordinates[1],
				essential: true, // not user-interruptible
				padding: 200,
			});
		}
		// if focusTask is a feature collection (showing data points)
		else if (focusTask && focusTask.type === "FeatureCollection") {
			// add source
			if (!map.current.getSource("datapoints-source")) {
				map.current.addSource("datapoints-source", {
					type: "geojson",
					data: focusTask,
				});
			} else {
				map.current.getSource("datapoints-source").setData(focusTask);
			}

			// add layer
			if (!map.current.getLayer("datapoints-layer")) {
				map.current.addLayer({
					id: "datapoints-layer",
					type: "circle",
					source: "datapoints-source",
					paint: {
						"circle-radius": 5,
						"circle-color": "#c8ff00",
					},
				});
			}
			// fly to it (in case they moved away)
			map.current.flyTo({
				center: focusTask.features[0].geometry.coordinates,
				essential: true,
				padding: 200,
				zoom: 13,
			});
		}
	}, [focusTask]);

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
