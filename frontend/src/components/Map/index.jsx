import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { Container } from './styles';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
	iconUrl: icon,
	shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

function Map({ selectedLocation, setSelectedLocation }) {
	const [isLoadedPosition, setIsLoadedPosition] = useState(false);
	const [initialPosition, setInitialPosition] = useState([0, 0]);
	const [selectedPosition, setSelectedPosition] = useState([0, 0]);

	useEffect(() => {
		console.log(selectedLocation)
		if (!!selectedLocation[0] && !!selectedLocation[1]) {
			setInitialPosition([selectedLocation[0], selectedLocation[1]]);
			setSelectedPosition([selectedLocation[0], selectedLocation[1]]);
			setIsLoadedPosition(true);
		} else {
			navigator.geolocation.getCurrentPosition((postition) => {
				const { latitude, longitude } = postition.coords;

				setInitialPosition([latitude, longitude]);
				setSelectedPosition([latitude, longitude]);

				setIsLoadedPosition(true);
			});
		}
	}, []);

	useEffect(() => {
		setSelectedLocation(selectedPosition);
	}, [selectedPosition]);

	function LocationMarker() {
		const map = useMapEvents({
			click(e) {
				map.locate();
				map.flyTo(e.latlng, map.getZoom());
				setSelectedPosition([e.latlng.lat, e.latlng.lng]);
			},
		});

		return selectedPosition === null ? null : (
			<Marker position={selectedPosition}>
				<Popup>You are here</Popup>
			</Marker>
		);
	}

	return (
		<Container>
			{isLoadedPosition && (
				<MapContainer center={initialPosition} zoom={15}>
					<TileLayer
						attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
					<LocationMarker />
				</MapContainer>
			)}
		</Container>
	);
}

export default Map;
