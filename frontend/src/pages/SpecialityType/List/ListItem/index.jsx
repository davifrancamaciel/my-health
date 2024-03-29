import React from 'react';
import { FiEdit, FiDelete } from 'react-icons/fi';

import { Li, Info, Actions, InfoStatus, ExpiredStatus, ActiveStatus } from 'components/_layouts/ListContainer/styles';

function Item({ item, onDeleteClick, onUpdateClick }) {
	return (
		<Li>
			<header>
				<Info>
					<strong>{item.name}</strong>
					<span>{item.priceFormated}</span>
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
			{item.segment && (
				<p>
					<span>{item.segment.name}</span>
					<span>Porcentagem da empresa {item.segment.percentage}% ({item.valueCompany})</span>
				</p>
			)}
			<InfoStatus>
				<ExpiredStatus>{item.createdAtFormatedDate}</ExpiredStatus>
				<ActiveStatus active={item.active}>{`${item.active ? 'Disponível' : 'Indisponível'}`}</ActiveStatus>
			</InfoStatus>
		</Li>
	);
}
export default Item;
