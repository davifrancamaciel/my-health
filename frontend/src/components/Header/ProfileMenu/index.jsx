import React, { useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Link from '@material-ui/core/Link';
import { useDispatch, useSelector } from 'react-redux';

import { signOut } from 'store/modules/auth/actions';
import history from 'services/browserhistory';

export default function SimpleMenu() {
	const profile = useSelector((state) => state.user.profile);
	const dispatch = useDispatch();
	const [anchorEl, setAnchorEl] = useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = (option) => {
		setAnchorEl(null);
		switch (option) {
			case 'profile':
				history.push(`/profile`);
				break;
			case 'logout':
				dispatch(signOut());
				break;
			case 'speciality':
				history.push(`/speciality`);
				break;
			case 'schedule':
				history.push(`/schedule`);
				break;
			default:
				break;
		}
	};

	return (
		<div>
			<Link aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
				Meu perfil
			</Link>
			<Menu
				id="simple-menu"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={() => handleClose('')}
			>
				<MenuItem onClick={() => handleClose('profile')}>Minha conta</MenuItem>
				<MenuItem onClick={() => handleClose('schedule')}>Minha agenda</MenuItem>
				{profile.provider && <MenuItem onClick={() => handleClose('speciality')}>Especialidades</MenuItem>}
				<MenuItem onClick={() => handleClose('logout')}>Sair</MenuItem>
			</Menu>
		</div>
	);
}
