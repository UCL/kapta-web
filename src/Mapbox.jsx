import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import { MAPBOX_TOKEN } from "./globals";
import "./styles/mapbox.css";

export function Map({ boundsVisible, polygonStore }) {
	console.log("received json:", polygonStore);
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

			// // Remove unnecessary layers
			// const layersToKeep = [
			// 	"land",
			// 	"water",
			// 	"admin-0-boundary",
			// 	"admin-1-boundary",
			// 	"admin-1-boundary-bg",
			// 	"country-label",
			// 	"state-label",
			// 	"settlement-major-label",
			// 	"settlement-minor-label",
			// 	"settlement-subdivision-label",
			// ];
			// const currentLayers = map.current
			// 	.getStyle()
			// 	.layers.map((layer) => layer.id);
			// currentLayers.forEach((layer) => {
			// 	if (!layersToKeep.includes(layer)) {
			// 		map.current.removeLayer(layer);
			// 	}
			// });
			// const tempCoordinates = [
			// 	[-33.8688, -74.006],
			// 	[-33.8688, 151.2093],
			// 	[51.593529, 151.2093],
			// 	[51.593529, -74.006],
			// 	[-33.8688, -74.006],
			// ];
			// map.current.addSource("temp-polygon", {
			// 	type: "geojson",
			// 	data: {
			// 		type: "Feature",
			// 		geometry: {
			// 			type: "Polygon",
			// 			coordinates: [tempCoordinates],
			// 		},
			// 	},
			// });
			// map.current.removeLayer("temp-layer");
			// map.current.addLayer({
			// 	id: "temp-layer",
			// 	type: "fill",
			// 	source: "temp-polygon",
			// 	paint: {
			// 		"fill-color": "#ff0000",
			// 		"fill-opacity": 0.9,
			// 	},
			// });
			// map.current.moveLayer("temp-layer");
			// console.log("tempCoordinates[0]", tempCoordinates);
			// const bounds = tempCoordinates.reduce((bounds, coord) => {
			// 	return bounds.extend(coord);
			// }, new mapboxgl.LngLatBounds(tempCoordinates[0], tempCoordinates[0]));
			// console.log(bounds);

			// map.current.fitBounds(bounds, {
			// 	padding: 20,
			// });

			// const layers = map.current.getStyle().layers;
			// console.log("Map Layers:", layers);
			// const layerInfo = [];
			// layers.forEach((layer) => {
			// 	layerInfo.push({
			// 		id: layer.id,
			// 		type: layer.type,
			// 		source: layer.source,
			// 	});
			// });
			// console.log(layerInfo);
		});
	}, []);

	// adding polygon source data
	useEffect(() => {
		if (!map.current || !map.current.isStyleLoaded() || !polygonStore) return;

		if (!map.current.getSource("polygon")) {
			map.current.addSource("polygon", {
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
			const source = map.current.getSource("polygon");
			console.log("source exists");
			source.setData({
				type: "Feature",
				geometry: {
					type: "Polygon",
					coordinates: polygonStore.coordinates,
				},
			});
		}
		console.log("set up data");

		if (boundsVisible) {
			if (!map.current.getLayer("polygon-layer")) {
				map.current.addLayer({
					id: "polygon-layer",
					type: "fill",
					source: "polygon",
					layout: {},
					paint: {
						"fill-color": "#0080ff",
						"fill-opacity": 0.7,
					},
				});
				map.current.moveLayer("polygon-layer");
			} else map.current.moveLayer("polygon-layer");
		} else {
			// if bounds not visible, remove polygon layer
			if (map.current.getLayer("polygon-layer")) {
				map.current.removeLayer("polygon-layer");
			}
		}

		// fit to polygon and center it
		const coordinates = polygonStore.coordinates;
		const bounds = coordinates.reduce((bounds, coord) => {
			return bounds.extend(coord);
		}, new mapboxgl.LngLatBounds());

		map.current.fitBounds(bounds, {
			padding: 20,
		});
	}, [polygonStore, boundsVisible]);

	return <div id="map"></div>;
}
