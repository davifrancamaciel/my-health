import React, { useState, useEffect } from 'react';

import logo from 'assets/logoupish.png';

import { Container } from './styles';

function TableReport({ dadosGeraisHospital, title, headerList, children, assinatura, assinatura2 }) {
	const [headerListItens, setHeaderListItens] = useState([]);

	useEffect(() => {
		if (headerList) {
			setHeaderListItens(headerList);
		}
	}, [headerList]);	

	return (
		<div>
			<Container>
				<div className="page">
					<table style={{ fontSize: '12px' }} cellSpacing="0">
						<thead>
							<tr>
								<th colSpan={`${headerListItens.length}`}>
									<header>
										<img alt={''} src={logo} />
										<h2>{title}</h2>
									</header>
								</th>
							</tr>

							<tr>
								{headerListItens.map((titleHeader, i) => titleHeader && <th key={i}>{titleHeader}</th>)}
							</tr>
						</thead>
						<tbody>{children}</tbody>
					</table>
				</div>
			</Container>
			{/* <AssinaturaRodape
        assinatura={assinatura}
        assinatura2={assinatura2}
        localAndData={dadosGeraisHospital.localAndData}
      /> */}
		</div>
	);
}

export default TableReport;
