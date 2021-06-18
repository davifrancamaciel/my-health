import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { FcCancel } from 'react-icons/fc';
import {
	format,
	parseISO,
	formatRelative,
	isEqual,
	isAfter,
	startOfDay,
	setHours,
	setMinutes,
	setSeconds,
	setMilliseconds,
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
import Profile from '../Profile';
import showToast from 'Utils/showToast';
import ShowConfirm from 'components/ShowConfirm';
import { getTypesSegment } from 'Utils/typeSegmentsConstants';
import { setNextDate, setPrevtDate, availableDay } from 'Utils/schedule';
import { SheduleContainer, Time, Shedule } from './styles';

function CreateEdit() {
	const profile = useSelector((state) => state.user.profile);
	const notificationsList = useSelector((state) => state.notification.list);

	const { specialityId } = useParams();
	const [date, setDate] = useState(new Date());
	const [loading, setLoading] = useState(false);
	const [schedules, setSchedules] = useState([]);
	const dateFormated = useMemo(() => format(date, "eeee',' d 'de' MMMM", { locale: pt }), [date]);
	const [specialityProvider, setSpecialityProvider] = useState({});

	useEffect(() => {
		async function loadProfile() {
			try {
				setLoading(true);

				const { data } = await api.get(`speciality-provider/${specialityId}`);
				const type = getTypesSegment().find((x) => x.value === data.type.segment.type).label;
				
				setSpecialityProvider({
					...data,
					type: {
						...data.type,
						segment: {
							...data.type.segment,
							name: `${type} ${data.type.segment.name.toLowerCase()}`,
						},
					},
					priceFormated: formatPrice(data.type.value),
					urlWhatsapp: urlMessageWhatsapp(data.user.whatsapp),
				});

				if (!availableDay(date, data.schedule)) {
					setDate(setNextDate(date, data.schedule));
				} else {
					loadSchedule(date);
				}
				setLoading(false);
			} catch (error) {
				setLoading(false);
				getValidationErrors(error);
			}
		}
		loadProfile();
	}, []);

	useEffect(() => {
		const [notification] = notificationsList;
		if (notification && isEqual(startOfDay(date), startOfDay(parseISO(notification.date))) && !notification.read) {
			loadSchedule(date);
		}
	}, [notificationsList]);

	useEffect(() => {
		specialityProvider.schedule && loadSchedule(date);
	}, [date]);

	const handlePrevDay = () => setDate(setPrevtDate(date, specialityProvider.schedule));

	const handleNextDay = () => setDate(setNextDate(date, specialityProvider.schedule));

	async function loadSchedule(date) {
		try {
			setLoading(true);
			const response = await api.get(`/available/providers/${specialityId}`, {
				params: { date: startOfDay(date) },
			});

			const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

			const data = response.data.available.map((time) => {
				const [hour, minute] = time.time.split(':');

				const checkDate = setMilliseconds(setSeconds(setMinutes(setHours(date, hour), minute), 0), 0);
				const compareDate = utcToZonedTime(checkDate, timezone);
				const appointment = response.data.appointments.find((a) => isEqual(parseISO(a.date), compareDate));

				return {
					time: `${hour}:${minute}h`,
					value: format(checkDate, "yyyy-MM-dd'T'HH:mm:ssxxx"),
					available:
						isAfter(checkDate, new Date()) &&
						!response.data.appointments.find((a) => format(parseISO(a.date), 'HH:mm') === time.time),
					isMine: appointment && appointment.user_id === profile.id ? true : false,
					id: appointment && appointment.user_id === profile.id && appointment.id,
					appointment: appointment && appointment.user_id === profile.id ? appointment : {},
				};
			});

			setSchedules(data);

			setLoading(false);
		} catch (error) {
			setLoading(false);
			getValidationErrors(error);
		}
	}

	function handleAddAppointment(schedule) {
		if (!schedule.available) {
			showToast.warning('Este horário não está mais disponível');
			return;
		}
		ShowConfirm(
			'Atenção',
			`Confirma o agendamento com o médico <h2>${specialityProvider.user.name}</h2> no horário de <h2>${schedule.time}</h2> e valor de ${specialityProvider.priceFormated}?`,
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
				speciality: specialityProvider.type.name,
				dateFormated: formatRelative(parseISO(schedule.value), new Date(), { locale: pt }),
				dateFormatedComplete: format(parseISO(schedule.value), "'dia' dd 'de' MMMM',' eeee', às' H:mm'h'", {
					locale: pt,
				}),
			};

			setLoading(true);
			const responseCreate = await api.post('appointments', newAppointment);

			showToast.success(`Agendamento criado com sucesso para ${newAppointment.dateFormated}`);

			loadSchedule(date);

			addNotification({ ...newAppointment, ...responseCreate.data });
		} catch (error) {
			setLoading(false);
			getValidationErrors(error);
		}
	}

	function addNotification(data) {
		const notification = {
			...data,
			content: `Novo agendamento de ${data.speciality} com ${profile.name} para ${data.dateFormatedComplete}`,
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
			`Confirma o cancelamemto do agendamento com médico <h2>${schedule.appointment.provider.name}</h2> no horário de <h2>${schedule.time}?</h2>`,
			() => handleCancelAppointmentConfirmed(schedule)
		);
	}

	async function handleCancelAppointmentConfirmed(schedule) {
		try {
			setLoading(true);

			const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			const date = utcToZonedTime(parseISO(schedule.value), timezone);

			const dateFormatedComplete = format(date, "'dia' dd 'de' MMMM',' eeee', às' H:mm'h'", {
				locale: pt,
			});

			const response = await api.delete(`appointments/${schedule.appointment.id}`, {
				data: { dateFormatedComplete },
			});

			addNotificationCancel({ ...response.data, dateFormatedComplete });

			loadSchedule(date);

			showToast.success(`Agendamento de ${schedule.time}h CANCELADO com sucesso`);
		} catch (error) {
			setLoading(false);
			getValidationErrors(error);
		}
	}

	function addNotificationCancel(appointment) {
		const notification = {
			createdAt: appointment.canceled_at,
			content: `Consulta CANCELADA para ${appointment.speciality.type.name} com ${appointment.user.name} para ${appointment.dateFormatedComplete}`,
			user: appointment.provider_id,
			read: false,
			...appointment,
		};
		firebaseService.pushData(`notifications/user-${appointment.provider_id}`, notification);
	}

	return (
		<Container title={`Agenda do médico`} loading={loading} showBack>
			<SheduleContainer>
				{specialityProvider.user && <Profile profile={specialityProvider} />}
				<Shedule>
					{specialityProvider.schedule && (
						<header>
							<button type="button" onClick={handlePrevDay}>
								<MdChevronLeft color={PRIMARY_COLOR} size={36} />
							</button>
							<strong>{dateFormated}</strong>
							<button type="button" onClick={handleNextDay}>
								<MdChevronRight color={PRIMARY_COLOR} size={36} />
							</button>
						</header>
					)}
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
