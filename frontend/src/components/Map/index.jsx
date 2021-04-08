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
	const [selectedPositionMap, setSelectedPositionMap] = useState([0, 0]);

	useEffect(() => {
		const [latitude, longitude] = selectedLocation;
		if (!!latitude && !!longitude) {
			setSelectedPositionMap([latitude, longitude]);
			setSelectedLocation([latitude, longitude]);
			setIsLoadedPosition(true);
		} else {
			navigator.geolocation.getCurrentPosition((postition) => {
				const { latitude, longitude } = postition.coords;
				setSelectedPositionMap([latitude, longitude]);
				setSelectedLocation([latitude, longitude]);
				setIsLoadedPosition(true);
			});
		}
	}, [selectedLocation]);

	useEffect(() => {
		console.log(selectedLocation);
	}, [selectedLocation]);

	function LocationMarker() {
		const map = useMapEvents({
			click(e) {
				map.locate();
				map.flyTo(e.latlng, map.getZoom());
				setSelectedPositionMap([e.latlng.lat, e.latlng.lng]);
				setSelectedLocation([e.latlng.lat, e.latlng.lng]);
			},
		});

		return selectedPositionMap === null ? null : (
			<Marker position={selectedPositionMap}>
				<Popup style={{ left: '-48px' }}>Você está aqui</Popup>
			</Marker>
		);
	}

	return (
		<Container>
			{isLoadedPosition && (
				<MapContainer center={selectedPositionMap} zoom={15} scrollWheelZoom={false}>
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
