import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip, Marker } from 'react-leaflet';
import { FaWhatsapp } from 'react-icons/fa';
import { FiCalendar } from 'react-icons/fi';

import { PopupCustom, Card, Info } from './styles';

function MarkerContainer({ item }) {
	return (
		<Marker position={[item.latitude, item.longitude]}>
			<PopupCustom>
				<Card>
					<header>
						<img src={item.user.url} alt={item.user.name} />
						<Info>
							<strong>{item.user.name}</strong>
							<span>{item.user.email}</span>
						</Info>
					</header>
					<p>
						<span>
							<FaWhatsapp size={20} />
							<a href={item.urlWhatsapp} target="_blank">
								{item.user.whatsapp}
							</a>
						</span>
						<span>
							<FiCalendar size={20} />
							<Link to={`/appointment/${item.id}/create`}>Agendar</Link>
						</span>
					</p>
				</Card>
			</PopupCustom>
			<Tooltip>{item.user.name}</Tooltip>
		</Marker>
	);
}

export default MarkerContainer;
