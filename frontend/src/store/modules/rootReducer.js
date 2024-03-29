import { combineReducers } from 'redux';

import auth from './auth/reducer';
import user from './user/reducer';
import notification from './notification/reducer';

export default combineReducers({
	auth,
	user,
	notification,
});
