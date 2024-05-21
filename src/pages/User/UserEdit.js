import React, {useEffect, useState} from 'react';
import {Helmet} from 'react-helmet';
import {
    Box,
    Container,
    Button, Card, CardHeader, Divider, CardContent, CircularProgress, TextField, Alert, Grid
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import {useParams, useNavigate} from 'react-router-dom';
import UserFormEdit from '../../components/Users/UserFormEdit';
import {useGet, usePut} from "../../API/request";
import {BallTriangle} from "react-loader-spinner";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import '../../styles/Avatar/style.css'

const UserEdit = () => {

    const {id} = useParams();
    const navigate = useNavigate();
    const getU = useGet();
    const putU = usePut();

    const [isLoaded, setIsLoaded] = useState(true);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [nothingChanged, setNothingChanged] = useState(true);

    const [uploadedImg, setUploadedImg] = useState('/static/images/defphoto.jpg');
    const [values, setValues] = useState({
        email: '',
        username: '',
        role: '',
        password: '',
        confirm: '',
        img: ''
    });
    const [errors, setErrors] = useState({
        email: false,
        username: false,
        role: false,
        password: false,
        confirm: false,
        img: false
    });
    const [roles, setRoles] = useState([])


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

    const avaUploaded = (event) => {
        setNothingChanged(false)
        setUploadedImg(URL.createObjectURL(event.target.files[0]));
        setValues({
            ...values,
            img: event.target.files[0]
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

    const validateInfo = () => {
        let validComplete = true;
        let formErrors = {...errors};

        if (values.role === '') {
            validComplete = false;
            formErrors.role = false;
            showAlert('error', "Поле Role не должно быть пустым")
        }

        if (values.email === '') {
            validComplete = false;
            formErrors.email = false;
            showAlert('error', "Поле Email не должно быть пустым")

        }
        if (values.username === '') {
            validComplete = false;
            formErrors.username = false;
            showAlert('error', "Поле User Name не должно быть пустым")

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
                showAlert('error', "Поле Пароль не должно быть пустым")
            } else if (values.password.length < 8) {
                validComplete = false;
                formErrors.password = true;
                showAlert('error', "Пароль должен содержать более 8 символов")
            }

            if (values.password !== values.confirm) {
                validComplete = false;
                formErrors.confirm = true;
                showAlert('error', "Пароли не совпадают")
            }
        }

        setErrors(formErrors);
        return validComplete;
    };

    const submitAvatar = async () => {
        if (nothingChanged) {
            showAlert('error', 'Нет изменений');
            return;
        }

        setSubmitDisabled(true);

        let data = new FormData();
        data.append('avatar', values.img);
        console.log(data, values.img)

        putU(`admin/users/avatar/${id}`, data)
            .then((resp) => {
                if (resp.status === 'success') {
                    showAlert('success', 'Данные успешно обновленны');
                } else {
                    showAlert('error', 'Ошибка');
                }
            })
            .catch((err) => {
                showAlert('error', 'Ошибка сервера');
            })
            .finally(() => {
                setSubmitDisabled(false);
            })
        ;

    };


    const submitInfo = async () => {
        if (nothingChanged) {
            showAlert('error', 'Нет изменений');
            return;
        }

        if (validateInfo()) {
            setSubmitDisabled(true);

            const data = {
                username: values.username,
                email: values.email,
                role: values.role
            };

            putU(`admin/users/${id}`, data)
                .then((resp) => {
                    if (resp.status === 'success') {
                        showAlert('success', 'Данные успешно обновленны');
                    } else {
                        showAlert('error', 'Ошибка');
                    }
                })
                .catch((err) => {
                    showAlert('error', 'Ошибка сервера');
                })
                .finally(() => {
                    setSubmitDisabled(false);
                })
            ;
        }
    };

    const submitPassword = async () => {
        if (nothingChanged) {
            showAlert('error', 'Нет изменений');
            return;
        }

        if (validatePassword()) {
            setSubmitDisabled(true);

            const data = {
                password: values.password
            };

            putU(`admin/users/password/${id}`, data)
                .then((resp) => {
                    if (resp.status === 'success') {
                        showAlert('success', 'Данные успешно обновленны');
                        setValues({...values, password: '', confirm: ''})
                    } else {
                        showAlert('error', 'Ошибка');
                    }
                })
                .catch((err) => {
                    showAlert('error', 'Ошибка сервера');
                })
                .finally(() => {
                    setSubmitDisabled(false);
                })
            ;
        }
    };

    useEffect(() => {
        setIsLoaded(true)
        getU(`admin/users/${id}`)
            .then((resp) => {
                if (resp.status === 'success') {
                    const data = {
                        username: resp.data.user.username,
                        email: resp.data.user.email,
                        role: resp.data.user.role
                    }

                    const avatar = resp.data.user.avatar
                        ? `${process.env.REACT_APP_API_URL}/uploads/avatars/${resp.data.user.avatar}`
                        : ''

                    setValues(data)

                    setUploadedImg(avatar)
                }
            })
            .catch(() => {
                showAlert('error', 'Произошла ошибка при загрузке ролей, попробуйте перезайти');
            })
            .finally(() => {

            });
        getU(`roles`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setRoles(resp.data.roles)
                }
            })
            .catch(() => {

            })
            .finally(() => {
                setIsLoaded(false)
            });
    }, []);


    if (isLoaded) {
        return (
            <div className="loader">
                <BallTriangle
                    height="100"
                    width="100"
                    color='grey'
                    ariaLabel='loading'
                />
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Edit user</title>
            </Helmet>
            <Box className="headerWrapper">
                <Box className="headerTitle">
                    <Button startIcon={<ChevronLeft/>} onClick={() => navigate(-1)}>
                        Назад
                    </Button>
                    Пользователи
                </Box>
                <ul className="headerList">
                    <li onClick={() => navigate(-1)}>Пользователи</li>
                    <li>/</li>
                    <li>Редактирование</li>
                </ul>

            </Box>

            {/*image*/}
            <Box sx={{backgroundColor: 'background.default', pt: 3}}>

                <Container maxWidth={false}>
                    <Box sx={{mb: 1}}>
                        <Alert severity={alert.type} style={{display: alert.isVisible ? 'flex' : 'none'}}>
                            {alert.txt}
                        </Alert>
                    </Box>
                    <Box sx={{
                        paddingBottom: 1
                    }}>
                        <form>
                            <Card>
                                <CardHeader
                                    title="Редактирование аватарки"
                                />
                                <Divider/>
                                <CardContent sx={{position: 'relative'}}>
                                    <div className="itemWrapper">
                                        <div className="container">
                                            <input accept="xlsx/*" type="file" style={{display: 'none'}}
                                                   id={1}
                                                   onChange={(event) => avaUploaded(event, 1)}/>
                                            <label htmlFor={1}>
                                                <img src={uploadedImg} className="itemImg"/>
                                                <div className="middle"/>
                                            </label>
                                        </div>
                                        <div className="help-text">
                                            Доступны следующие расширения: .png .jpg .svg .bmp .tga .webp
                                        </div>
                                    </div>
                                </CardContent>
                                <Divider/>
                                <Box sx={{display: 'flex', justifyContent: 'flex-end', p: 2}}>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        onClick={submitAvatar}
                                        disabled={submitDisabled}
                                    >
                                        Сохранить
                                    </Button>
                                </Box>
                            </Card>
                        </form>
                    </Box>
                </Container>
            </Box>

            {/*info*/}
            <Box sx={{backgroundColor: 'background.default', pt: 3}}>

                <Container maxWidth={false}>
                    <Box sx={{
                        paddingBottom: 1
                    }}>
                        <form>
                            <Card>
                                <CardHeader
                                    title="Редактирование пользователя"
                                />
                                <Divider/>
                                <CardContent sx={{position: 'relative'}}>
                                    <TextField
                                        fullWidth
                                        label="User name"
                                        margin="normal"
                                        name="username"
                                        onChange={handleChange}
                                        type="text"
                                        value={values.username}
                                        variant="outlined"
                                        error={errors.username}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        margin="normal"
                                        name="email"
                                        onChange={handleChange}
                                        type="text"
                                        value={values.email}
                                        variant="outlined"
                                        error={errors.email}
                                    />
                                    <FormControl fullWidth sx={{mt: 2, mb: 1}}>
                                        <InputLabel id="role">
                                            Role
                                        </InputLabel>
                                        <Select
                                            labelId="Role"
                                            name="role"
                                            value={values.role}
                                            label="Role"
                                            onChange={handleChange}
                                        >
                                            {
                                                roles?.map((item) => <MenuItem value={item}>{item}</MenuItem>)
                                            }
                                        </Select>
                                    </FormControl>
                                </CardContent>
                                <Divider/>
                                <Box sx={{display: 'flex', justifyContent: 'flex-end', p: 2}}>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        onClick={submitInfo}
                                        disabled={submitDisabled}
                                    >
                                        Сохранить
                                    </Button>
                                </Box>
                            </Card>
                        </form>
                    </Box>
                </Container>
            </Box>

            {/*password*/}
            <Box sx={{backgroundColor: 'background.default', pt: 3}}>
                <Container maxWidth={false}>
                    <Box>
                        <form>
                            <Card>
                                <CardHeader
                                    title="Редактирование пароля"
                                />
                                <Divider/>
                                <CardContent sx={{position: 'relative'}}>
                                    <TextField
                                        sx={{mb: 2}}
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
                                </CardContent>
                                <Divider/>
                                <Box sx={{display: 'flex', justifyContent: 'flex-end', p: 2}}>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        onClick={submitPassword}
                                        disabled={submitDisabled}
                                    >
                                        Сохранить
                                    </Button>
                                </Box>
                            </Card>
                        </form>
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default UserEdit;
