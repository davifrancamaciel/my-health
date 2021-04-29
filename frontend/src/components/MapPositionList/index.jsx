import React from 'react';

import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MarkerContainer from './Marker';

function MapPositionList({ center, children, positions }) {
	
	function ChangeView({ center }) {
		const map = useMap();
		map.setView(center, map._zoom);
		return null;
	}

	return (
		<MapContainer center={center} zoom={12} scrollWheelZoom={false}>
			<ChangeView center={center} />
			<TileLayer
				attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{children ? children : <MarkerContainer positions={positions} />}
		</MapContainer>
	);
}

export default MapPositionList;
