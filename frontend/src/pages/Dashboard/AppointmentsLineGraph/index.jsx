import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';
import { formatPrice } from 'Utils/formatPrice';
import api from 'services/api';
import { PRIMARY_COLOR, SECONDARY_COLOR } from 'constants/colors';

const options = {
	legend: {
		display: false,
	},
	elements: {
		point: {
			radius: 0,
		},
	},
	maintainAspectRatio: false,
	tooltips: {
		mode: 'index',
		intersect: false,
		callbacks: {
			label: function (tooltipItem, data) {
				return formatPrice(tooltipItem.value);
			},
		},
	},
	scales: {
		xAxes: [
			{
				type: 'time',
				time: {
					tooltipFormat: 'DD/MM/YYYY', //''ll',
				},
			},
		],
		yAxes: [
			{
				gridLines: {
					display: false,
				},
				ticks: {
					// Include a dollar sign in the ticks
					callback: function (value, index, values) {
						return numeral(value).format('0a');
					},
				},
			},
		],
	},
};

const buildChartData = (data) => {
	return data.map((item) => ({
		y: Number(item.value),
		x: item.date,
	}));
};

function LineGraph({ ...props }) {
	const [data, setData] = useState({});

	useEffect(() => {
		async function load() {
			const response = await api.get('dashboard-appointments-graph');
			let dataFormated = buildChartData(response.data);
			setData(dataFormated);
		}
		load();
	}, []);

	return (
		<div>
			{data?.length > 0 && (
				<div>
					<h3 style={{ color: `${SECONDARY_COLOR}` }}>Receita de agendamentos no ultimo ano</h3>
					<Line
						data={{
							datasets: [
								{
									backgroundColor: `${PRIMARY_COLOR}`,
									borderColor: 'rgb(47,135,191)',
									data: data,
								},
							],
						}}
						options={options}
					/>
				</div>
			)}
		</div>
	);
}

export default LineGraph;
