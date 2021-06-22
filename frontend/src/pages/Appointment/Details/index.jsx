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
import { getType } from 'Utils/typeSegmentsConstants';

import Container from 'components/_layouts/Container';
import { ContainerDetail, Appointment, ProfileInfo, Profile } from './styles';

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
			const { data } = await api.get(`/appointments/${id}`);

			let toAppointmentProfile = 'provider';
			let titlePosition = 'Médico';
			if (data.provider_id == profile.id) {
				toAppointmentProfile = 'user';
				titlePosition = 'Paciente';
			}
			const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			const date = utcToZonedTime(parseISO(data.date), timezone);

			const dateFormatedComplete = format(date, "'dia' dd 'de' MMMM 'de' yyyy',' eeee', às' H:mm'h'", {
				locale: pt,
			});

			const { speciality } = data;

			const dataFormated = {
				...data,
				speciality: {
					...speciality,
					type: {
						...speciality.type,
						segment: {
							...speciality.type.segment,
							name: `${getType(
								speciality.type.segment.type
							)} ${speciality.type.segment.name.toLowerCase()}`,
						},
					},
				},
				priceFormated: formatPrice(data.value),
				urlWhatsapp: urlMessageWhatsapp(data[toAppointmentProfile].whatsapp),
				user: data[toAppointmentProfile],
				titlePosition,
				dateFormatedComplete,
			};

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

			const response = await api.delete(`appointments/${appointment.id}`, {
				data: { dateFormatedComplete: appointment.dateFormatedComplete },
			});

			addNotification({ ...response.data, dateFormatedComplete: appointment.dateFormatedComplete });
			setAppointment({ ...appointment, canceled_at: response.data.canceled_at });
			showToast.success(`Agendamento ${appointment.dateFormatedComplete} CANCELADO com sucesso`);
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
		<Container title={'Agendamento'} loading={loading} showBack>
			{appointment.user && (
				<ContainerDetail>
					<header>
						<div>
							<h2>Especialidade {appointment.speciality.type.name}</h2>
							<h5>Segmento {appointment.speciality.type.segment.name}</h5>
						</div>
						{!appointment.canceled_at && (
							<Chip
								icon={<FiCalendar size={20} />}
								label="Cancelar agendamento"
								onDelete={handleCancelAppointment}
								color="secondary"
							/>
						)}
						{appointment.canceled_at && <strong>CANCELADO</strong>}
					</header>
					<div>
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
							<strong>Agendado para {appointment.dateFormatedComplete}</strong>
							<p>{appointment.priceFormated}</p>
							<p>{`Local do atendimento ${appointment.speciality.street} ${appointment.speciality.neighborhood} ${appointment.speciality.city} ${appointment.speciality.neighborhood} ${appointment.speciality.complement}`}</p>
						</Appointment>
					</div>
					<div>
						<p>{appointment.speciality.description}</p>
					</div>
				</ContainerDetail>
			)}
		</Container>
	);
}

export default Details;
