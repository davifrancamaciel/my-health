import styled from 'styled-components';
import { Popup } from 'react-leaflet';

export const PopupCustom = styled(Popup)`
	width: 300px;

	.leaflet-popup-content-wrapper {
		border-radius: 4px;
		.leaflet-popup-content {
			margin: 0px;
		}
	}
`;
export const Card = styled.div`
	background: #fff;
	box-shadow: 0 0 14px 0 #00000033;
	border-radius: 2px;
	padding: 10px;

	header {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	header img {
		width: 54px;
		height: 54px;
		border-radius: 50%;
		object-fit: cover;
		margin-right: 10px;
	}

	p {
		color: #666;
		font-size: 14px;
		margin-top: 2px;
		line-height: 20px;
		margin: 10px 0;
		display: flex;
		flex-direction: row;
		justify-content: space-between;

		span {
			display: flex;
			svg {
				margin-right: 5px;
			}
		}
	}

	a {
		color: #666;
		font-size: 14px;
		text-decoration: none;
		cursor: pointer;
	}

	a:hover {
		color: var(--secondary-color);
	}
`;

export const Info = styled.div`
	strong {
		display: block;
		font-size: 16px;
		color: #333;
	}

	span {
		font-size: 13px;
		color: #999;
		margin-top: 2px;
	}
`;
