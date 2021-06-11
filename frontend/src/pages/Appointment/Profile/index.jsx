import React from 'react';

import { FaWhatsapp } from 'react-icons/fa';

import { Container, ProfileInfo } from './styles';

function Profile({ profile }) {
	return (
		<Container>
			<img src={profile.user.url} alt={profile.user.name} />
			<ProfileInfo>
				<strong>Segmento {profile.type.segment.name}</strong>
				<strong>Especialidade {profile.type.name}</strong>
				<strong>{profile.user.name}</strong>
				<strong>
					<a href={`mailto:${profile.user.email}`}>{profile.user.email}</a>
				</strong>
				{profile.user.crm && (
					<div>
						<p>CRM {profile.user.crm}</p>
					</div>
				)}
				<div>
					<p>
						<FaWhatsapp size={20} />
						<a href={profile.urlWhatsapp} target="_blank">
							{profile.user.whatsapp}
						</a>
					</p>
					<p>{profile.priceFormated}</p>
				</div>
				<p>{profile.description}</p>
				<p>
					{profile.street} {profile.neighborhood} {profile.city} {profile.neighborhood} {profile.complement}
				</p>
			</ProfileInfo>
		</Container>
	);
}

export default Profile;
