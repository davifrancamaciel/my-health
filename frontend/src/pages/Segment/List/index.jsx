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

import { Main, Ul } from 'components/_layouts/ListContainer/styles';

const orderByOptions = [{ value: 'name', label: 'Nome' }];

const SegmentList = function () {
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState();
	const [noData, setNoData] = useState(false);
	const [segments, setSegments] = useState([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [onChangeOrder, setOnChangeOrder] = useState();

	useEffect(() => {
		
		async function loadSpecialities() {
			try {
				setLoading(true);

				const response = await api.get('segments', {
					params: { ...search, page, ...onChangeOrder },
				});

				const data = response.data.rows.map((speciality) => ({
					...speciality,
					createdAtFormatedDate: `Cadastrado no dia ${format(parseISO(speciality.createdAt), "d 'de' MMMM", {
						locale: pt,
					})}`,
				}));
				
				if (page > 1) setSegments([...segments, ...data]);
				else setSegments(data);

				setTotal(response.data.count);
				setNoData(data.length == 0);
				setLoading(false);
			} catch (error) {
				setLoading(false);
				getValidationErrors(error);
			}
		}

		loadSpecialities();
	}, [search, page, onChangeOrder]);

	async function handleDelete(item) {
		ShowConfirm('Atenção', `Confirma a remoção do segmento ${item.name}?`, () =>
			handleDeleteConfirm(item.id)
		);
	}

	async function handleDeleteConfirm(id) {
		try {
			setLoading(true);
			await api.delete(`segments/${id}`);

			showToast.success('Segmento excluído com sucesso!');
			const updateSpecialities = segments.filter((c) => c.id !== id);
			setTotal(total - 1);
			setSegments(updateSpecialities);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			getValidationErrors(error);
		}
	}

	function handleUpdate(id) {
		history.push(`/segment/edit/${id}`);
	}

	return (
		<Container title="Segmentos do sistema" loading={loading ? Boolean(loading) : undefined} showBack>
			<Search onSearch={setSearch} setPage={setPage} />
			<span>
				<span>{total > 0 && <span>Total {total}</span>}</span>
				<Link to="/segment/create">
					<FiPlus size={20} /> Cadastrar
				</Link>
			</span>
			<Order onChangeOrder={setOnChangeOrder} orderOptions={orderByOptions} setPage={setPage} />
			{noData && <NoData text={`Não há dados para exibir :(`} />}
			<Main>
				<Ul>
					{segments.map((speciality) => (
						<ListItem
							item={speciality}
							key={speciality.id}
							onUpdateClick={handleUpdate}
							onDeleteClick={handleDelete}
						/>
					))}
				</Ul>
			</Main>

			<LoadMore onClick={() => setPage(page + 1)} total={total} loadedItens={segments.length} />
		</Container>
	);
};

export default SegmentList;
