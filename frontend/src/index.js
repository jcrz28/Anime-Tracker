import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import { AuthContextProvider } from './store/auth-context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthContextProvider>
        <App />
    </AuthContextProvider>
);

/* https://react-bootstrap.github.io/ */
/* https://react-icons.github.io/react-icons/icons?name=fa */
/* https://reactrouter.com/docs/en/v6/getting-started/overview */
/* https://docs.npmjs.com/auditing-package-dependencies-for-security-vulnerabilities */