import produce from 'immer';
import { NOTIFICATION_LIST_SUCCESS } from 'constants/notification';

const INITIAL_STATE = {
	list: [],
};

export default function notification(state = INITIAL_STATE, action) {
	return produce(state, (draft) => {
		switch (action.type) {
			case NOTIFICATION_LIST_SUCCESS: {
				draft.list = action.payload.list;
				break;
			}

			default:
		}
	});
}
