import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { FcCancel } from 'react-icons/fc';
import {
	format,
	subDays,
	addDays,
	setHours,
	setMinutes,
	setSeconds,
	setMilliseconds,
	isBefore,
	parseISO,
	isEqual,
	formatRelative,
	isMonday,
	isTuesday,
	isWednesday,
	isThursday,
	isFriday,
	isSaturday,
	isSunday,
} from 'date-fns';

import { utcToZonedTime } from 'date-fns-tz';
import pt from 'date-fns/locale/pt';
import api from 'services/api';
import getValidationErrors from 'Utils/getValidationErrors';
import urlMessageWhatsapp from 'Utils/urlMessageWhatsapp';
import { formatPrice } from 'Utils/formatPrice';
import firebaseService from 'services/firebase';

import { PRIMARY_COLOR } from 'constants/colors';
import Container from 'components/_layouts/Container';
import showToast from 'Utils/showToast';
import ShowConfirm from 'components/ShowConfirm';
import { SheduleContainer, Time, Shedule, Profile, ProfileInfo } from './styles';

function CreateEdit() {
	const profile = useSelector((state) => state.user.profile);
	const { specialityId } = useParams();
	const [date, setDate] = useState(new Date());
	const [loading, setLoading] = useState(false);
	const [schedules, setSchedules] = useState([]);
	const dateFormated = useMemo(() => format(date, "d 'de' MMMM", { locale: pt }), [date]);
	const [specialityProvider, setSpecialityProvider] = useState({});

	useEffect(() => {
		async function loadScheduleAndProfile() {
			try {
				setLoading(true);

				const [provider, shedule] = await Promise.all([
					api.get(`speciality-provider/${specialityId}`),
					api.get(`/available/providers/${specialityId}`, {
						params: {
							date: date.getTime(),
						},
					}),
				]);
				console.log(provider.data.schedule);

				setSpecialityProvider({
					...provider.data,
					priceFormated: formatPrice(provider.data.value),
					urlWhatsapp: urlMessageWhatsapp(provider.data.user.whatsapp),
				});
				setSchedules(shedule.data);

				setLoading(false);
			} catch (error) {
				setLoading(false);
				getValidationErrors(error);
			}
		}
		loadScheduleAndProfile();
	}, [date]);

	function handlePrevDay() {
		const nextDate = subDays(date, 1);
		let daysSub = 1;
		if (isSunday(nextDate)) {
			daysSub = 3;
		}
		setDate(subDays(date, daysSub));
		console.log(amountDays(nextDate));
	}

	function handleNextDay() {
		const nextDate = addDays(date, 1);
		let daysAdd = 1;
		if (isSaturday(nextDate)) {
			daysAdd = 3;
		}
		setDate(addDays(date, daysAdd));
		console.log(amountDays(nextDate));
	}

	function amountDays(date) {
		let days = 1;
		// debugger;
		if (isMonday(date)) {
			const monday = specialityProvider.schedule.find((x) => x.day === 'Segunda');
			if (!monday.available) {
				days = days + 1;
			}
		}
		if (isTuesday(date)) {
			const tuesday = specialityProvider.schedule.find((x) => x.day === 'Terça');
			if (!tuesday.available) {
				days = days + 1;
			}
		}
		if (isWednesday(date)) {
			const wednesday = specialityProvider.schedule.find((x) => x.day === 'Quarta');
			if (!wednesday.available) {
				days = days + 1;
			}
		}
		if (isThursday(date)) {
			const thursday = specialityProvider.schedule.find((x) => x.day === 'Quinta');
			if (!thursday.available) {
				days = days + 1;
			}
		}
		if (isFriday(date)) {
			const friday = specialityProvider.schedule.find((x) => x.day === 'Sexta');
			if (!friday.available) {
				days = days + 1;
			}
		}
		if (isSaturday(date)) {
			const saturday = specialityProvider.schedule.find((x) => x.day === 'Sábado');
			if (!saturday.available) {
				days = days + 1;
			}
		}
		if (isSunday(date)) {
			days = days + 1;
		}
		return days;
	}

	function handleAddAppointment(schedule) {
		if (!schedule.available) {
			showToast.warning('Este horário não está mais disponível');
			return;
		}
		ShowConfirm(
			'Atenção',
			`Confirma o agendamento com o médico ${specialityProvider.user.name} no valor de ${specialityProvider.priceFormated}?`,
			() => handleAddAppointmentConfirmed(schedule)
		);
	}

	async function handleAddAppointmentConfirmed(schedule) {
		try {
			const newAppointment = {
				...schedule,
				date: schedule.value,
				user_id: profile.id,
				provider_id: specialityProvider.user.id,
				speciality_id: specialityProvider.id,
				dateFormated: formatRelative(parseISO(schedule.value), new Date(), { locale: pt }),
				speciality: specialityProvider.type.name,
			};

			setLoading(true);
			const responseCreate = await api.post('appointments', newAppointment);
			const notification = {
				...newAppointment,
				...responseCreate.data,
			};
			addNotification(notification);

			const response = await api.get(`/available/providers/${specialityId}`, {
				params: { date: date.getTime() },
			});
			setSchedules(response.data);

			setLoading(false);
			showToast.success(`Agendamento criado com sucesso para ${newAppointment.dateFormated}`);
		} catch (error) {
			setLoading(false);
			getValidationErrors(error);
		}
	}

	async function addNotification(data) {
		const notification = {
			...data,
			content: `Novo agendamento de ${data.speciality} com ${profile.name} para ${data.dateFormated}`,
			user: data.provider_id,
			read: false,
		};
		firebaseService.pushData(`notifications/user-${data.provider_id}`, notification);
	}

	function handleCancelAppointment(schedule) {
		if (!schedule.isMine) {
			showToast.warning('Este agendamento só pode ser cancelado pelo paciente ou pelo próprio médico');
			return;
		}

		if (!schedule.appointment.cancelable) {
			showToast.warning('Este agendamento só pode ser cancelado até 2h antes');
			return;
		}
		ShowConfirm(
			'Atenção',
			`Confirma o cancelamemto do agendamento com médico ${schedule.appointment.provider.name} no horário de ${schedule.time}h?`,
			() => handleCancelAppointmentConfirmed(schedule)
		);
	}

	async function handleCancelAppointmentConfirmed(schedule) {
		try {
			setLoading(true);
			const responseCancel = await api.delete(`appointments/${schedule.appointment.id}`);
			addNotificationCancel(responseCancel.data);

			const response = await api.get(`/available/providers/${specialityId}`, {
				params: { date: date.getTime() },
			});
			setSchedules(response.data);

			setLoading(false);
			showToast.success(`Agendamento de ${schedule.time}h CANCELADO com sucesso`);
		} catch (error) {
			setLoading(false);
			getValidationErrors(error);
		}
	}

	function addNotificationCancel(data) {
		const { appointment, formatedDate } = data;

		const notification = {
			createdAt: appointment.canceled_at,
			content: `Consulta CANCELADA para ${appointment.speciality.type.name} com ${appointment.user.name} para o ${formatedDate}`,
			user: appointment.provider_id,
			read: false,
		};
		firebaseService.pushData(`notifications/user-${appointment.provider_id}`, notification);
	}

	return (
		<Container title={`Agenda do médico`} loading={loading} showBack>
			<SheduleContainer>
				{specialityProvider.user && (
					<Profile>
						<img src={specialityProvider.user.url} alt={specialityProvider.user.name} />
						<ProfileInfo>
							<strong>Especialidade {specialityProvider.type.name}</strong>
							<strong>{specialityProvider.user.name}</strong>
							<div>
								<p>{specialityProvider.user.email}</p>
							</div>
							{specialityProvider.user.crm && (
								<div>
									<p>CRM {specialityProvider.user.crm}</p>
								</div>
							)}
							<div>
								<p>
									<FaWhatsapp size={20} />
									<a href={specialityProvider.urlWhatsapp} target="_blank">
										{specialityProvider.user.whatsapp}
									</a>
								</p>
								<p>{specialityProvider.priceFormated}</p>
							</div>
							<p>{specialityProvider.description}</p>
							<p>
								{specialityProvider.street} {specialityProvider.neighborhood} {specialityProvider.city}{' '}
								{specialityProvider.neighborhood}
							</p>
						</ProfileInfo>
					</Profile>
				)}
				<Shedule>
					<header>
						<button type="button" onClick={handlePrevDay}>
							<MdChevronLeft color={PRIMARY_COLOR} size={36} />
						</button>
						<strong>{dateFormated}</strong>
						<button type="button" onClick={handleNextDay}>
							<MdChevronRight color={PRIMARY_COLOR} size={36} />
						</button>
					</header>
					<ul>
						{schedules.map((schedule) => (
							<Time key={schedule.time} available={!schedule.available}>
								<div onClick={() => handleAddAppointment(schedule)}>
									<strong>{schedule.time}</strong>
								</div>
								{schedule.isMine && (
									<button
										title="Cancelar agendamento"
										onClick={() => handleCancelAppointment(schedule)}
									>
										<FcCancel size={20} color="#fff" />
									</button>
								)}
							</Time>
						))}
					</ul>
				</Shedule>
			</SheduleContainer>
		</Container>
	);
}

export default CreateEdit;
