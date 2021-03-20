import {
	subDays,
	addDays,
	isMonday,
	isTuesday,
	isWednesday,
	isThursday,
	isFriday,
	isSaturday,
	isSunday,
} from 'date-fns';

export function setNextDate(date, schedule) {
	const nextDate = addDays(date, 1);
	if (!availableDay(nextDate, schedule)) {
		return setNextDate(nextDate, schedule);
	} else {
		return nextDate;
	}
}

export function setPrevtDate(date, schedule) {
	const prevDate = subDays(date, 1);
	if (!availableDay(prevDate, schedule)) {
		return setPrevtDate(prevDate, schedule);
	} else {
		return prevDate;
	}
}

function availableDay(date, schedule) {
	if (isMonday(date)) {
		const monday = schedule.find((x) => x.day === 'Segunda');
		return monday.available;
	}
	if (isTuesday(date)) {
		const tuesday = schedule.find((x) => x.day === 'Terça');
		return tuesday.available;
	}
	if (isWednesday(date)) {
		const wednesday = schedule.find((x) => x.day === 'Quarta');
		return wednesday.available;
	}
	if (isThursday(date)) {
		const thursday = schedule.find((x) => x.day === 'Quinta');
		return thursday.available;
	}
	if (isFriday(date)) {
		const friday = schedule.find((x) => x.day === 'Sexta');
		return friday.available;
	}
	if (isSaturday(date)) {
		const saturday = schedule.find((x) => x.day === 'Sábado');
		return saturday.available;
	}
	if (isSunday(date)) {
		return false;
	}
}
