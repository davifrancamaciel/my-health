import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
import { getType } from 'Utils/typeSegmentsConstants';

import { Main, Ul } from 'components/_layouts/ListContainer/styles';

const orderByOptions = [{ value: 'value', label: 'Valor' }];

const SpecialityList = function () {
	const profile = useSelector((state) => state.user.profile);

	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState();
	const [noData, setNoData] = useState(false);
	const [specialities, setSpecialities] = useState([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [onChangeOrder, setOnChangeOrder] = useState();

	useEffect(() => {
		if (!profile.provider) {
			history.goBack();
			showToast.error('Para acessar esta as especialidades você precisa ser um Médico');
		}
		async function loadSpecialities() {
			try {
				setLoading(true);

				const response = await api.get('specialities', {
					params: { ...search, page, ...onChangeOrder },
				});

				const data = response.data.rows.map((speciality) => {
					const days = speciality.scheduleFormated.daysWeekConfig
						.filter((x) => x.available === true)
						.map((day) => day.day)
						.join(', ');

					const { percentage } = speciality.type.segment;
					const valueCompany = speciality.type.value * (percentage / 100);
					return {
						...speciality,
						type: {
							...speciality.type,
							segment: {
								...speciality.type.segment,
								name: `${getType(speciality.type.segment.type)} ${speciality.type.segment.name}`,
							},
						},
						valueFormated: formatPrice(speciality.type.value),
						valueCompanyFormated: formatPrice(valueCompany),
						valueProviderFormated: formatPrice(speciality.type.value - valueCompany),
						createdAtFormatedDate: `Cadastrada no dia ${format(
							parseISO(speciality.createdAt),
							"d 'de' MMMM",
							{
								locale: pt,
							}
						)}`,
						days,
					};
				});

				if (page > 1) setSpecialities([...specialities, ...data]);
				else setSpecialities(data);

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
		ShowConfirm('Atenção', `Confirma a remoção da especialidade ${item.type.name}?`, () =>
			handleDeleteConfirm(item.id)
		);
	}

	async function handleDeleteConfirm(id) {
		try {
			setLoading(true);
			await api.delete(`specialities/${id}`);

			showToast.success('Especialidade excluída com sucesso!');
			const updateSpecialities = specialities.filter((c) => c.id !== id);
			setTotal(total - 1);
			setSpecialities(updateSpecialities);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			getValidationErrors(error);
		}
	}

	function handleUpdate(id) {
		history.push(`/speciality/edit/${id}`);
	}

	return (
		<Container title="Minhas especialidades" loading={loading ? Boolean(loading) : undefined} showBack>
			<Search onSearch={setSearch} setPage={setPage} />
			<span>
				<span>{total > 0 && <span>Total {total}</span>}</span>
				<Link to="/speciality/create">
					<FiPlus size={20} /> Cadastrar
				</Link>
			</span>
			<Order onChangeOrder={setOnChangeOrder} orderOptions={orderByOptions} setPage={setPage} />
			{noData && <NoData text={`Não há dados para exibir :(`} />}
			<Main>
				<Ul>
					{specialities.map((speciality) => (
						<ListItem
							item={speciality}
							key={speciality.id}
							onUpdateClick={handleUpdate}
							onDeleteClick={handleDelete}
						/>
					))}
				</Ul>
			</Main>

			<LoadMore onClick={() => setPage(page + 1)} total={total} loadedItens={specialities.length} />
		</Container>
	);
};

export default SpecialityList;
