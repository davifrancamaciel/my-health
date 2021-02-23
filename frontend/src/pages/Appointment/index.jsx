import React, { useState, useEffect } from 'react';
import { Select } from '@rocketseat/unform';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// import Select from 'components/Inputs/Select';

import api from 'services/api';
import getValidationErrors from 'Utils/getValidationErrors';
import Container from 'components/_layouts/Container';
import { Search, ContainerMapSelectProvider } from './styles';

function Appointment() {
	const [types, setTypes] = useState([]);
	const [isLoadedPosition, setIsLoadedPosition] = useState(false);
	const [initialPosition, setInitialPosition] = useState([0, 0]);
	const [selectedPosition, setSelectedPosition] = useState([0, 0]);
	const [specialities, setSpecialityies] = useState([]);

	useEffect(() => {
		async function loadSpecialitiesTypes() {
			try {
				const response = await api.get('specialities-types');
				setTypes(response.data);
			} catch (error) {
				getValidationErrors(error);
			}
		}
		loadSpecialitiesTypes();
	}, []);
	useEffect(() => {
		// if (!!selectedLocation[0] && !!selectedLocation[1]) {
		// 	setInitialPosition([selectedLocation[0], selectedLocation[1]]);
		// 	setSelectedPosition([selectedLocation[0], selectedLocation[1]]);
		// 	setIsLoadedPosition(true);
		// } else {
		navigator.geolocation.getCurrentPosition((postition) => {
			const { latitude, longitude } = postition.coords;

			setInitialPosition([latitude, longitude]);
			setSelectedPosition([latitude, longitude]);

			setIsLoadedPosition(true);
		});
		// }
	}, []);

	async function loadSpecialities(id) {
		try {
			const response = await api.get('appointments', {
				params: { speciality_type_id: id },
            });
            console.log(response.data)
			setSpecialityies(response.data.rows);
		} catch (error) {
			getValidationErrors(error);
		}
	}

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

	function MarkerProvider() {
		return specialities.map((x) => (
			<Marker position={[x.latitude, x.longitude]}>
				<Popup>You are here</Popup>
			</Marker>
		));
	}
	return (
		<Container title={`Agendar uma consulta`}>
			<ContainerMapSelectProvider>
				<Search>
					<Select
						placeholder="Informe uma especialidade"
						name="speciality_type_id"
						options={types}
						onChange={(e) => loadSpecialities(e.target.value)}
					/>
				</Search>
				{isLoadedPosition && (
					<MapContainer center={initialPosition} zoom={15}>
						<TileLayer
							attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>
						<MarkerProvider />
					</MapContainer>
				)}
			</ContainerMapSelectProvider>
		</Container>
	);
}

export default Appointment;
