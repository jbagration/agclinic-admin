import {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Avatar,
    TextField,
    CardContent,
    CardHeader,
    Card,
    Divider,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    CircularProgress,
    Alert,
    Input
} from '@material-ui/core';
import {useGet, usePut} from '../../API/request';

const UserFormEdit = (props) => {

    const getU = useGet();
    const putU = usePut();

    const {id} = props;
    const [values, setValues] = useState({
        tradeUrl: '',

    });
    const [errors, setErrors] = useState({
        tradeUrl: false,

    });

    const [isShowLoader, setIsShowLoader] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [nothingChanged, setNothingChanged] = useState(true);

    const [alert, setAlert] = useState({
        txt: '',
        isVisible: false,
        type: 'error'
    });

    const handleChange = (event) => {
        setNothingChanged(false);

        setValues({
            ...values,
            [event.target.name]: event.target.value
        });
        setErrors({
            ...errors,
            [event.target.name]: false
        });
    };


    const showAlert = (type, text) => {
        setAlert({
            txt: text,
            type,
            isVisible: true
        });

        setTimeout(() => {
            setAlert({
                txt: text,
                type,
                isVisible: false
            });

            setSubmitDisabled(false);
        }, 2500);
    };

    const resetPass = () => {
        setValues({
            ...values,
            password: '',
            confirm: ''
        })
    }

    const validate = () => {
        let validComplete = true;
        let formErrors = {...errors};

        if (values.tradeUrl === '') {
            validComplete = false;
            formErrors.tradeUrl = true;
        }

        setErrors(formErrors);
        return validComplete;
    };

    const submit = async () => {
        if (nothingChanged) {
            showAlert('error', 'Nothing changed');
            return;
        }

        if (validate()) {
            setSubmitDisabled(true);

            const data = {
                trade_url: values.tradeUrl,
            };
            setIsShowLoader(true);

            putU(`admin/user/${id}`, data)
                .then((resp) => {
                    if (resp.status === 'success') {
                        showAlert('success', 'Данные успешно обновленны');
                        resetPass();
                    } else {
                        showAlert('error', 'Ошибка');
                    }
                })
                .catch((err) => {
                    showAlert('error', 'Ошибка сервера');
                })
                .finally(() => {
                    setIsShowLoader(false);
                    setSubmitDisabled(false);
                })
            ;
        }
    };

    useEffect(() => {
        getU(`admin/user/${id}`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setValues({
                        tradeUrl: resp.data.user.trade_url
                    })
                }
            });
    }, []);

    return (
        <form>
            <Card>
                <CardHeader
                    title="Редактирование пользователя"
                />
                <Divider/>
                <CardContent sx={{position: 'relative'}}>
                    {isShowLoader && (
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
                            zIndex: 5
                        }}
                        >
                            <CircularProgress/>
                        </Box>
                    )}
                    <TextField
                        fullWidth
                        label="Trade Url"
                        margin="normal"
                        name="tradeUrl"
                        onChange={handleChange}
                        type="text"
                        value={values.tradeUrl}
                        variant="outlined"
                        error={errors.tradeUrl}
                    />

                    <Alert severity={alert.type} style={{display: alert.isVisible ? 'flex' : 'none'}}>
                        {alert.txt}
                    </Alert>
                </CardContent>
                <Divider/>
                <Box sx={{display: 'flex', justifyContent: 'flex-end', p: 2}}>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={submit}
                        disabled={submitDisabled}
                    >
                        Сохранить
                    </Button>
                </Box>
            </Card>
        </form>
    );
};

UserFormEdit.propTypes = {
    id: PropTypes.string.isRequired
};

export default UserFormEdit;
