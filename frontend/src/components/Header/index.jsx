import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AiOutlineMedicineBox, AiFillDashboard } from 'react-icons/ai';

import Drawer from '../Drawer';
import ProfileMenu from './ProfileMenu';
import SystemMenu from './SystemMenu';
import Notifications from './Notifications';

import logo from 'assets/logoupish.png';
import getImage from 'Utils/getImage';
import roulesEnum from 'enums/roulesEnum';
import { Container, Content, Profile } from './styles';

const itensMenu = [
	{
		path: 'dashboard',
		label: 'Dashboard',
		provider: 'true',
		icon: <AiFillDashboard size={26} size={26} />,
	},
	{
		path: 'appointment',
		label: 'Especialidades',
		provider: 'false|true',
		icon: <AiOutlineMedicineBox size={26} />,
	},
];

const Header = () => {
	const [itensMenuUser, setItensMenuUser] = useState([]);
	const profile = useSelector((state) => state.user.profile);
	const profileFormated = {
		...profile,
		name: profile.name.split(' ')[0],
		image: getImage(profile.image, profile.name),
	};

	useEffect(() => {
		setItensMenuUser(itensMenu.filter((i) => i.provider.includes(profile.provider.toString())));
	}, [profile]);

	return (
		<Container>
			<Content>
				<nav>
					<Link to="/dashboard" className={'as-items-menu'}>
						<img src={logo} alt="UPIS Saúde" />
					</Link>
					<Drawer itensMenuUser={itensMenuUser} />
					{itensMenuUser.map((i) => (
						<Link key={i.label} to={`/${i.path}`} className={'as-items-menu'}>
							{i.label}
						</Link>
					))}
					{profile.roules === roulesEnum.ADMIN && <SystemMenu />}
				</nav>
				<aside>
					<Notifications />
					<Profile>
						<div>
							<strong>{profileFormated.name}</strong>
							<ProfileMenu />
						</div>
						<img src={profileFormated.image} alt={profileFormated.name} />
					</Profile>
				</aside>
			</Content>
		</Container>
	);
};

export default Header;
