import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { format, parseISO, formatRelative, isEqual, isAfter } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { utcToZonedTime } from 'date-fns-tz';
import api from 'services/api';
import getValidationErrors from 'Utils/getValidationErrors';
import urlMessageWhatsapp from 'Utils/urlMessageWhatsapp';
import { formatPrice } from 'Utils/formatPrice';

import Profile from '../Profile';
import Container from 'components/_layouts/Container';
import { ContainerDetail, Appointment } from './styles';

function Details() {
	const profile = useSelector((state) => state.user.profile);

	const { id } = useParams();

	const [loading, setLoading] = useState(false);
	const [appointment, setAppointment] = useState({});

	useEffect(() => {
		loadAppointment(id);
	}, [id]);

	async function loadAppointment(id) {
		try {
			setLoading(true);
			const response = await api.get(`/appointments/${id}`);

			const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

			// const data = response.data.available.map((time) => {
			// 	const [hour, minute] = time.time.split(':');

			// 	const checkDate = setMilliseconds(setSeconds(setMinutes(setHours(date, hour), minute), 0), 0);
			// 	const compareDate = utcToZonedTime(checkDate, timezone);
			// 	const appointment = response.data.appointments.find((a) => isEqual(parseISO(a.date), compareDate));

			// 	return {
			// 		time: `${hour}:${minute}h`,
			// 		value: format(checkDate, "yyyy-MM-dd'T'HH:mm:ssxxx"),
			// 		available:
			// 			isAfter(checkDate, new Date()) &&
			// 			!response.data.appointments.find((a) => format(parseISO(a.date), 'HH:mm') === time.time),
			// 		isMine: appointment && appointment.user_id === profile.id ? true : false,
			// 		id: appointment && appointment.user_id === profile.id && appointment.id,
			// 		appointment: appointment && appointment.user_id === profile.id ? appointment : {},
			// 	};
			// });
			const { data } = response;

			let toAppointmentProfile = 'provider';
			let titlePosition = 'Médico';
			if (data.provider_id == profile.id) {
				toAppointmentProfile = 'user';
				titlePosition = 'Paciente';
			}
			const dataFormated = {
				...response.data,
				...response.data.speciality,
				priceFormated: formatPrice(data.speciality.value),
				urlWhatsapp: urlMessageWhatsapp(data.user.whatsapp),
				user: data[toAppointmentProfile],
				titlePosition,
			};
			console.log(data);
			console.log(dataFormated);
			setAppointment(dataFormated);

			setLoading(false);
		} catch (error) {
			setLoading(false);
			getValidationErrors(error);
		}
	}

	return (
		<Container title={`Detalhes do agendamento`} loading={loading} showBack>
			<ContainerDetail>
				{appointment.user && <Profile profile={appointment} />}
				<Appointment></Appointment>
			</ContainerDetail>
		</Container>
	);
}

export default Details;
