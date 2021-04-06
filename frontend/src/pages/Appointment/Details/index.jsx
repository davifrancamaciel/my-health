import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { FiCalendar } from 'react-icons/fi';
import Chip from '@material-ui/core/Chip';

import { format, parseISO, formatRelative, isEqual, isAfter } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { utcToZonedTime } from 'date-fns-tz';
import ShowConfirm from 'components/ShowConfirm';
import api from 'services/api';
import firebaseService from 'services/firebase';
import showToast from 'Utils/showToast';
import getValidationErrors from 'Utils/getValidationErrors';
import urlMessageWhatsapp from 'Utils/urlMessageWhatsapp';
import { formatPrice } from 'Utils/formatPrice';

import Container from 'components/_layouts/Container';
import { ContainerDetail, Appointment, ProfileInfo, Profile } from './styles';

function Details() {
	const profile = useSelector((state) => state.user.profile);

	const { id } = useParams();

	const [loading, setLoading] = useState(false);
	const [appointment, setAppointment] = useState({});
	const [title, setTitle] = useState('');

	useEffect(() => {
		loadAppointment(id);
	}, [id]);

	async function loadAppointment(id) {
		try {
			setLoading(true);
			const response = await api.get(`/appointments/${id}`);

			const { data } = response;

			let toAppointmentProfile = 'provider';
			let titlePosition = 'Médico';
			if (data.provider_id == profile.id) {
				toAppointmentProfile = 'user';
				titlePosition = 'Paciente';
			}
			const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			const date = utcToZonedTime(parseISO(data.date), timezone);

			const dateFormatedComplete = format(date, "'dia' dd 'de' MMMM',' eeee', às' H:mm'h'", {
				locale: pt,
			});
			setTitle(`Agendamento ${dateFormatedComplete}`);
			const dataFormated = {
				...response.data,				
				priceFormated: formatPrice(data.speciality.value),
				urlWhatsapp: urlMessageWhatsapp(data[toAppointmentProfile].whatsapp),
				user: data[toAppointmentProfile],
				titlePosition,
			};
			console.log(dataFormated);
			setAppointment(dataFormated);

			setLoading(false);
		} catch (error) {
			setLoading(false);
			getValidationErrors(error);
		}
	}

	function handleCancelAppointment() {
		if (!appointment.cancelable) {
			showToast.warning('Este agendamento só pode ser cancelado até 2h antes');
			return;
		}
		ShowConfirm(
			'Atenção',
			`Confirma o cancelamemto do agendamento com ${appointment.titlePosition.toLowerCase()} <h2>${
				appointment.user.name
			}?</h2>`,
			() => handleCancelAppointmentConfirmed(appointment)
		);
	}

	async function handleCancelAppointmentConfirmed(appointment) {
		try {
			setLoading(true);
			const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			const date = utcToZonedTime(parseISO(appointment.date), timezone);

			const dateFormatedComplete = format(date, "'dia' dd 'de' MMMM',' eeee', às' H:mm'h'", {
				locale: pt,
			});

			const response = await api.delete(`appointments/${appointment.id}`, {
				data: { dateFormatedComplete },
			});

			addNotification({ ...response.data, dateFormatedComplete });
			setAppointment({ ...appointment, canceled_at: new Date() });
			showToast.success(`${title} CANCELADO com sucesso`);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			getValidationErrors(error);
		}
	}

	function addNotification(appointment) {
		let message = '';
		if (profile.id === appointment.provider_id) {
			message = `Consulta CANCELADA para ${appointment.speciality.type.name} agendada com ${appointment.provider.name} para o ${appointment.dateFormatedComplete}`;
		}
		if (profile.id === appointment.user_id) {
			message = `Consulta CANCELADA para ${appointment.speciality.type.name} com ${appointment.user.name} para o ${appointment.dateFormatedComplete}`;
		}

		const userId = profile.id === appointment.provider_id ? appointment.user_id : appointment.provider_id;
		const notification = {
			createdAt: appointment.canceled_at,
			content: message,
			user: userId,
			read: false,
			...appointment,
		};
		firebaseService.pushData(`notifications/user-${userId}`, notification);
	}

	return (
		<Container title={title} loading={loading} showBack>
			{appointment.user && (
				<ContainerDetail>
					<Profile>
						<img src={appointment.user.url} alt={appointment.user.name} />
						<ProfileInfo>
							<strong>
								{appointment.titlePosition} {appointment.user.name}
							</strong>
							<strong>
								<a href={`mailto:${appointment.user.email}`}>{appointment.user.email}</a>
							</strong>
							{appointment.user.crm && (
								<div>
									<p>CRM {appointment.user.crm}</p>
								</div>
							)}
							<div>
								<p>
									<FaWhatsapp size={20} />
									<a href={appointment.urlWhatsapp} target="_blank">
										{appointment.user.whatsapp}
									</a>
								</p>
							</div>
						</ProfileInfo>
					</Profile>
					<Appointment>
						<h2>Especialidade {appointment.speciality.type.name}</h2>
						<div>
							<p>{appointment.priceFormated}</p>
							{appointment.canceled_at && <strong>CANCELADO</strong>}
							{!appointment.canceled_at && (
								<Chip
									icon={<FiCalendar size={20} />}
									label="Cancelar"
									onDelete={handleCancelAppointment}
									color="secondary"
								/>
							)}
						</div>

						<p>{`Local do atendimento ${appointment.speciality.street} ${appointment.speciality.neighborhood} ${appointment.speciality.city} ${appointment.speciality.neighborhood} ${appointment.speciality.complement}`}</p>
						<p>{appointment.speciality.description}</p>
					</Appointment>
				</ContainerDetail>
			)}
		</Container>
	);
}

export default Details;
