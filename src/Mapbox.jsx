import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import { MAPBOX_TOKEN } from "./globals";
import "./styles/mapbox.css";

export function Map({
	boundsVisible,
	polygonStore,
	taskListOpen,
	focusTask,
	showTaskInList,
}) {
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

		// make this function available from when the map initialises
		window.handlePopupDetailsClick = (id) => {
			showTaskInList(id);
		};
	}, []);

	// handle polygons
	useEffect(() => {
		if (!map.current || !map.current.isStyleLoaded() || !polygonStore) return;

		// source does not exist
		if (!map.current.getSource("polygon-source")) {
			// not an array of polygons (not search results)
			if (!Array.isArray(polygonStore)) {
				map.current.addSource("polygon-source", {
					type: "geojson",
					data: {
						type: "Feature",
						geometry: {
							type: "Polygon",
							coordinates: [polygonStore.geo_bounds.coordinates],
						},
						properties: {
							id: polygonStore.task_id,
							title: polygonStore.task_title,
							description: polygonStore.task_description,
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
							coordinates: [polygon.geo_bounds.coordinates],
						},
						properties: {
							id: polygon.task_id,
							title: polygon.task_title,
							description: polygon.task_description,
						},
					})),
				};

				map.current.addSource("polygon-source", {
					type: "geojson",
					data: newData,
				});
			}
		} else {
			// removing data points since new task
			if (map.current.getLayer("datapoints-layer")) {
				map.current.removeLayer("datapoints-layer");
			}

			// source already exists, used when viewing task list and clicking between tasks
			let source = map.current.getSource("polygon-source");
			let existingData = source._data;

			if (!existingData || existingData.type !== "FeatureCollection") {
				existingData = {
					type: "FeatureCollection",
					features: [],
				};
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
					coordinates: [polygon.geo_bounds.coordinates],
				},
				properties: {
					id: polygon.task_id,
					title: polygon.task_title,
					description: polygon.task_description,
				},
			}));

			// if the polygon is already on the map, don't add it again
			const filteredNewFeatures = newFeatures.filter((newFeature) => {
				return !existingData.features.some(
					(existingFeature) =>
						existingFeature.properties.id === newFeature.properties.id
				);
			});

			const updatedFeatures = [
				...existingData.features,
				...filteredNewFeatures,
			];

			const newData = {
				type: "FeatureCollection",
				features: updatedFeatures,
			};

			source.setData(newData);
		}

		// draw the polygons and their outlines
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

				// listen for click on a polygon
				map.current.on("click", "polygon-fill", (e) => {
					const features = map.current.queryRenderedFeatures(e.point, {
						layers: ["polygon-fill"],
					});

					if (features.length) {
						const feature = features[0];
						const coordinates = e.lngLat;
						const description =
							feature.properties.description || "No description available";

						new mapboxgl.Popup()
							.setLngLat(coordinates)
							.setHTML(
								`<h3>${feature.properties.title}</h3><p>${description}</p><p><a id="show-task-details"onclick="handlePopupDetailsClick('${feature.properties.id}')">Show task details</a></p>`
							)
							.addTo(map.current);
					}
				});

				// Change cursor style on hover
				map.current.on("mouseenter", "polygons-layer", () => {
					map.current.getCanvas().style.cursor = "pointer";
				});

				map.current.on("mouseleave", "polygons-layer", () => {
					map.current.getCanvas().style.cursor = "";
				});
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

	// fly to focused task and show data points
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
		// if focusTask is a feature collection (used for showing data points)
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
		// expects either a single task object or an array of task objects with geo_bounds as the relevant part
		var bounds = new mapboxgl.LngLatBounds();
		if (Array.isArray(polygonStore)) {
			// only an array if multiple, unclear why there are slightly different structures

			polygonStore.forEach((object) => {
				const geoBounds = object.geo_bounds;
				if (geoBounds.type === "Polygon") {
					geoBounds.coordinates.forEach((coord) => {
						bounds.extend(coord);
					});
				} else {
					geoBounds.forEach((item) => {
						if (item.type === "Polygon") {
							item.coordinates.forEach((coord) => {
								bounds.extend(coord);
							});
						}
					});
				}
			});
		} else {
			const coordinates = polygonStore.geo_bounds.coordinates;
			coordinates.forEach((coord) => {
				bounds.extend(coord);
			});
		}
		return bounds;
	};

	return <div id="map" className={taskListOpen ? "splitscreen" : ""}></div>;
}
