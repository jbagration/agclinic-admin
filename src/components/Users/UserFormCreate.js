import {useState, useEffect} from 'react';
import {
    Alert,
    Box,
    TextField,
    CardContent,
    CardHeader,
    Card,
    Divider,
    Button,
    Input,
    Typography,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@material-ui/core';
import TokenStorage from '../../API/TokenStorage';
import {usePost} from '../../API/request';

const UserFormCreate = () => {

    const postU = usePost();

    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        login: '',
        avatar: '',
        phoneNumber: '',
        password: '',
        confirm: ''
    });
    const [errors, setErrors] = useState({
        firstName: false,
        lastName: false,
        email: false,
        login: false,
        avatar: false,
        phoneNumber: false,
        password: false,
        confirm: false
    });
    const [isValidateEmail, setIsValidateEmail] = useState(true);
    const [isShowLoader, setIsShowLoader] = useState(false);
    const [isAvaLoaded, setIsAvaLoaded] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const [uploadedImgName, setUploadedImgName] = useState('');
    const [role, setRole] = useState('2');
    const [alert, setAlert] = useState({
        txt: '',
        isVisible: false,
        type: 'error'
    });

    const handleChange = (event) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value
        });
        setErrors({
            ...errors,
            [event.target.name]: false
        });
    };

    const handleChangeEmail = (event) => {
        const reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        setIsValidateEmail(!!event.target.value.match(reg));
        setValues({
            ...values,
            email: event.target.value
        });
    };

    const avaUploaded = (event) => {
        let pathParts = event.target.value.split('\\');
        setUploadedImgName(pathParts[pathParts.length - 1]);
        setIsAvaLoaded(true);
        setValues({
            ...values,
            img: event.target.files[0]
        });
    };

    const roleChanged = (evt) => {
        setRole(evt.target.value);
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
        }, 3000);
    };

    const validate = () => {
        let validComplete = true;
        let formErrors = {...errors};

        if (!isValidateEmail || values.email.trim() === '') {
            validComplete = false;
            formErrors.email = true;
            setIsValidateEmail(false);
        }

        if (values.login.trim() === '') {
            validComplete = false;
            formErrors.login = true;
        }

        if (values.password.trim() === '') {
            validComplete = false;
            formErrors.password = true;
        }

        if (!values.password) {
            validComplete = false;
            formErrors.password = true;
        } else if (values.password.length < 6) {
            validComplete = false;
            formErrors.password = true;
        }
        if (!values.confirm) {
            validComplete = false;
            formErrors.confirm = true;
        } else if (values.password !== values.confirm) {
            validComplete = false;
            formErrors.confirm = true;
        }

        setErrors(formErrors);
        return validComplete;
    };

    const clearForm = () => {
        let vals = {...values};

        for (let key in vals) {
            vals[key] = '';
        }

        setValues(vals);
    };

    const submit = async () => {
        if (validate()) {
            setIsShowLoader(true);
            setSubmitDisabled(true);

            postU('', {
                email: values.email,
                login: values.login,
                role_id: role,
                password: values.password,
                repeat_password: values.confirm
            })
                .then((resp) => {
                    if (resp.status === 'success') {
                        showAlert('success', 'Вы успешно добавили пользователя');
                        clearForm();
                    } else {
                        showAlert('error', 'Ошибка');
                    }

                    setIsShowLoader(false);
                })
                .catch((err) => {
                    console.log(err.response)
                    setIsShowLoader(false);
                    if (err.response.data.message === 'A user with such an email already exists') {
                        showAlert('error', 'Пользователь с такой почтой уже суещствует');
                    } else if (err.response.data.message === 'A user with such a login exists') {
                        showAlert('error', 'Пользователь с таким логином уже суещствует');
                    } else {
                        showAlert('error', 'Ошибка сервера');
                    }
                });
        }
    };

    return (
        <form>
            <Card>
                <CardHeader
                    title="Создание нового пользователя"
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
                    <Typography color="textPrimary" variant="h4">Аватар</Typography>
                    <Box>
                        <Input accept="image/*" type="file" style={{display: 'none'}} id="userAvatarUpload"
                               onChange={avaUploaded}/>
                        <label htmlFor="userAvatarUpload">
                            <Button variant="contained" style={{marginTop: '7px'}} component="span">
                                Загрузить
                            </Button>
                        </label>
                        <Typography
                            style={{
                                display: isAvaLoaded ? 'inline' : 'none',
                                marginLeft: '8px',
                                position: 'relative',
                                top: '3.5px'
                            }}>
                            {uploadedImgName}
                        </Typography>
                    </Box>
                    <TextField
                        fullWidth
                        label="First name"
                        margin="normal"
                        name="firstName"
                        onChange={handleChange}
                        type="text"
                        value={values.firstName}
                        variant="outlined"
                        error={errors.firstName}
                    />
                    <TextField
                        fullWidth
                        label="Last name"
                        margin="normal"
                        name="lastName"
                        onChange={handleChange}
                        type="text"
                        value={values.lastName}
                        variant="outlined"
                        error={errors.lastName}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        margin="normal"
                        name="email"
                        onChange={handleChangeEmail}
                        type="email"
                        value={values.email}
                        variant="outlined"
                        error={!isValidateEmail}
                        helperText={!isValidateEmail && 'Type correct email'}
                    />
                    <TextField
                        fullWidth
                        label="Login"
                        margin="normal"
                        name="login"
                        onChange={handleChange}
                        type="text"
                        value={values.login}
                        variant="outlined"
                        error={errors.login}
                    />
                    <TextField
                        fullWidth
                        label="Пароль"
                        margin="normal"
                        name="password"
                        onChange={handleChange}
                        type="password"
                        value={values.password}
                        variant="outlined"
                        error={errors.password}
                        helperText={errors.password && 'Password shouldn\'t be shorter than 6 characters'}
                    />
                    <TextField
                        fullWidth
                        label="Повторите пароль"
                        margin="normal"
                        name="confirm"
                        onChange={handleChange}
                        type="password"
                        value={values.confirm}
                        variant="outlined"
                        error={errors.confirm}
                        helperText={errors.confirm && 'Passwords are different'}
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
                        Создать
                    </Button>
                </Box>
            </Card>
        </form>
    );
};

export default UserFormCreate;
