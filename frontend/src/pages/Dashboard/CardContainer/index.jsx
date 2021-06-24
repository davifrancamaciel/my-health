import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { MdAttachMoney } from 'react-icons/md';
import { FiCalendar } from 'react-icons/fi';

import Card from './Card';
import { formatPrice } from 'Utils/formatPrice';
import roulesEnum from 'enums/roulesEnum';

import { Container } from './styles';

function CardContainer({ loaded, dashboard, company_provider }) {
	const profile = useSelector((state) => state.user.profile);

	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		setIsAdmin(profile.roules === roulesEnum.ADMIN);
	}, [profile]);

	return (
		<Container>
			{!isAdmin && (
				<Card
					route={'schedule'}
					loaded={loaded}
					text={loaded && dashboard.appointments.schedule.text}
					title={'Agendamentos para hoje'}
					icon={<FiCalendar size={26} />}					
				/>
			)}
			<Card
				route={'report'}
				loaded={loaded}
				title={isAdmin ? 'Receita' : 'Agendamentos deste mês'}
				icon={<MdAttachMoney size={26} />}
				text={loaded && formatPrice(dashboard.appointments.total.text)}
			/>
			<Card
				route={'report'}
				loaded={loaded}
				text={loaded && formatPrice(dashboard.appointments.expense.text)}
				title={isAdmin ? 'Despesa' : 'Comissão deste mês'}
				icon={<MdAttachMoney size={26} />}
				total={!isAdmin}
			/>
			{isAdmin && (
				<Card
					route={'report'}
					loaded={loaded}
					text={loaded && formatPrice(dashboard.appointments.profit.text)}
					title={'Lucro'}
					icon={<MdAttachMoney size={26} />}
					total
				/>
			)}
		</Container>
	);
}

export default CardContainer;
