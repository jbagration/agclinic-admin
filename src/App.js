import React, {useState} from 'react';
import 'react-perfect-scrollbar/dist/css/styles.css';
import {useRoutes, useLocation, useNavigate} from 'react-router-dom';
import {ThemeProvider, StyledEngineProvider} from '@material-ui/core';
import GlobalStyles from './components/Styles/GlobalStyles';
import theme from './theme';
import routes from './routes';
import TokenStorage from './API/TokenStorage';

const App = () => {

    const content = useRoutes(routes);
    const navigate = useNavigate();

    if (window.location.pathname.includes('app') && TokenStorage.getAccessToken() === '') {
        navigate('/login', { replace: true });
    }

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <GlobalStyles/>
                {content}
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
