import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiPlus } from 'react-icons/fi';
import { parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Container from 'components/_layouts/Container';
import ShowConfirm from 'components/ShowConfirm';
import NoData from 'components/NoData';
import LoadMore from 'components/LoadMore';
import Order from 'components/Order';

import ListItem from './ListItem';
import Search from './Search';

import api from 'services/api';
import history from 'services/browserhistory';
import getValidationErrors from 'Utils/getValidationErrors';
import showToast from 'Utils/showToast';
import { formatPrice } from 'Utils/formatPrice';

import { Main, Ul } from 'components/_layouts/ListContainer/styles';

const orderByOptions = [{ value: 'value', label: 'Valor' }];

const SpecialtyList = function () {
	const profile = useSelector((state) => state.user.profile);

	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState();
	const [noData, setNoData] = useState(false);
	const [specialties, setSpecialties] = useState([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [onChangeOrder, setOnChangeOrder] = useState();

	useEffect(() => {
		if (!profile.provider) {
			history.goBack();
			showToast.error('Para acessar esta as especialidades você precisa ser um Médico');
		}
		async function loadSpecialties() {
			try {
				setLoading(true);

				const response = await api.get('specialties', {
					params: { ...search, page, ...onChangeOrder },
				});

				const data = response.data.rows.map((specialty) => ({
					...specialty,
					valueFormated: formatPrice(specialty.value),
					createdAtFormatedDate: `Cadastrada no dia ${format(parseISO(specialty.createdAt), "d 'de' MMMM", {
						locale: pt,
					})}`,
				}));

				if (page > 1) setSpecialties([...specialties, ...data]);
				else setSpecialties(data);

				setTotal(response.data.count);
				setNoData(data.length == 0);
				setLoading(false);
			} catch (error) {
				setLoading(false);
				getValidationErrors(error);
			}
		}

		loadSpecialties();
	}, [search, page, onChangeOrder]);

	async function handleDelete(item) {
		ShowConfirm('Atenção', `Confirma a remoção da especialidade ${item.type.name}?`, () =>
			handleDeleteConfirm(item.id)
		);
	}

	async function handleDeleteConfirm(id) {
		try {
			setLoading(true);
			await api.delete(`specialties/${id}`);

			showToast.success('Especialidade excluída com sucesso!');
			const updateSpecialties = specialties.filter((c) => c.id !== id);
			setTotal(total - 1);
			setSpecialties(updateSpecialties);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			getValidationErrors(error);
		}
	}

	function handleUpdate(id) {
		history.push(`/specialty/edit/${id}`);
	}

	return (
		<Container title="Minhas especialidades" loading={loading ? Boolean(loading) : undefined}>
			<Search onSearch={setSearch} setPage={setPage} />
			<span>
				<span>{total > 0 && <span>Total {total}</span>}</span>
				<Link to="/specialty/create">
					<FiPlus size={20} /> Cadastrar
				</Link>
			</span>
			<Order onChangeOrder={setOnChangeOrder} orderOptions={orderByOptions} setPage={setPage} />
			{noData && <NoData text={`Não há dados para exibir :(`} />}
			<Main>
				<Ul>
					{specialties.map((specialty) => (
						<ListItem
							item={specialty}
							key={specialty.id}
							onUpdateClick={handleUpdate}
							onDeleteClick={handleDelete}
						/>
					))}
				</Ul>
			</Main>

			<LoadMore onClick={() => setPage(page + 1)} total={total} loadedItens={specialties.length} />
		</Container>
	);
};

export default SpecialtyList;
