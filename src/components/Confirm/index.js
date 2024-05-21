import React, {useState, useContext} from 'react';
import PropTypes from 'prop-types';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography
} from '@material-ui/core';

const Context = React.createContext();

const useConfirm = () => {
    const {
        setOpen,
        setTitle,
        setContent,
        setOnConfirm,
        setList,
        setWarning
    } = useContext(Context);

    return ({title = '', content = '', onConfirm = () => {}, list = [], warning = ''}) => {
        setTitle(title);
        setContent(content);
        setOnConfirm(() => onConfirm);
        setOpen(true);
        setList(list);
        setWarning(warning)
    };
}

const Confirm = ({children}) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [list, setList] = useState([]);
    const [content, setContent] = useState('');
    const [warning, setWarning] = useState('');
    const [onConfirm, setOnConfirm] = useState(() => () => {});

    return (
        <Context.Provider value={{
            setOpen,
            setTitle,
            setContent,
            setOnConfirm,
            setList,
            setWarning
        }}
        >
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="confirm-dialog"
            >
                <DialogTitle>
                    <Typography color="textPrimary" variant="h4" component="p" sx={{textAlign: 'center'}}>
                        {title}
                    </Typography>
                </DialogTitle>
                <DialogContent>

                    <Typography color="textPrimary" variant="body1" component="p" sx={{maxWight: 200}}>
                        {content}
                    </Typography>
                    {list &&
                        list.map((item) => <Typography color="textPrimary" variant="body1" component="p" sx={{maxWight: 200}}>
                            - {item}
                        </Typography>)
                    }
                    {warning &&
                    <Typography color="textPrimary" variant="body1" component="p" sx={{maxWight: 200, color: 'red', mt:1}}>
                        {warning}
                    </Typography>
                    }

                </DialogContent>
                <DialogActions sx={{display: 'flex', justifyContent: 'center'}}>
                    <Button
                        variant="contained"
                        onClick={() => setOpen(false)}
                        color="primary"
                        sx={{flex: 1}}
                    >
                        Нет
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            setOpen(false);
                            onConfirm();
                        }}
                        color="primary"
                        sx={{flex: 1}}
                    >
                        Да
                    </Button>
                </DialogActions>
            </Dialog>
            {children}
        </Context.Provider>
    );
}

Confirm.propTypes = {
    children: PropTypes.any
}

export {Confirm, useConfirm};
