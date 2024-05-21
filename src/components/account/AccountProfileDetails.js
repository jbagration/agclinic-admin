import {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    TextField,
    Alert
} from '@material-ui/core';
import TokenStorage from '../../API/TokenStorage';
import {useGet, usePut} from '../../API/request';

const AccountProfileDetails = (props) => {

    const getU = useGet();
    const putU = usePut();

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        confirm: ''
    });
    const [errors, setErrors] = useState({
        name: false,
        email: false,
        password: false,
        confirm: false
    });


    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [nothingChanged, setNothingChanged] = useState(true);

    const [alertInfo, setAlertInfo] = useState({
        txt: '',
        isVisible: false,
        type: 'error'
    });
    const [alertPassword, setAlertPassword] = useState({
        txt: '',
        isVisible: false,
        type: 'error'
    });

    const handleChange = (event) => {
        if (nothingChanged === true) {
            setNothingChanged(false);
        }

        setValues({
            ...values,
            [event.target.name]: event.target.value
        });
        setErrors({
            ...errors,
            [event.target.name]: false
        });
    };

    const showAlertInfo = (type, text) => {
        setAlertInfo({
            txt: text,
            type,
            isVisible: true
        });

        setTimeout(() => {
            setAlertInfo({
                txt: text,
                type,
                isVisible: false
            });

            setSubmitDisabled(false);
        }, 2500);
    };

    const showAlertPassword = (type, text) => {
        setAlertPassword({
            txt: text,
            type,
            isVisible: true
        });

        setTimeout(() => {
            setAlertPassword({
                txt: text,
                type,
                isVisible: false
            });

            setSubmitDisabled(false);
        }, 2500);
    };

    const validateInfo = () => {
        let validComplete = true;
        let formErrors = {...errors};

        if (values.name.trim() === '') {
            validComplete = false;
            formErrors.firstName = true;
            showAlertInfo('error', "Поле User Name не должно быть пустым")

        }

        if (values.email.trim() === '') {
            validComplete = false;
            formErrors.password = true;
            showAlertInfo('error', "Поле User Name не должно быть пустым")
        }


        setErrors(formErrors);
        return validComplete;
    };

    const validatePassword = () => {
        let validComplete = true;
        let formErrors = {...errors};

        if (values.password) {
            if (!values.password) {
                validComplete = false;
                formErrors.password = true;
                showAlertPassword('error', "Поле Пароль не должно быть пустым")
            } else if (values.password.length < 8) {
                validComplete = false;
                formErrors.password = true;
                showAlertPassword('error', "Пароль должен содержать более 8 символов")
            }

            if (values.password !== values.confirm) {
                validComplete = false;
                formErrors.confirm = true;
                showAlertPassword('error', "Пароли не совпадают")
            }
        }

        setErrors(formErrors);
        return validComplete;
    };

    const onSubmitInfo = async () => {
        setSubmitDisabled(true);

        if (nothingChanged) {
            showAlertInfo('error', 'Нет изменений');
            return;
        }

        if (validateInfo()) {
            const payload = {
                username: values.firstName,
                email: values.email,
            };

            putU(`users/current`, payload)
                .then((resp) => {
                    if (resp.status === 'success') {
                        showAlertInfo('success', 'Вы успешно обновили данные');
                    }
                })
                .catch((err) => {
                    showAlertInfo('error', 'Ошибка сервара');
                });
        }
    };

    const onSubmitPassword = async () => {
        setSubmitDisabled(true);

        if (nothingChanged) {
            showAlertInfo('error', 'Нет изменений');
            return;
        }

        if (validatePassword()) {
            const payload = {
                password: values.password,
            };

            putU(`users/current/password`, payload)
                .then((resp) => {
                    if (resp.status === 'success') {
                        showAlertPassword('success', 'Вы успешно обновили данные');
                    }
                })
                .catch((err) => {
                    showAlertPassword('error', 'Ошибка сервара');
                });
        }
    };

    useEffect(async () => {
        getU(`users/current`)
            .then((resp) => {
                if (resp.status === 'success') {
                    let userData = resp.data.user;
                    let vals = {
                        username: userData.username || '',
                        email: userData.email || '',
                    };
                    setValues(vals);
                }
            })
            .catch((err) => {
                showAlertInfo('error', 'Данные не были загружены');
            });
    }, []);

    return (
        <form
            autoComplete="off"
            noValidate
            {...props}
        >
            <Card>
                <Divider/>
                <CardContent>
                    <Grid container spacing={3} matginTop={3}>
                        <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                onChange={handleChange}
                                required
                                value={values.name}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                name="email"
                                onChange={handleChange}
                                required
                                value={values.email}
                                variant="outlined"
                            />
                        </Grid>

                    </Grid>
                    <Alert severity={alertInfo.type}
                           style={{display: alertInfo.isVisible ? 'flex' : 'none', margin: '12px 0'}}>
                        {alertInfo.txt}
                    </Alert>
                </CardContent>
                <Divider/>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        p: 2
                    }}
                >
                    <Button
                        color="primary"
                        variant="contained"
                        disabled={submitDisabled}
                        onClick={onSubmitInfo}
                    >
                        Обновить
                    </Button>
                </Box>
            </Card>

            <Card sx={{mt:4}}>
                <Divider/>
                <CardContent>
                    <Grid container spacing={3} matginTop={3}>
                        <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                onChange={handleChange}
                                required
                                type="password"
                                value={values.password}
                                variant="outlined"
                                error={errors.password}
                                helperText={errors.password && 'Password shouldn\'t be shorter than 6 characters'}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                label="Confirm"
                                name="confirm"
                                onChange={handleChange}
                                type="password"
                                required
                                value={values.confirm}
                                variant="outlined"
                                error={errors.confirm}
                                helperText={errors.confirm && 'Passwords are different'}
                            />
                        </Grid>

                    </Grid>

                    <Alert severity={alertPassword.type}
                           style={{display: alertPassword.isVisible ? 'flex' : 'none', margin: '12px 0'}}>
                        {alertPassword.txt}
                    </Alert>
                </CardContent>
                <Divider/>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        p: 2
                    }}
                >
                    <Button
                        color="primary"
                        variant="contained"
                        disabled={submitDisabled}
                        onClick={onSubmitPassword}
                    >
                        Обновить
                    </Button>
                </Box>
            </Card>
        </form>
    );
};

export default AccountProfileDetails;
