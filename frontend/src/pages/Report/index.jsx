import React, { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { parseISO, format, startOfMonth, endOfMonth } from 'date-fns';

import Container from 'components/_layouts/Container';
import NoData from 'components/NoData';
import Order from 'components/Order';
import Search from './Search';

import api from 'services/api';
import getValidationErrors from 'Utils/getValidationErrors';
import { formatPrice } from 'Utils/formatPrice';
import { getType } from 'Utils/typeSegmentsConstants';
import TableReport from './TableReport';
import { FiPrinter } from 'react-icons/fi';

import { Main } from 'components/_layouts/ListContainer/styles';
import { Footer, Summary } from './styles';

const orderByOptions = [{ value: 'name', label: 'Nome' }];

const headerList = ['Procedimento', 'Medico', 'Paciente', 'Data', 'Valor', 'Comissão médico', 'Comissão UPIS'];

const SpecialityList = function () {
	const componentRef = useRef();
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState({ end_date: endOfMonth(new Date()), start_date: startOfMonth(new Date()) });
	const [noData, setNoData] = useState(false);
	const [itens, setItens] = useState([]);
	const [onChangeOrder, setOnChangeOrder] = useState();
	const [totalSummary, setTotalSummary] = useState({});
	const [filteredPeriod, setFilteredPeriod] = useState('');

	useEffect(() => {
		load();
		setFilteredPeriod(`${format(search.start_date, 'dd/MM/yyyy')} à ${format(search.end_date, 'dd/MM/yyyy')}`);
	}, [search, onChangeOrder]);

	useEffect(() => {
		const summary = itens.reduce(
			(acc, transaction) => {
				acc.value += Number(transaction.value);
				acc.provider_value += Number(transaction.provider_value);
				acc.company_value += Number(transaction.company_value);

				return acc;
			},
			{ value: 0, provider_value: 0, company_value: 0 }
		);

		setTotalSummary({
			value: formatPrice(summary.value),
			provider_value: formatPrice(summary.provider_value),
			company_value: formatPrice(summary.company_value),
		});
	}, [itens]);

	async function load() {
		try {
			setLoading(true);

			const response = await api.get('report', {
				params: { ...search, ...onChangeOrder },
			});
			console.log(response.data);
			const data = response.data.map((appointment) => {
				const company_value = appointment.value - appointment.provider_value;

				return {
					...appointment,
					company_value,
					valueFormated: formatPrice(appointment.value),
					companyValueFormated: formatPrice(company_value),
					providerValueFormated: formatPrice(appointment.provider_value),
					date: `${format(parseISO(appointment.date), 'dd/MM/yyyy HH:mm')}`,
					type: getType(appointment.speciality.type.segment.type),
				};
			});

			setItens(data);
			setNoData(data.length == 0);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			getValidationErrors(error);
		}
	}

	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
		documentTitle: 'UPIS SAÚDE',
	});
	return (
		<Container title="Relatório de agendamentos" loading={loading ? Boolean(loading) : undefined} showBack>
			<Search onSearch={setSearch} />
			<span>
				<span>{!!itens.length && <span>Total {itens.length}</span>}</span>
				<button onClick={handlePrint}>
					<FiPrinter /> <span>Imprimir contrato</span>
				</button>
			</span>
			<Order onChangeOrder={setOnChangeOrder} orderOptions={orderByOptions} setPage={() => {}} />
			{noData && <NoData text={`Não há dados para exibir :(`} />}
			{!!itens.length && (
				<Main ref={componentRef}>
					<TableReport title={'RELATÓRIO DE AGENDAMENTOS'} headerList={headerList}>
						{itens.map((item, i) => (
							<tr key={i}>
								<td>
									{item.type}
									<br />
									{item.speciality.type.segment.name}
									{' - '}
									{item.speciality.type.name}
								</td>
								<td>{item.provider.name}</td>
								<td>{item.user.name}</td>
								<td>{item.date}</td>
								<td>{item.valueFormated}</td>
								<td>{item.providerValueFormated}</td>
								<td>{item.companyValueFormated}</td>
							</tr>
						))}
					</TableReport>
					<Footer>
						<div>
							<span>Periodo filtrado de {filteredPeriod}</span>
							<span>Total de agendamentos {itens.length}</span>
						</div>
						<Summary>
							<span>Total arrecadado {totalSummary.value}</span>
							<span>Total de comissões médicas {totalSummary.provider_value}</span>
							<span>Total de comissões UPIS {totalSummary.company_value}</span>
						</Summary>
					</Footer>
				</Main>
			)}
		</Container>
	);
};

export default SpecialityList;
