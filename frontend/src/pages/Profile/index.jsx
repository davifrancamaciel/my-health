import React, { useState } from 'react';
import { FiUser, FiLock } from 'react-icons/fi';
import { GrMapLocation } from 'react-icons/gr';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import BackPage from 'components/BackPage';
import Adress from './Tabs/Adress';
import Password from './Tabs/Password';
import PersonalData from './Tabs/PersonalData';

import { Container, TabsContainer } from './styles';

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`scrollable-force-tabpanel-${index}`}
			aria-labelledby={`scrollable-force-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};

function a11yProps(index) {
	return {
		id: `scrollable-force-tab-${index}`,
		'aria-controls': `scrollable-force-tabpanel-${index}`,
	};
}

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		width: '100%',
		backgroundColor: theme.palette.background.paper,
	},
}));

function Profile() {
	const classes = useStyles();
	const [value, setValue] = useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<Container>
			<div className="as-title">
				<h1>Minha conta</h1>
				<BackPage />
			</div>
			<TabsContainer>
				<AppBar position="static" color="#fff" elevation={0}>
					<Tabs
						value={value}
						onChange={handleChange}
						variant="scrollable"
						scrollButtons="on"
						indicatorColor="primary"
						textColor="primary"
						variant="fullWidth"
						aria-label="full width tabs example"
					>
						<Tab icon={<FiUser />} label="Dados pessoais" {...a11yProps(0)} />
						<Tab icon={<GrMapLocation />} label="Endereço" {...a11yProps(1)} />
						<Tab icon={<FiLock />} label="Senha" {...a11yProps(2)} />
					</Tabs>
				</AppBar>
				<div className={classes.root}>
					<TabPanel value={value} index={0}>
						<PersonalData />
					</TabPanel>
					<TabPanel value={value} index={1}>
						<Adress />
					</TabPanel>
					<TabPanel value={value} index={2}>
						<Password />
					</TabPanel>
				</div>
			</TabsContainer>
		</Container>
	);
}

export default Profile;
