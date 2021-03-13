import React, { useState, useEffect } from 'react';
// import { Select } from '@rocketseat/unform';

import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import MarkerContainer from './Marker';

import Select from 'components/Inputs/Select';

import api from 'services/api';
import getValidationErrors from 'Utils/getValidationErrors';
import urlMessageWhatsapp from 'Utils/urlMessageWhatsapp';
import Container from 'components/_layouts/Container';

import { Search, ContainerMapSelectProvider, PopupCustom, Card, Info } from './styles';

function Appointment() {
	const [types, setTypes] = useState([]);
	const [isLoadedPosition, setIsLoadedPosition] = useState(false);
	const [initialPosition, setInitialPosition] = useState([0, 0]);
	const [selectedPosition, setSelectedPosition] = useState([0, 0]);
	const [specialities, setSpecialityies] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function loadSpecialitiesTypes() {
			try {
				setLoading(true);
				const response = await api.get('specialities-types');

				setTypes(response.data);

				setLoading(false);
			} catch (error) {
				setLoading(false);
				getValidationErrors(error);
			}
		}
		loadSpecialitiesTypes();
		loadSpecialities();
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
			setLoading(true);
			const response = await api.get('appointments', {
				params: { speciality_type_id: id },
			});
			setLoading(false);

			const data = response.data.rows.map((x) => ({
				...x,
				urlWhatsapp: urlMessageWhatsapp(x.user.whatsapp),
			}));

			setSpecialityies(data);
		} catch (error) {
			setLoading(false);
			getValidationErrors(error);
		}
	}

	return (
		<Container title={`Agendar uma consulta`} loading={loading} showBack>
			<ContainerMapSelectProvider>
				<Search>
					<Select
						placeholder="Informe uma especialidade"
						name="speciality_type_id"
						options={types}
						onSelected={(e) => loadSpecialities(e.value)}
					/>
				</Search>
				{isLoadedPosition && (
					<MapContainer center={initialPosition} zoom={15}>
						<TileLayer
							attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>
						{specialities.map((x) => (
							<MarkerContainer item={x} />
						))}
					</MapContainer>
				)}
			</ContainerMapSelectProvider>
		</Container>
	);
}

export default Appointment;
