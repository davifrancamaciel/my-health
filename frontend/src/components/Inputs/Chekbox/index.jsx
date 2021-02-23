import React from 'react';
import { Checkbox as CheckboxUF, useField } from '@rocketseat/unform';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

// import { Container } from './styles';

function Chekbox() {
	return (
		<FormControlLabel
			control={<Checkbox checked={false} onChange={() => {}} name="provider" />}
			label="Desejo realizar consultas (sou um médico)"
		/>
	);
}

export default Chekbox;
