import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip, Marker } from 'react-leaflet';
import { FaWhatsapp } from 'react-icons/fa';
import { FiCalendar } from 'react-icons/fi';

import { PopupCustom, Card, Info } from './styles';

function MarkerContainer({ positions }) {
	return (
		<>
			{positions.map((item, index) => (
				<Marker key={index} position={[item.latitude, item.longitude]}>
					{item.url && (
						<PopupCustom>
							<Card>
								<header>
									<img src={item.url} alt={item.name} />
									<Info>
										<strong>{item.name}</strong>
										<span>{item.email}</span>
									</Info>
								</header>
								<p>
									<span>
										<FaWhatsapp size={20} />
										<a href={item.urlWhatsapp} target="_blank">
											{item.whatsapp}
										</a>
									</span>
									{item.urlAppointment && (
										<span>
											<FiCalendar size={20} />
											<Link to={item.urlAppointment}>Agendar</Link>
										</span>
									)}
								</p>
							</Card>
						</PopupCustom>
					)}
					{item.name && <Tooltip>{item.name}</Tooltip>}
				</Marker>
			))}
		</>
	);
}

export default MarkerContainer;
