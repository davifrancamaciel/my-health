import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import Route from './Route';

import Home from '../pages/Home';
import SignUp from '../pages/SignUp';
import SignIn from '../pages/SignIn';
import Forgot from '../pages/Forgot';
import Reset from '../pages/Reset';
import Dashboard from '../pages/Dashboard';

import UserList from '../pages/User/List';
import UserCreateEdit from '../pages/User/CreateEdit';

import SpecialityList from '../pages/Speciality/List';
import SpecialityCreateEdit from '../pages/Speciality/CreateEdit';

import SegmentList from '../pages/Segment/List';
import SegmentCreateEdit from '../pages/Segment/CreateEdit';

import CreditList from '../pages/Credit/List';
import CreditCreateEdit from '../pages/Credit/CreateEdit';

import SpecialityTypeList from '../pages/SpecialityType/List';
import SpecialityTypeCreateEdit from '../pages/SpecialityType/CreateEdit';

import Report from '../pages/Report';
import Schedule from '../pages/Schedule';
import Appointment from '../pages/Appointment/List';
import AppointmentCreateEdit from '../pages/Appointment/CreateEdit';
import AppointmentDatails from '../pages/Appointment/Details';

import Profile from '../pages/Profile';

const Routes = () => {
	return (
		<Switch>
			<Route exact path="/" component={Home} />
			<Route exact path="/login" component={SignIn} />

			<Route exact path="/register" component={SignUp} />
			<Route exact path="/register-provider" component={SignUp} />

			<Route exact path="/forgot" component={Forgot} />
			<Route exact path="/reset" component={Reset} />

			<Route exact path="/dashboard" component={Dashboard} isPrivate />

			<Route exact path="/appointment" component={Appointment} isPrivate />
			<Route exact path="/appointment/:specialityId/create" component={AppointmentCreateEdit} isPrivate />
			<Route exact path="/appointment/details/:id" component={AppointmentDatails} isPrivate />

			<Route exact path="/schedule" component={Schedule} isPrivate />

			<Route exact path="/profile" component={Profile} isPrivate />

			<Route exact path="/report" component={Report} isPrivate />

			<Route exact path="/speciality" component={SpecialityList} isPrivate />
			<Route exact path="/speciality/create" component={SpecialityCreateEdit} isPrivate />
			<Route exact path="/speciality/edit/:id" component={SpecialityCreateEdit} isPrivate />

			<Route exact path="/segment" component={SegmentList} isPrivate roules={'ADMIN'} />
			<Route exact path="/segment/create" component={SegmentCreateEdit} isPrivate roules={'ADMIN'} />
			<Route exact path="/segment/edit/:id" component={SegmentCreateEdit} isPrivate roules={'ADMIN'} />

			<Route exact path="/speciality-type" component={SpecialityTypeList} isPrivate roules={'ADMIN'} />
			<Route exact path="/speciality-type/create" component={SpecialityTypeCreateEdit} isPrivate roules={'ADMIN'} />
			<Route exact path="/speciality-type/edit/:id" component={SpecialityTypeCreateEdit} isPrivate roules={'ADMIN'} />

			<Route exact path="/user" component={UserList} isPrivate roules={'ADMIN'} />
			<Route exact path="/user/edit/:id" component={UserCreateEdit} isPrivate roules={'ADMIN'} />

			<Route exact path="/credit" component={CreditList} isPrivate roules={'ADMIN'} />
			<Route exact path="/credit/create" component={CreditCreateEdit} isPrivate roules={'ADMIN'} />
			<Route exact path="/credit/edit/:id" component={CreditCreateEdit} isPrivate roules={'ADMIN'} />

			<Redirect from="*" to="/?r=true" />
		</Switch>
	);
};

export default Routes;
