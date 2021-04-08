import React from 'react';
import { FiEdit, FiDelete, FiPhone } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

import { Li, Info, Actions, InfoStatus, ActiveStatus, ExpiredStatus } from 'components/_layouts/ListContainer/styles';

function Item({ item, onDeleteClick, onUpdateClick }) {
	return (
		<Li active={item.active}>
			<header>
				<img src={item.url} alt={item.name} />
				<Info>
					<strong>{item.name}</strong>
					<span>{item.email}</span>
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

			<p>
				<span>
					<FaWhatsapp size={20} />
					<a href={item.urlWhatsapp} target="_blank">
						{item.whatsapp}
					</a>
				</span>
				{item.phone && (
					<span>
						<FiPhone size={20} />
						{item.phone}
					</span>
				)}
			</p>

			<InfoStatus>
				<ExpiredStatus>{item.createdAtFormatedDate}</ExpiredStatus>
				<ActiveStatus active={item.active}>{`${item.active ? 'Ativo' : 'Inativo'}`}</ActiveStatus>
			</InfoStatus>
		</Li>
	);
}
export default Item;
