import React from 'react';
import { FiEdit, FiDelete } from 'react-icons/fi';

import { Li, Info, Actions, InfoStatus, ExpiredStatus, ActiveStatus, ResponsiveText } from 'components/_layouts/ListContainer/styles';

function Item({ item, onDeleteClick, onUpdateClick }) {
	return (
		<Li>
			<header>
				<Info>
					<strong>{item.user.name}</strong>
					<span>{item.user.email}</span>
				</Info>
				<Actions>
					<button className="edit" onClick={() => onUpdateClick(item.id)}>
						<FiEdit size={20} color="#FFFFFF" />
					</button>
					<button className="delete" onClick={() => onDeleteClick(item)}>
						<FiDelete size={20} color="#FFFFFF" />
					</button>
				</Actions>
			</header>
			<ResponsiveText>
				{item.description}
			</ResponsiveText>
			<InfoStatus>
				<ExpiredStatus>{item.createdAtFormatedDate}</ExpiredStatus>
				<ExpiredStatus>{item.valueFormatted}</ExpiredStatus>
			</InfoStatus>
			<InfoStatus>
				<ActiveStatus active={!item.used}>{`${item.used ? 'Utilizado' : 'Não utilizado'}`}</ActiveStatus>
				<ActiveStatus active={item.active}>{`${item.active ? 'Disponível' : 'Pendente de aprovação'}`}</ActiveStatus>
			</InfoStatus>
		</Li>
	);
}
export default Item;
