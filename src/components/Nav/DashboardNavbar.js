import {useState} from 'react';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
    AppBar,
    Badge,
    Box,
    Hidden,
    IconButton,
    Toolbar
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import InputIcon from '@material-ui/icons/Input';
import TokenStorage from '../../API/TokenStorage';
import Logo from '../Logo/Logo';

const DashboardNavbar = ({onMobileNavOpen, ...rest}) => {
    const navigate = useNavigate();

    const onLogOut = () => {
        TokenStorage.logOut();
        navigate('/login', {replace: true});
    };

    return (
        <AppBar
            elevation={0}
            {...rest}
        >
            <Toolbar>
                <RouterLink to="/">
                    <Logo/>
                </RouterLink>
                <Box sx={{flexGrow: 1}}/>
                <IconButton color="inherit" size="large" onClick={onLogOut}>
                    <InputIcon/>
                </IconButton>
                <Box sx={{display: {xs: 'block', lg: 'none'}}}>
                    <IconButton color="inherit" onClick={onMobileNavOpen} size="large">
                        <MenuIcon/>
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

DashboardNavbar.propTypes = {
    onMobileNavOpen: PropTypes.func
};

export default DashboardNavbar;
