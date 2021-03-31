import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import Container from 'components/_layouts/Container';
import Select from 'components/Inputs/Select';
import MarkerContainer from './Marker';

import api from 'services/api';
import getValidationErrors from 'Utils/getValidationErrors';
import urlMessageWhatsapp from 'Utils/urlMessageWhatsapp';
import showToast from 'Utils/showToast';

import { Search, ContainerMapSelectProvider, Map, Location } from './styles';

function Appointment() {
	const profile = useSelector((state) => state.user.profile);
	const [types, setTypes] = useState([]);
	const [isLoadedPosition, setIsLoadedPosition] = useState(false);
	const [useCurrentLocation, setUseCurrentLocation] = useState(false);
	const [currentLocation, setCurrentLocation] = useState([0, 0]);
	const [positionSearchMap, setPositionSearchMap] = useState([profile.latitude || 0, profile.longitude || 0]);
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
		if (!!profile.latitude && !!profile.longitude) {
			setPositionSearchMap([profile.latitude, profile.longitude]);
			setIsLoadedPosition(true);
		} else {
			setPositionSearchMap(currentLocation);
			setIsLoadedPosition(true);
		}
	}, [currentLocation]);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition((postition) => {
			const { latitude, longitude } = postition.coords;
			setCurrentLocation([latitude, longitude]);
		});
	}, []);

	useEffect(() => {
		if (useCurrentLocation) {
			if (!profile.latitude) {
				showToast.info(
					'Já estamos usando sua localização atual, pois a mesma ainda não foi definida na sua conta. Verifique!'
				);
			}
			setPositionSearchMap(currentLocation);
		} else {
			if (!!profile.latitude && !!profile.longitude) {
				setPositionSearchMap([profile.latitude, profile.longitude]);
			}
		}
	}, [useCurrentLocation]);

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

	function ChangeView({ center }) {
		const map = useMap();
		map.setView(center, map._zoom);
		return null;
	}

	return (
		<Container loading={loading} full>
			<ContainerMapSelectProvider>
				<Search>
					<h1>Agende uma consulta pertinho de você</h1>
					<Select
						placeholder="Informe uma especialidade"
						name="speciality_type_id"
						options={types}
						onSelected={(e) => loadSpecialities(e.value)}
					/>
					<Location>
						<FormControlLabel
							control={
								<Switch
									color="primary"
									checked={useCurrentLocation}
									onChange={() => setUseCurrentLocation(!useCurrentLocation)}
									name={`currentLocation`}
								/>
							}
							label={`Usar minha localização atual`}
						/>
					</Location>
				</Search>
				<Map>
					{isLoadedPosition && (
						<MapContainer center={positionSearchMap} zoom={12} scrollWheelZoom={false}>
							<ChangeView center={positionSearchMap} />
							<TileLayer
								attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
								url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							/>
							{specialities.map((x) => (
								<MarkerContainer key={x.id} item={x} />
							))}
						</MapContainer>
					)}
				</Map>
			</ContainerMapSelectProvider>
		</Container>
	);
}

export default Appointment;
