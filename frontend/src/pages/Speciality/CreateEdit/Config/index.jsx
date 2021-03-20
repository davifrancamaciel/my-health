import React from 'react';

import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';

import { Hours } from './styles';

function Config({ scheduleConfig, setScheduleConfig, daysWeekConfig, setDaysWeekConfig, active, setActive }) {
	const handleChangeSchedule = (event) => {
		setScheduleConfig(
			scheduleConfig.map((x) => ({
				...x,
				available: x.time === event.target.name ? event.target.checked : x.available,
			}))
		);
	};

	const handleChangeDays = (event) => {
		setDaysWeekConfig(
			daysWeekConfig.map((x) => ({
				...x,
				available: x.day === event.target.name ? event.target.checked : x.available,
			}))
		);
	};
	return (
		<FormControl component="fieldset">
			<legend>
				<h2>Configuração</h2>
			</legend>
			<FormLabel component="legend">Marque abaixo se esta especialidade está disponível</FormLabel>
			<Hours>
				<FormControlLabel
					control={
						<Switch color="primary" checked={active} onChange={() => setActive(!active)} name={`active`} />
					}
					label={`Disponível`}
				/>
			</Hours>
			<FormLabel component="legend">
				Marque abaixo os dias da semana que esta especialidade será disponibilizada
			</FormLabel>
			<Hours>
				{daysWeekConfig.map((x) => (
					<FormControlLabel
						key={x.day}
						control={
							<Switch
								color="primary"
								checked={x.available}
								onChange={handleChangeDays}
								name={`${x.day}`}
							/>
						}
						label={`${x.day}`}
					/>
				))}
			</Hours>
			<FormLabel component="legend">
				Marque abaixo os horários que esta especialidade será disponibilizada
			</FormLabel>
			<Hours>
				{scheduleConfig.map((x) => (
					<FormControlLabel
						key={x.time}
						control={
							<Switch
								color="primary"
								checked={x.available}
								onChange={handleChangeSchedule}
								name={`${x.time}`}
							/>
						}
						label={`${x.time}h`}
					/>
				))}
			</Hours>
			<FormHelperText>
				Caso não seja marcado ao menos um dia e um horário esta especialidade será insdisponibilizada
				automáticamente
			</FormHelperText>
		</FormControl>
	);
}

export default Config;
