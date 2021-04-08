import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Container from 'components/_layouts/Container';
import ShowConfirm from 'components/ShowConfirm';
import NoData from 'components/NoData';
import LoadMore from 'components/LoadMore';
import Order from 'components/Order';

import api from 'services/api';
import history from 'services/browserhistory';
import getValidationErrors from 'Utils/getValidationErrors';
import urlMessageWhatsapp from 'Utils/urlMessageWhatsapp';
import showToast from 'Utils/showToast';
import ListItem from './ListItem';
import Search from './Search';

import { Main, Ul } from 'components/_layouts/ListContainer/styles';

const orderByOptionsUser = [{ value: 'name', label: 'Nome' }];
const orderByOptionsClient = [
	{ value: 'name', label: 'Nome' },
	{ value: 'city', label: 'Cidade' },
	{ value: 'neighborhood', label: 'Bairro' },
];

const UserList = ({ provider }) => {
	const profile = useSelector((state) => state.user.profile);
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState();
	const [users, setUsers] = useState([]);
	const [noData, setNoData] = useState(false);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [onChangeOrder, setOnChangeOrder] = useState();

	useEffect(() => {
		setUsers([]);
		async function loadUsers() {
			try {
				setLoading(true);
				const response = await api.get('users', {
					params: { ...search, page, ...onChangeOrder },
				});
				const usersFormated = response.data.rows.map((user) => ({
					...user,
					name: `${user.provider ? 'Médico' : 'Paciente'} ${user.name}`,
					urlWhatsapp: urlMessageWhatsapp(user.whatsapp),
					createdAtFormatedDate: `Cadastrado dia ${format(parseISO(user.createdAt), "d 'de' MMMM 'de' yyyy", {
						locale: pt,
					})}`,
				}));

				if (page > 1) setUsers([...users, ...usersFormated]);
				else {
					setUsers(usersFormated);
				}
				setNoData(response.data.rows.length == 0);
				setTotal(response.data.count);
				setLoading(false);
			} catch (error) {
				setLoading(false);
				getValidationErrors(error);
			}
		}

		loadUsers();
	}, [provider, search, page, onChangeOrder]);

	async function handleDelete(item) {
		ShowConfirm('Atenção', `Confirma a remoção do ${item.name}?`, () => handleDeleteConfirm(item));
	}

	async function handleDeleteConfirm(item) {
		try {
			setLoading(true);
			await api.delete(`users/${item.id}`);

			showToast.success(`${item.name} excluído com sucesso!`);
			const updateUsers = users.filter((c) => c.id !== item.id);
			setUsers(updateUsers);
			setTotal(total - 1);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			getValidationErrors(error);
		}
	}

	function handleUpdate(id) {
		if (profile.id === id) {
			history.push(`/profile`);
		} else {
			history.push(`/user/edit/${id}`);
		}
	}

	return (
		<Container title={'Usuários do sistema'} loading={loading} showBack>
			<Search onSearch={setSearch} provider={provider} setPage={setPage} />
			<span>
				<span>{total > 0 && <span>Total {total}</span>}</span>
				<Link to={`/user/create`}>
					<FiPlus size={20} /> Cadastrar
				</Link>
			</span>

			<Order
				onChangeOrder={setOnChangeOrder}
				orderOptions={provider ? orderByOptionsUser : orderByOptionsClient}
				setPage={setPage}
				provider={provider}
			/>

			{noData && <NoData text={`Não há dados para exibir :(`} />}
			<Main>
				<Ul>
					{users.map((users) => (
						<ListItem
							provider={provider}
							item={users}
							key={users.id}
							onUpdateClick={handleUpdate}
							onDeleteClick={handleDelete}
						/>
					))}
				</Ul>
			</Main>
			<LoadMore onClick={() => setPage(page + 1)} total={total} loadedItens={users.length} />
		</Container>
	);
};

export default UserList;
