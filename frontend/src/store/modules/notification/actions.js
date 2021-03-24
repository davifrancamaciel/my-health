import { NOTIFICATION_LIST_SUCCESS } from 'constants/notification';

export function notificationListSuccess(list) {
	return {
		type: NOTIFICATION_LIST_SUCCESS,
		payload: { list },
	};
}
