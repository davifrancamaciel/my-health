import React, { useState, useEffect } from 'react';

import Modal from 'components/Modal';

import { userTerm, providerTerm } from './data';
// import { Container } from './styles';

function Term({ provider, open, setOpen }) {
	const [text, setText] = useState('');
	const [title, setTitle] = useState('');
	useEffect(() => {
		if (provider) {
			setTitle('Termo de adesão para proficionais da saúde');
			setText(providerTerm);
		} else {
			setTitle('Termo de adesão para pacientes');
			setText(userTerm);
		}
	}, [provider]);

	return <Modal open={open} setOpen={setOpen} title={title} text={text} />;
}

export default Term;
