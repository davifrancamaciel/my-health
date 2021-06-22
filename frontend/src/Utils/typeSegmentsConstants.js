export function getTypesSegment() {
	return [
		{ value: 'ESP_CLINICA', label: 'Especialidades clinicas' },
		{ value: 'ODONTOLOGIA', label: 'Odontologia' },
		{ value: 'VETERINARIA', label: 'Veterinária' },
	];
}

export function getType(type) {
	const item = getTypesSegment().find((x) => x.value === type);
	if (item) return item.label;
	return '';
}
