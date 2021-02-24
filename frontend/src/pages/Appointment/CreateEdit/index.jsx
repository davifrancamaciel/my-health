import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
} from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import pt from 'date-fns/locale/pt';
import api from 'services/api';

import { PRIMARY_COLOR } from 'constants/colors';
import Container from 'components/_layouts/Container';
import BackPage from 'components/BackPage';
import { SheduleContainer, Time, Shedule, Profile, ProfileInfo } from './styles';

const range = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

function CreateEdit() {
	const { specialityId } = useParams();
	const [date, setDate] = useState(new Date());
	const [loading, setLoading] = useState(false);
	const [schedules, setSchedules] = useState([]);
	const dateFormated = useMemo(() => format(date, "d 'de' MMMM", { locale: pt }), [date]);
	const [specialityProvider, setSpecialityProvider] = useState({});

	useEffect(() => {
		async function loadSchedule() {
			setLoading(true);
			const response = await api.get('schedule', {
				params: {
					date,
				},
			});

			const responseUser = await api.get(`speciality-provider/${specialityId}`);
			console.log(responseUser.data);
			setSpecialityProvider(responseUser.data);

			const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

			console.log(response.data);

			const data = range.map((hour) => {
				const checkDate = setMilliseconds(setSeconds(setMinutes(setHours(date, hour), 0), 0), 0);
				const compareDate = utcToZonedTime(checkDate, timezone);
				return {
					time: `${hour}:00h`,
					past: isBefore(compareDate, new Date()),
					apponitment: response.data.find((a) => isEqual(parseISO(a.date), compareDate)),
				};
			});
			console.log(data);
			setSchedules(data);
			setLoading(false);
		}
		loadSchedule();
	}, [date]);

	useEffect(() => {
		async function loadAvailable() {
			const response = await api.get(`/available/providers/${specialityId}`, {
				params: {
					date: date.getTime(),
				},
			});
			console.log(response.data);
			// setHours(response.data);
		}
		loadAvailable();
	}, [date, specialityId]);

	function handlePrevDay() {
		setDate(subDays(date, 1));
	}

	function handleNextDay() {
		setDate(addDays(date, 1));
	}

	return (
		<Container title={`Agenda`} loading={loading}>
			<SheduleContainer>
				{specialityProvider.user && (
					<Profile>
						<img src={specialityProvider.user.url} alt={specialityProvider.user.name} />
						<ProfileInfo>
							<strong>{specialityProvider.user.name}</strong>
							<div>
								<p>{specialityProvider.user.email}</p>
							</div>
							<div>
								<p>CRM {specialityProvider.user.crm}</p>
							</div>
							<div>
								<p>{specialityProvider.user.whatsapp}</p>
								<p>R$ {specialityProvider.value}</p>
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
							<Time key={schedule.time} past={schedule.past} available={!schedule.apponitment}>
								<strong>{schedule.time}</strong>
								<span>{schedule.apponitment ? schedule.apponitment.user.name : 'Em aberto'}</span>
							</Time>
						))}
					</ul>
				</Shedule>
			</SheduleContainer>
		</Container>
	);
}

export default CreateEdit;
