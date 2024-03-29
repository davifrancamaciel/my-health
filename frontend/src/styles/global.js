import { createGlobalStyle } from 'styled-components';
import { lighten } from 'polished';

import 'react-toastify/dist/ReactToastify.css';
import 'react-circular-progressbar/dist/styles.css';

import { PRIMARY_COLOR, SECONDARY_COLOR } from '../constants/colors';

export default createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
    
    :root {
        --primary-color:${PRIMARY_COLOR};
        --secondary-color: ${SECONDARY_COLOR} ;
        --text-color: #6c6c80;
        --danger-color: #f04d5a;        
        --warning-color: #ff892e;        
    }
    * {
        margin: 0;
        padding: 0;
        outline: 0;
        box-sizing: border-box;
    }
    *:focus {
        outline: 0;
    }
    html, body, #root {
        height: 100%;
    }
    body {     
        -webkit-font-smoothing: antialiased;
    }
    body, input, button {
        font: 14px 'Roboto', sans-serif;
    }

    a {
        text-decoration: none;
    }

    ul {
        list-style: none;
    }

    button {
        cursor: pointer;
    }

    .as-to-uppercase {
        text-transform: uppercase;
    }
        
    .as-layout-default {      
        
        textarea,
        input[type='text'],
        input[type='email'],
        input[type='number'],
        input[type='password'],
        input[type='tel'] {
            flex: 1;
            background: #f0f0f5;
            border-radius: 4px;
            border: 0;
            padding: 13px 15px;
            font-size: 16px;
            color: #6c6c80;
            height: 44px;
            max-height: 44px;
            width: 100%;
            margin: 0 0 0px;
        }
        input::placeholder {
            color: #a0a0b2;
        }
        select {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            flex: 1;
            background: #f0f0f5;
            border-radius: 4px;
            border: 0;
            padding: 13px 15px;
            font-size: 16px;
            color: #6c6c80;
            height: 44px;
            max-height: 44px;
            option {
                padding: 10px;
            }
        }
        label {
            font-size: 14px;
            margin-bottom: 8px;
            color: #6c6c80;
          }
          textarea {
            flex: 1;
            background: #f0f0f5;
            border-radius: 4px;
            border: 0;
            padding: 13px 15px;
            font-size: 16px;
            color: #6c6c80;
            
            width: 100%;
            margin: 0 0 0px;
            min-height: 140px;
            height: 60px;
            width: 100%;            
            line-height: 24px;
            resize: none;
          }

    }

    .MuiSwitch-colorPrimary.Mui-checked{
        color : ${PRIMARY_COLOR} !important;
    }

    .MuiSwitch-colorPrimary.Mui-checked + .MuiSwitch-track {
        background-color: ${lighten(0.08, `${PRIMARY_COLOR}`)} !important;
        
    }
`;
