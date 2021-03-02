import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
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
import BackPage from 'components/BackPage';
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
		setDate(subDays(date, 1));
	}

	function handleNextDay() {
		setDate(addDays(date, 1));
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

	return (
		<Container title={`Agenda`} loading={loading}>
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
							<Time
								key={schedule.time}
								available={!schedule.available}
								onClick={() => handleAddAppointment(schedule)}
							>
								<strong>{schedule.time}</strong>
							</Time>
						))}
					</ul>
				</Shedule>
			</SheduleContainer>
		</Container>
	);
}

export default CreateEdit;
