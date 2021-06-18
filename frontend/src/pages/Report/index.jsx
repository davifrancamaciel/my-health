import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

const orderByOptions = [{ value: 'name', label: 'Nome' }];

const SpecialityList = function () {
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState();
	const [noData, setNoData] = useState(false);
	const [itens, setItens] = useState([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [onChangeOrder, setOnChangeOrder] = useState();

	useEffect(() => {
		async function load() {
			try {
				setLoading(true);

				const response = await api.get('report', {
					params: { ...search, page, ...onChangeOrder },
				});
				console.log(response.data)
				// const data = response.data.map((appointment) => {
				// 	const { percentage } = appointment.segment;
				// 	const valueCompany = appointment.value * (percentage / 100);

				// 	return {
				// 		...appointment,
				// 		priceFormated: formatPrice(appointment.value),
				// 		valueCompany: formatPrice(valueCompany),
				// 		createdAtFormatedDate: `Cadastrada no dia ${format(
				// 			parseISO(appointment.createdAt),
				// 			"d 'de' MMMM",
				// 			{
				// 				locale: pt,
				// 			}
				// 		)}`,
				// 	};
				// });

				// if (page > 1) setItens([...itens, ...data]);
				// else setItens(data);

				setTotal(response.data.count);
				// setNoData(data.length == 0);
				setNoData(false);
				setLoading(false);
			} catch (error) {
				setLoading(false);
				getValidationErrors(error);
			}
		}

		load();
	}, [search, page, onChangeOrder]);

	async function handleDelete(item) {
		ShowConfirm('Atenção', `Confirma a remoção da especialidade ${item.name}?`, () => handleDeleteConfirm(item.id));
	}

	async function handleDeleteConfirm(id) {
		try {
			setLoading(true);
			await api.delete(`specialities-types/${id}`);

			showToast.success('Especialidade excluída com sucesso!');
			const updateSpecialities = itens.filter((c) => c.id !== id);
			setTotal(total - 1);
			setItens(updateSpecialities);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			getValidationErrors(error);
		}
	}

	function handleUpdate(id) {
		history.push(`/speciality-type/edit/${id}`);
	}

	return (
		<Container title="Especialidades do sistema" loading={loading ? Boolean(loading) : undefined} showBack>
			<Search onSearch={setSearch} setPage={setPage} />
			<span>
				<span>{total > 0 && <span>Total {total}</span>}</span>
				<Link to="/speciality-type/create">
					<FiPlus size={20} /> Cadastrar
				</Link>
			</span>
			<Order onChangeOrder={setOnChangeOrder} orderOptions={orderByOptions} setPage={setPage} />
			{noData && <NoData text={`Não há dados para exibir :(`} />}
			<Main>
				<Ul>
					{itens.map((speciality) => (
						<ListItem
							item={speciality}
							key={speciality.id}
							onUpdateClick={handleUpdate}
							onDeleteClick={handleDelete}
						/>
					))}
				</Ul>
			</Main>

			<LoadMore onClick={() => setPage(page + 1)} total={total} loadedItens={itens.length} />
		</Container>
	);
};

export default SpecialityList;
