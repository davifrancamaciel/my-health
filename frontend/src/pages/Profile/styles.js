import styled from 'styled-components';
import { darken, lighten } from 'polished';

export const Container = styled.div`
	width: 100%;
	max-width: 1120px;
	margin: 0 auto;
	padding: 40px 20px;
	
  .as-title {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		h1 {
			color: var(--secondary-color);
			margin-bottom: 30px;
		}
	}	

	.as-dropzone {
		width: 200px;
		border-radius: 50%;
		margin: auto;
		> img {
			width: 200px;
			height: 200px;
			border-radius: 50%;
			object-fit: cover;
		}
		> p {
			border: none;
		}
	}
	button {
		width: 260px;
	}
	@media (max-width: 720px) {
		button {
			width: 100%;
		}
	}
	.leaflet-container {
		width: 100%;
		height: 100vh;
		max-height: 100%;
	}
`;
export const TabsContainer = styled.div`
	box-shadow: 0 0 14px 0 #00000033;
`;
export const FormContainer = styled.div`
	margin: 0px auto;
	padding: 64px;
	max-width: ${(props) => (props.large === true ? '100%' : '730px')};
	background: #fff;
	border-radius: 2px;
	/* box-shadow: 0 0 14px 0 #00000033; */
	display: flex;
	flex-direction: column;

	p {
		color: #6c6c80;
		margin-bottom: 8px;
	}

	fieldset {
		min-inline-size: auto;
		border: 0;
	}

	legend {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
		margin-top: 30px;
	}
	legend a {
		cursor: pointer;
		font-size: 14px;
		font-weight: bold;
		display: flex;
		align-items: center;
		color: var(--text-color);
		&:hover {
			color: ${lighten(0.08, '#6c6c80')};
		}
	}
	legend h2 {
		font-size: 24px;
		color: var(--secondary-color);
	}

	.field-group {
		flex: 1;
		display: flex;
	}

	.field {
		flex: 1;
		display: flex;
		flex-direction: column;
		margin-bottom: 15px;
		opacity: ${(props) => (props.loading ? 0.5 : 1)};
	}

	.feld .alt-check {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.field .alt-check span {
		font-size: 14px;
		margin-bottom: -2px;
		color: #6c6c80;
		font-weight: initial;
		margin-left: 5px;
		align-items: baseline;
	}

	.field span {
		color: var(--secondary-color);
		align-self: flex-start;
		margin: 0 0 10px;
		font-weight: bold;
	}
	.field-group .field + .field {
		margin-left: 24px;
	}

	.field-group input + input {
		margin-left: 24px;
	}

	.field-check label {
		margin: 0 0 0 8px;
	}

	button[type='submit'] {
		width: 260px;
		align-self: flex-end;
		float: right;
	}
	@media (max-width: 720px) {
		padding-right: 20px;
		padding-left: 20px;
		.field-group .field + .field {
			margin-left: 0px;
		}
		.field-group {
			display: block;
		}
		button[type='submit'] {
			width: 100%;
		}
	}
`;
