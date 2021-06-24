import React from 'react';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Container } from './styles';

function Card({ route, loaded, text, title, icon, total }) {
	return (
		<Link to={`/${route}`}>
			<Container loading={!loaded ? loaded.toString() : undefined} total={total}>
				<header>
					<p>{title}</p>
					{icon}
				</header>
				<h2>{loaded ? text : <CircularProgress size={26} />}</h2>
			</Container>
		</Link>
	);
}

export default Card;
