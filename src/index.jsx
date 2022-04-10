import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AlertTemplate from 'react-alert-template-mui'
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import App from './App';
import reportWebVitals from './reportWebVitals';
import { types } from 'react-alert';

const options = {
  // you can also just use 'bottom center'
  position: positions.MIDDLE,
  timeout: 5000,
  // offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE,
  type: types.SUCCESS,
  containerStyle: {
    padding: '20px',
  }
}

ReactDOM.render(
  <React.StrictMode>
    <AlertProvider template={AlertTemplate} {...options}>
      <App />
    </AlertProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
