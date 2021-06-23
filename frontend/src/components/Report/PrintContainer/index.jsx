import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { FiPrinter } from 'react-icons/fi';

import { Container, PdfContainer } from './styles';

function PrintContainer({ children, total }) {
	const componentRef = useRef();
	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
		documentTitle: 'UPIS SAÚDE',
	});

	return (
		<Container>
			<header>
				<span>{!!total && <span>Total {total}</span>}</span>
				<button onClick={handlePrint}>
					<FiPrinter /> <span>Imprimir</span>
				</button>
			</header>

			<PdfContainer>
				<div ref={componentRef}>{children}</div>
			</PdfContainer>
		</Container>
	);
}

export default PrintContainer;
