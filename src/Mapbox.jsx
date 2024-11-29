import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import { MAPBOX_TOKEN } from "./globals";
import { centroid, polygon, bbox } from "@turf/turf";

import "./styles/mapbox.css";

export function Map({
	boundsVisible,
	polygonStore,
	taskListOpen,
	focusTask,
	showTaskInList,
	isBackground,
}) {
	const map = useRef(null);
	const popupRef = useRef(null);

	const addMapClickListener = () => {
		// listen for click on a polygon
		map.current.on("click", "polygon-fill", (e) => {
			if (popupRef.current) {
				// remove popup if you click outside it
				popupRef.current.remove();
				popupRef.current = null;
			}
			const features = map.current.queryRenderedFeatures(e.point, {
				layers: ["polygon-fill"],
			});

			if (features.length) {
				const feature = features[0];
				const coordinates = e.lngLat;
				const description =
					feature.properties.description || "No description available";

				const popup = new mapboxgl.Popup()
					.setLngLat(coordinates)
					.setHTML(
						`<h3>${feature.properties.title}</h3><p>${description}</p><p><a id="show-task-details"onclick="handlePopupDetailsClick('${feature.properties.id}')">Show task details</a></p>`
					)
					.addTo(map.current);

				popupRef.current = popup;
			}
		});

		// Change cursor style on hover
		map.current.on("mouseenter", "polygons-layer", () => {
			map.current.getCanvas().style.cursor = "pointer";
		});

		map.current.on("mouseleave", "polygons-layer", () => {
			map.current.getCanvas().style.cursor = "";
		});
	};

	const getAndFitBounds = (focusTask) => {
		const turfPoly = polygon([focusTask.geo_bounds.coordinates]);

		const bounds = bbox(turfPoly);
		map.current.fitBounds(bounds, {
			padding: 200,
		});
	};

	// base map
	useEffect(() => {
		if (map.current) return;
		mapboxgl.accessToken = MAPBOX_TOKEN;

		map.current = new mapboxgl.Map({
			container: "map",
			style: "mapbox://styles/mapbox/dark-v11",
			zoom: 1.3,
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

	// resize the map when splitscreen
	useEffect(() => {
		if (map.current) {
			map.current.resize();
		}
	}, [taskListOpen]);

	// handle polygons
	useEffect(() => {
		if (!map.current || !map.current.isStyleLoaded() || !polygonStore) return;

		var newData;

		// is search results
		if (Array.isArray(polygonStore)) {
			console.log("is array");
			newData = {
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
		} else {
			// single polygon
			const newFeature = {
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
			};

			newData = {
				type: "FeatureCollection",
				features: [newFeature],
			};
		}

		// source does not exist
		if (!map.current.getSource("polygon-source")) {
			map.current.addSource("polygon-source", {
				type: "geojson",
				data: newData,
			});
		} else {
			console.log("source exists");
			// source already exists, update the data

			// removing data points since new task
			if (map.current.getLayer("datapoints-layer")) {
				map.current.removeLayer("datapoints-layer");
			}
			// removing popup since new task
			if (map.current && popupRef.current) {
				popupRef.current.remove();
				popupRef.current = null;
			}

			// getting and setting source
			let source = map.current.getSource("polygon-source");

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

				addMapClickListener();
			} else {
				// make sure they're at the top
				map.current.moveLayer("polygon-fill");
				map.current.moveLayer("polygon-outline");
				addMapClickListener();
			}
		} else {
			// if bounds not visible, remove polygon layer
			if (map.current.getLayer("polygon-fill")) {
				map.current.removeLayer("polygon-fill");
			}
			map.current.off("click");
		}
		if (!Array.isArray(polygonStore)) {
			getAndFitBounds(polygonStore);
		} else {
			// fly to first task of results but not zoom in
			const taskWithGeoBounds = polygonStore.find((task) => task.geo_bounds);

			const turfPoly = polygon([taskWithGeoBounds.geo_bounds.coordinates]);
			const centroidPoint = centroid(turfPoly);

			map.current.flyTo({
				center: centroidPoint.geometry.coordinates,
				essential: true,
				zoom: 3,
			});
		}
	}, [polygonStore, boundsVisible, taskListOpen]);

	// fly to focused task and show data points
	useEffect(() => {
		// flying to task when multiple loaded
		if (!map.current || !map.current.isStyleLoaded() || !focusTask) return;

		console.log("flyign to task", focusTask);

		if (focusTask && focusTask.geo_bounds) {
			getAndFitBounds(focusTask);
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

			getAndFitBounds(focusTask);
		}
	}, [focusTask]);

	return (
		<div
			id="map"
			className={
				taskListOpen ? "splitscreen" : isBackground ? "background" : ""
			}
		></div>
	);
}
