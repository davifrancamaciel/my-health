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

	const handleClickItem = (option) => {
		setAnchorEl(null);
		switch (option) {
			case 'logout':
				dispatch(signOut());
				break;
			default:
				history.push(`/${option}`);
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
				onClose={() => setAnchorEl(null)}
			>
				<MenuItem onClick={() => handleClickItem('profile')}>Minha conta</MenuItem>
				<MenuItem onClick={() => handleClickItem('schedule')}>Minha agenda</MenuItem>
				{profile.provider && (
					<>
						<MenuItem onClick={() => handleClickItem('speciality')}>Minhas especialidades</MenuItem>
						<MenuItem onClick={() => handleClickItem('report')}>Relatórios</MenuItem>
					</>
				)}
				<MenuItem id="logout" onClick={() => handleClickItem('logout')}>
					Sair
				</MenuItem>
			</Menu>
		</div>
	);
}
