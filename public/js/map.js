const ACCESS_TOKEN = mapToken;
mapboxgl.accessToken = ACCESS_TOKEN;
const map = new mapboxgl.Map({
	container: "map",
	style: "mapbox://styles/mapbox/streets-v12",
	center: [-73.99209, 50],
	zoom: 8.8,
});
map.flyTo({
	center: coordinates,
	zoom: 12,
});
const marker = new mapboxgl.Marker({ color: "red" })
	.setLngLat(coordinates)
	.setPopup(
		new mapboxgl.Popup({ offset: 25 }).setHTML(
			`<h4>${f_location}</h4></p>Exact location will be provided after booking<p>`
		)
	)
	.addTo(map);
map.addControl(new mapboxgl.NavigationControl());
