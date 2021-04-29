import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { MapContainer } from './styles';
import MapPositionList from 'components/MapPositionList';

function MapUser({ users }) {
	const profile = useSelector((state) => state.user.profile);
	const [isLoadedPosition, setIsLoadedPosition] = useState(false);
	const [positionSearchMap, setPositionSearchMap] = useState([profile.latitude || 0, profile.longitude || 0]);
	const [positions, setPositions] = useState([]);

	useEffect(() => {
		console.log(users);
		setPositions(users);
		setIsLoadedPosition(!!users);
	}, [users]);
	return (
		<MapContainer>
			{isLoadedPosition && <MapPositionList center={positionSearchMap} positions={positions} />}
		</MapContainer>
	);
}

export default MapUser;
