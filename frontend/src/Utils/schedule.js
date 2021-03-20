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

export const schedule = [
	{ time: '08:00', available: true },
	{ time: '08:30', available: true },
	{ time: '09:00', available: true },
	{ time: '09:30', available: true },
	{ time: '10:00', available: true },
	{ time: '10:30', available: true },
	{ time: '11:00', available: true },
	{ time: '11:30', available: true },
	{ time: '12:00', available: false },
	{ time: '12:30', available: false },
	{ time: '13:00', available: false },
	{ time: '13:30', available: false },
	{ time: '14:00', available: true },
	{ time: '14:30', available: true },
	{ time: '15:00', available: true },
	{ time: '15:30', available: true },
	{ time: '16:00', available: true },
	{ time: '16:30', available: true },
	{ time: '17:00', available: true },
	{ time: '17:30', available: true },
	{ time: '18:00', available: false },
	{ time: '18:30', available: false },
	{ time: '19:00', available: false },
	{ time: '19:30', available: false },
];

const enumDaysWeek = {
	MONDAY: 'Segunda',
	TUESDAY: 'Terça',
	WEDNESDAY: 'Quarta',
	THURSDAY: 'Quinta',
	FRIDAY: 'Sexta',
	SATURDAY: 'Sábado',
	SUNDAY: 'Domingo',
};

export const daysWeek = [
	{ day: enumDaysWeek.MONDAY, available: true },
	{ day: enumDaysWeek.TUESDAY, available: true },
	{ day: enumDaysWeek.WEDNESDAY, available: true },
	{ day: enumDaysWeek.THURSDAY, available: true },
	{ day: enumDaysWeek.FRIDAY, available: true },
	{ day: enumDaysWeek.SATURDAY, available: false },
];

export function setNextDate(date, scheduleDaysProvider) {
	const nextDate = addDays(date, 1);
	if (!availableDay(nextDate, scheduleDaysProvider)) {
		return setNextDate(nextDate, scheduleDaysProvider);
	} else {
		return nextDate;
	}
}

export function setPrevtDate(date, scheduleDaysProvider) {
	const prevDate = subDays(date, 1);
	if (!availableDay(prevDate, scheduleDaysProvider)) {
		return setPrevtDate(prevDate, scheduleDaysProvider);
	} else {
		return prevDate;
	}
}

function availableDay(date, scheduleDaysProvider) {
	if (!scheduleDaysProvider) {
		scheduleDaysProvider = daysWeek;
	}
	if (isMonday(date)) {
		const monday = scheduleDaysProvider.find((x) => x.day === enumDaysWeek.MONDAY);
		return monday.available;
	}
	if (isTuesday(date)) {
		const tuesday = scheduleDaysProvider.find((x) => x.day === enumDaysWeek.TUESDAY);
		return tuesday.available;
	}
	if (isWednesday(date)) {
		const wednesday = scheduleDaysProvider.find((x) => x.day === enumDaysWeek.WEDNESDAY);
		return wednesday.available;
	}
	if (isThursday(date)) {
		const thursday = scheduleDaysProvider.find((x) => x.day === enumDaysWeek.THURSDAY);
		return thursday.available;
	}
	if (isFriday(date)) {
		const friday = scheduleDaysProvider.find((x) => x.day === enumDaysWeek.FRIDAY);
		return friday.available;
	}
	if (isSaturday(date)) {
		const saturday = scheduleDaysProvider.find((x) => x.day === enumDaysWeek.SATURDAY);
		return saturday.available;
	}
	if (isSunday(date)) {
		return false;
	}
}
