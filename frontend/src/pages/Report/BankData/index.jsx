import React from 'react';

function BankData({ title, text }) {
	return (
		<div>
			{text && (
				<span>
					{title} {text}
				</span>
			)}
		</div>
	);
}

export default BankData;
