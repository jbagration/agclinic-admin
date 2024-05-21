import React, {useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Alert,
    Typography
} from '@material-ui/core';
import {v4 as uuid} from 'uuid';

const Context = React.createContext();

const useAlert = () => {
    const {
        setList,
        onDeletListItem
    } = useContext(Context);

    return ({status = '', message = ''}) => {
        const id = uuid();
        setList((prev) => [
            ...prev,
            {
                id,
                status,
                message
            }
        ])
    };
}

const AlertItem = ({item, onDeletListItem}) => {
    useEffect(() => {
        const timeoutID = setTimeout(() => {
            onDeletListItem(item.id);
        }, 5000);
        return () => {
            clearTimeout(timeoutID);
        };
    }, []);
    return (
        <Box key={item.id} sx={{pt: 2}}>
            <Alert onClose={() => onDeletListItem(item.id)} severity={item.status}>{item.message}</Alert>
        </Box>
    );
}

AlertItem.propTypes = {
    item: PropTypes.object,
    onDeletListItem: PropTypes.func
}

const AlertProvider = ({children}) => {
    const [list, setList] = useState([]);

    const onDeletListItem = (id) => {
        setList((prev) => prev.filter((item) => item.id !== id));
    }

    return (
        <Context.Provider value={{
            setList,
            onDeletListItem
        }}
        >
            <Box sx={{
                position: 'fixed',
                top: 65,
                right: 40,
                maxWidth: '50%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
            }}
            >
                {list.map((item) => (
                    <AlertItem key={item.id} item={item} onDeletListItem={onDeletListItem}/>
                ))}
            </Box>
            {children}
        </Context.Provider>
    );
}

AlertProvider.propTypes = {
    children: PropTypes.any
}

export {AlertProvider, useAlert};
