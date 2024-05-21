import React, {useState, useContext} from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    CircularProgress
} from '@material-ui/core';

const Context = React.createContext();

const useGlobalLoader = () => {
    const {setIsLoading} = useContext(Context);

    return setIsLoading;
}

const GlobalLoader = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Context.Provider value={{setIsLoading}}>
            {isLoading && (
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#ffffff',
                    zIndex: 100
                }}
                >
                    <CircularProgress/>
                </Box>
            )}
            {children}
        </Context.Provider>
    );
}

GlobalLoader.propTypes = {
    children: PropTypes.any
}

export {GlobalLoader, useGlobalLoader};
