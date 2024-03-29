import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { parseISO, format, startOfMonth, endOfMonth } from 'date-fns';

import Container from 'components/_layouts/Container';
import NoData from 'components/NoData';
import Search from './Search';

import api from 'services/api';
import getValidationErrors from 'Utils/getValidationErrors';
import { formatPrice } from 'Utils/formatPrice';
import { getType } from 'Utils/typeSegmentsConstants';
import TableReport from 'components/Report/TableReport';
import PrintContainer from 'components/Report/PrintContainer';
import BankData from './BankData';
import roulesEnum from 'enums/roulesEnum';

import { Footer, Summary } from './styles';

const headerList = ['Procedimento', 'Medico', 'Paciente', 'Data', 'Valor', 'Comissão médico', 'Comissão UPIS'];

const Report = function () {
	const profile = useSelector((state) => state.user.profile);

	const [showItensAdmin, setShowItensAdmin] = useState(false);
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState({ end_date: endOfMonth(new Date()), start_date: startOfMonth(new Date()) });
	const [noData, setNoData] = useState(false);
	const [itens, setItens] = useState([]);
	const [totalSummary, setTotalSummary] = useState({});
	const [filteredPeriod, setFilteredPeriod] = useState('');
	const [headerListThead, setHeaderListThead] = useState(headerList);

	useEffect(() => {
		setShowItensAdmin(profile.roules === roulesEnum.ADMIN);
		if (profile.roules !== roulesEnum.ADMIN) {
			setHeaderListThead(['Procedimento', 'Paciente', 'Data', 'Valor', 'Minha comissão']);
		}
		load();
		setFilteredPeriod(`${format(search.start_date, 'dd/MM/yyyy')} à ${format(search.end_date, 'dd/MM/yyyy')}`);
	}, [search]);

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
				params: { ...search },
			});
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

	return (
		<Container title="Relatório de agendamentos" loading={loading ? Boolean(loading) : undefined} showBack>
			<Search showItensAdmin={showItensAdmin} onSearch={setSearch} />
			{noData && <NoData text={`Não há dados para exibir :(`} />}
			{!!itens.length && (
				<PrintContainer total={itens.length}>
					<TableReport title={'RELATÓRIO DE AGENDAMENTOS'} headerList={headerListThead}>
						{itens.map((item, i) => (
							<tr key={i}>
								<td>
									{item.type}
									<br />
									{item.speciality.type.segment.name}
									{' - '}
									{item.speciality.type.name}
								</td>
								{showItensAdmin && (
									<td>
										{item.provider.name}
										<br />
										{item.provider.email}
										<BankData title={'Pix'} text={item.provider.bank_pix} />
										<BankData title={'Agência'} text={item.provider.bank_agency} />
										<BankData title={'Conta'} text={item.provider.bank_account} />
									</td>
								)}
								<td>
									{item.user.name}
									<br />
									{item.user.email}
								</td>
								<td>{item.date}</td>
								<td>{item.valueFormated}</td>
								<td>{item.providerValueFormated}</td>
								{showItensAdmin && <td>{item.companyValueFormated}</td>}
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
							{showItensAdmin && <span>Total de comissões UPIS {totalSummary.company_value}</span>}
						</Summary>
					</Footer>
				</PrintContainer>
			)}
		</Container>
	);
};

export default Report;
