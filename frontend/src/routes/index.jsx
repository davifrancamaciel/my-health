import React from 'react'
import { Switch, Redirect } from 'react-router-dom'
import Route from './Route'

import SignUp from '../pages/SignUp'
import SignIn from '../pages/SignIn'
import Forgot from '../pages/Forgot'
import Reset from '../pages/Reset'
import Dashboard from '../pages/Dashboard'
import CompanyList from '../pages/Company/List'
import CompanyCreateEdit from '../pages/Company/CreateEdit'
import UserList from '../pages/User/List'
import UserCreateEdit from '../pages/User/CreateEdit'
import ClientCreateEdit from '../pages/Client/CreateEdit'
// import VehicleList from '../pages/Vehicle/List'
// import VehicleCreateEdit from '../pages/Vehicle/CreateEdit'
import SpecialtyList from '../pages/Specialty/List'
import SpecialtyCreateEdit from '../pages/Specialty/CreateEdit'
// import SpecialtyVehicle from '../pages/SpecialtyVehicle'
// import SpecialtyVehicleTrafficTicket from '../pages/SpecialtyVehicleTrafficTicket'
// import FilesVehicle from '../pages/Vehicle/Files'
// import SaleList from '../pages/Sale/List'
// import SaleCreateEdit from '../pages/Sale/CreateEdit'
// import SaleContract from '../pages/Sale/Contract'

import Profile from '../pages/Profile'

const Routes = () => {
  return (
    <Switch>
      <Route exact path='/' component={SignIn} />
      
      <Route exact path='/register' component={SignUp} />
      
      <Route exact path='/forgot' component={Forgot} />
      <Route exact path='/reset' component={Reset} />
      
      <Route exact path='/dashboard' component={Dashboard} isPrivate />
      
      <Route exact path='/company' component={CompanyList} isPrivate />
      <Route exact path='/company/create' component={CompanyCreateEdit} isPrivate />
      <Route exact path='/company/edit/:id' component={CompanyCreateEdit} isPrivate />
      
      <Route exact path='/user' component={UserList} isPrivate provider={true} />
      <Route exact path='/user/create' component={UserCreateEdit} isPrivate />
      <Route exact path='/user/edit/:id' component={UserCreateEdit} isPrivate  />
      
      <Route exact path='/client' component={UserList} isPrivate provider={false} />
      <Route exact path='/client/create' component={ClientCreateEdit} isPrivate  />
      <Route exact path='/client/edit/:id' component={ClientCreateEdit} isPrivate />
      
      <Route exact path='/profile' component={Profile} isPrivate />

      {/* <Route exact path='/vehicle' component={VehicleList} isPrivate />
      <Route exact path='/vehicle/create' component={VehicleCreateEdit} isPrivate />
      <Route exact path='/vehicle/edit/:id' component={VehicleCreateEdit} isPrivate />
      <Route exact path='/vehicle/:id/specialty' component={SpecialtyVehicle} isPrivate />
      <Route exact path='/vehicle/:id/files' component={FilesVehicle} isPrivate />
      <Route exact path='/vehicle/:id/traffic-ticket' component={SpecialtyVehicleTrafficTicket} isPrivate /> */}

      <Route exact path='/specialty' component={SpecialtyList} isPrivate />
      <Route exact path='/specialty/create' component={SpecialtyCreateEdit} isPrivate />
      <Route exact path='/specialty/edit/:id' component={SpecialtyCreateEdit} isPrivate />
{/* 
      <Route exact path='/sale' component={SaleList} isPrivate />
      <Route exact path='/sale/create' component={SaleCreateEdit} isPrivate />
      <Route exact path='/sale/edit/:id' component={SaleCreateEdit} isPrivate />
      <Route exact path='/sale/contract/:id' component={SaleContract} isPrivate /> */}


      <Redirect from='*' to='/' />
    </Switch>
  )
}

export default Routes
