import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
	isSaturday,
	isSunday,
} from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import pt from 'date-fns/locale/pt';
import api from 'services/api';
import firebaseService from 'services/firebase';

import { PRIMARY_COLOR } from 'constants/colors';
import Container from 'components/_layouts/Container';
import ShowConfirm from 'components/ShowConfirm';
import showToast from 'Utils/showToast';
import getValidationErrors from 'Utils/getValidationErrors';
import { SheduleContainer, Time } from './styles';

const range = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

function Shedule() {
	const profile = useSelector((state) => state.user.profile);

	const [date, setDate] = useState(new Date());
	const [loading, setLoading] = useState(false);
	const [schedules, setSchedules] = useState([]);
	const dateFormated = useMemo(() => format(date, "d 'de' MMMM", { locale: pt }), [date]);

	useEffect(() => {
		loadSchedule();
	}, [date]);

	async function loadSchedule() {
		setLoading(true);
		const response = await api.get('schedule', {
			params: {
				date,
			},
		});

		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

		const data = range.map((hour) => {
			const checkDate = setMilliseconds(setSeconds(setMinutes(setHours(date, hour), 0), 0), 0);
			const compareDate = utcToZonedTime(checkDate, timezone);
			const appointment = response.data.find((a) => isEqual(parseISO(a.date), compareDate));

			let toAppointmentProfile = 'provider';
			let titlePosition = 'Médico';
			if (appointment && appointment.provider_id == profile.id) {
				toAppointmentProfile = 'user';
				titlePosition = 'Paciente';
			}
			return {
				time: `${hour}:00h`,
				past: isBefore(compareDate, new Date()),
				appointment: appointment,
				scheduledWithUser: appointment && appointment[toAppointmentProfile],
				titlePosition,
			};
		});

		setSchedules(data);
		setLoading(false);
	}

	function handlePrevDay() {
		const nextDate = subDays(date, 1);
		let daysSub = 1;
		if (isSunday(nextDate)) {
			daysSub = 3;
		}
		setDate(subDays(date, daysSub));
	}

	function handleNextDay() {
		const nextDate = addDays(date, 1);
		let daysAdd = 1;
		if (isSaturday(nextDate)) {
			daysAdd = 3;
		}
		setDate(addDays(date, daysAdd));
	}

	function handleCancelAppointment(schedule) {
		if (!schedule.appointment.cancelable) {
			showToast.warning('Este agendamento só pode ser cancelado até 2h antes');
			return;
		}
		ShowConfirm(
			'Atenção',
			`Confirma o cancelamemto do agendamento com ${schedule.titlePosition.toLowerCase()} ${
				schedule.scheduledWithUser.name
			} no horário de ${schedule.time}?`,
			() => handleCancelAppointmentConfirmed(schedule)
		);
	}

	async function handleCancelAppointmentConfirmed(schedule) {
		try {
			setLoading(true);
			const response = await api.delete(`appointments/${schedule.appointment.id}`);
			addNotification(response.data);
			loadSchedule();
			showToast.success(`Agendamento de ${schedule.time} CANCELADO com sucesso`);
		} catch (error) {
			setLoading(false);
			getValidationErrors(error);
		}
	}

	function addNotification(data) {
		const { appointment, formatedDate } = data;
		let message = '';
		if (profile.id === appointment.provider_id) {
			message = `Consulta CANCELADA para ${appointment.speciality.type.name} agendada com ${appointment.provider.name} para o ${formatedDate}`;
		}
		if (profile.id === appointment.user_id) {
			message = `Consulta CANCELADA para ${appointment.speciality.type.name} com ${appointment.user.name} para o ${formatedDate}`;
		}

		const userId = profile.id === appointment.provider_id ? appointment.user_id : appointment.provider_id;
		const notification = {
			createdAt: appointment.canceled_at,
			content: message,
			user: userId,
			read: false,
		};
		firebaseService.pushData(`notifications/user-${userId}`, notification);
	}

	return (
		<Container title={`Meus agendamentos`} loading={loading} showBack>
			<SheduleContainer>
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
						<Time
							key={schedule.time}
							past={schedule.past}
							available={!schedule.appointment}
							scheduledWithUser={schedule.titlePosition}
							provider={profile.provider}
						>
							<div>
								<strong>{schedule.time}</strong>
								<span>
									{schedule.scheduledWithUser
										? `${schedule.titlePosition} ${schedule.scheduledWithUser.name}`
										: 'Em aberto'}
								</span>
								{schedule.scheduledWithUser && <span>{schedule.appointment.speciality.type.name}</span>}
							</div>
							{schedule.scheduledWithUser && (
								<img src={schedule.scheduledWithUser.url} alt={schedule.scheduledWithUser.name} />
							)}
							{schedule.appointment && (
								<button title="Cancelar agendamento" onClick={() => handleCancelAppointment(schedule)}>
									<FcCancel size={20} color="#fff" />
								</button>
							)}
						</Time>
					))}
				</ul>
			</SheduleContainer>
		</Container>
	);
}

export default Shedule;
