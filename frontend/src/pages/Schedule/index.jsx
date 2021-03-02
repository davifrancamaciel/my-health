import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
	isSaturday,
	isSunday,
} from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import pt from 'date-fns/locale/pt';
import api from 'services/api';

import { PRIMARY_COLOR } from 'constants/colors';
import Container from 'components/_layouts/Container';
import BackPage from 'components/BackPage';
import { SheduleContainer, Time } from './styles';

const range = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

function Shedule() {
	const profile = useSelector((state) => state.user.profile);

	const [date, setDate] = useState(new Date());
	const [loading, setLoading] = useState(false);
	const [schedules, setSchedules] = useState([]);
	const dateFormated = useMemo(() => format(date, "d 'de' MMMM", { locale: pt }), [date]);

	useEffect(() => {
		async function loadSchedule() {
			setLoading(true);
			const response = await api.get('schedule', {
				params: {
					date,
				},
			});
			console.log(profile);
			console.log(response.data);
			const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

			const data = range.map((hour) => {
				const checkDate = setMilliseconds(setSeconds(setMinutes(setHours(date, hour), 0), 0), 0);
				const compareDate = utcToZonedTime(checkDate, timezone);
				return {
					time: `${hour}:00h`,
					past: isBefore(compareDate, new Date()),
					apponitment: response.data.find((a) => isEqual(parseISO(a.date), compareDate)),
				};
			});

			setSchedules(data);
			setLoading(false);
		}
		loadSchedule();
	}, [date]);

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

	return (
		<Container title={`Minha agenda`} loading={loading}>
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
						<Time key={schedule.time} past={schedule.past} available={!schedule.apponitment}>
							<div>
								<strong>{schedule.time}</strong>
								<span>{schedule.apponitment ? schedule.apponitment.user.name : 'Em aberto'}</span>
								{schedule.apponitment && <span>{schedule.apponitment.speciality.type.name}</span>}
							</div>
							{schedule.apponitment && (
								<img src={schedule.apponitment.user.url} alt={schedule.apponitment.user.name} />
							)}
						</Time>
					))}
				</ul>
			</SheduleContainer>
		</Container>
	);
}

export default Shedule;
