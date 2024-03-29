import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdNotifications } from 'react-icons/md';
import { parseISO, formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { notificationListSuccess } from 'store/modules/notification/actions';

import { SECONDARY_COLOR } from 'constants/colors';

import firebaseService from 'services/firebase';
import history from 'services/browserhistory';

import { Container, Badge, NotificationList, Notification, Scroll } from './styles';

function Notifications() {
	const dispatch = useDispatch();
	const profile = useSelector((state) => state.user.profile);
	const notificationsList = useSelector((state) => state.notification.list);
	const [visible, setVisible] = useState(false);
	const [notifications, setNotification] = useState([]);
	/**
	 *  useMemo vai escutar as alaterações na variavel notifications
	 *e toda vez que houver auteração ele vai recalcular o valor para a variavel hasUnread
	 */

	const hasUnread = useMemo(() => !!notifications.find((notification) => notification.read === false), [
		notifications,
	]);

	useEffect(() => {
		if (!!notifications.length) {
			dispatch(notificationListSuccess(notifications));
		}
	}, [notifications]);

	useEffect(() => {
		async function loadNotifications() {
			firebaseService.getDataList(`notifications/user-${profile.id}`, (dataReceived) => {
				const data = dataReceived.map((notification) => ({
					...notification,
					timeDistance: formatDistance(parseISO(notification.createdAt), new Date(), {
						addSuffix: true,
						locale: pt,
					}),
				}));

				console.log(data);
				setNotification(data);
			});
		}

		loadNotifications();
	}, []);

	function handleToggleVisible() {
		setVisible(!visible);
	}

	async function handleMarkAsRead(key) {
		let notificationRead = notifications.find((x) => x.key === key);
		notificationRead.read = true;
		firebaseService.updateData(key, `notifications/user-${profile.id}`, notificationRead);
		setNotification(
			notifications.map((notification) =>
				notification.key === key ? { ...notification, read: true } : notification
			)
		);
	}

	function handleDetails(notification) {
		handleMarkAsRead(notification.key);
		history.push(`/appointment/details/${notification.id}`);
	}

	return (
		<Container>
			<Badge onClick={handleToggleVisible} hasUnread={hasUnread}>
				<MdNotifications color={SECONDARY_COLOR} size={20} />
			</Badge>
			<NotificationList visible={visible}>
				<Scroll>
					{notifications.map((n) => (
						<Notification key={n.key} unread={!n.read}>
							<p onClick={() => handleDetails(n)}>{n.content}</p>
							<time>{n.timeDistance}</time>
							{!n.read && (
								<button type="button" onClick={() => handleMarkAsRead(n.key)}>
									Marcar como lido
								</button>
							)}
						</Notification>
					))}
				</Scroll>
			</NotificationList>
		</Container>
	);
}

export default Notifications;
