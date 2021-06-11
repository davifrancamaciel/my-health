import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import Container from 'components/_layouts/Container';
import Select from 'components/Inputs/Select';
import MapPositionList from 'components/MapPositionList';

import api from 'services/api';
import getValidationErrors from 'Utils/getValidationErrors';
import urlMessageWhatsapp from 'Utils/urlMessageWhatsapp';
import showToast from 'Utils/showToast';
import { PRIMARY_COLOR } from 'constants/colors';

import { Search, ContainerMapSelectProvider, Map, Location } from './styles';

function Appointment() {
	const profile = useSelector((state) => state.user.profile);
	const [types, setTypes] = useState([]);
	const [allTypes, setAllTypes] = useState([]);
	const [segments, setSegments] = useState([]);
	const [isLoadedPosition, setIsLoadedPosition] = useState(false);
	const [useCurrentLocation, setUseCurrentLocation] = useState(false);
	const [currentLocation, setCurrentLocation] = useState([0, 0]);
	const [positionSearchMap, setPositionSearchMap] = useState([profile.latitude || 0, profile.longitude || 0]);
	const [specialities, setSpecialityies] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!!profile.latitude && !!Number(profile.latitude) && !!profile.longitude && !!Number(profile.longitude)) {
			setPositionSearchMap([profile.latitude, profile.longitude]);
			setIsLoadedPosition(true);
		} else {
			setPositionSearchMap(currentLocation);
			setIsLoadedPosition(true);
		}
	}, [currentLocation]);

	useEffect(() => {
		checkPermission();
		navigator.geolocation.getCurrentPosition((postition) => {
			const { latitude, longitude } = postition.coords;
			setCurrentLocation([latitude, longitude]);
		});
		loadSegmentsAndSpecialitiesTypes();
	}, []);

	useEffect(() => {
		if (useCurrentLocation) {
			checkPermission();

			setPositionSearchMap(currentLocation);
		} else {
			if (
				!!profile.latitude &&
				!!Number(profile.latitude) &&
				!!profile.longitude &&
				!!Number(profile.longitude)
			) {
				setPositionSearchMap([profile.latitude, profile.longitude]);
			}
		}
	}, [useCurrentLocation]);

	async function loadSegmentsAndSpecialitiesTypes() {
		try {
			const [respSegments, respTypes] = await Promise.all([
				api.get('segments-list', { params: { active: true } }),
				api.get('specialities-types-list', { params: { active: true } }),
			]);
			setSegments(respSegments.data);
			setAllTypes(respTypes.data);
		} catch (error) {
			getValidationErrors(error);
		}
	}

	function filterSpecialityTypes(segment_id) {
		const typesFilter = allTypes.filter((x) => x.segment_id === segment_id);
		setTypes(typesFilter);
	}

	async function loadSpecialities(id) {
		try {
			setLoading(true);
			const [latitude, longitude] = positionSearchMap;

			const response = await api.get('appointments', {
				params: { speciality_type_id: id, latitude, longitude },
			});
			setLoading(false);

			const data = response.data.rows.map((x) => ({
				...x,
				urlWhatsapp: urlMessageWhatsapp(x.user.whatsapp),
				email: x.user.email,
				name: x.user.name,
				whatsapp: x.user.whatsapp,
				url: x.user.url,
				urlAppointment: `/appointment/${x.id}/create`,
			}));

			setSpecialityies(data);
		} catch (error) {
			setLoading(false);
			getValidationErrors(error);
		}
	}

	function checkPermission() {
		navigator.permissions.query({ name: 'geolocation' }).then((permission) => {
			if (permission.state !== 'granted') {
				showToast.info(
					'Será necessário permitir o acesso a sua localização atual para que o mapa funcione corretamente'
				);
			} else {
				if (
					useCurrentLocation &&
					(!profile.latitude || !Number(profile.latitude) || !profile.longitude || !Number(profile.longitude))
				) {
					showToast.info(
						'Já estamos usando sua localização atual, pois a mesma ainda não foi definida na sua conta. Verifique!'
					);
				}
			}
		});
	}

	return (
		<Container loading={loading} full>
			<ContainerMapSelectProvider>
				<Search>
					<h1>Agende pertinho de você</h1>
					<Select
						placeholder="Informe um segmento"
						name="segment_id"
						options={segments}
						onSelected={(e) => filterSpecialityTypes(e.value)}
						color={PRIMARY_COLOR}
					/>
					<Select
						placeholder="Informe uma especialidade"
						name="speciality_type_id"
						options={types}
						onSelected={(e) => loadSpecialities(e.value)}
						color={PRIMARY_COLOR}
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
				<Map>{isLoadedPosition && <MapPositionList center={positionSearchMap} positions={specialities} />}</Map>
			</ContainerMapSelectProvider>
		</Container>
	);
}

export default Appointment;
