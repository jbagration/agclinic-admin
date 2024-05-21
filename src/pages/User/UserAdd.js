import {Helmet} from 'react-helmet';
import {
    Box,
    Container,
    Button, TextField, CardContent
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import {useNavigate} from 'react-router-dom';
import {useGet, usePost, usePut} from "../../API/request";
import React, {useEffect, useState} from "react";
import {BallTriangle} from "react-loader-spinner";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Alert from "@material-ui/core/Alert";

const UserAdd = () => {

    const navigate = useNavigate();
    const postU = usePost();
    const getU = useGet();
    const putU = usePut();

    const [isLoaded, setIsLoaded] = useState(true);

    const [isValidateEmail, setIsValidateEmail] = useState(true);
    const [values, setValues] = useState({
        email: '',
        username: '',
        role: '',
        password: '',
        confirm: ''
    });
    const [errors, setErrors] = useState({
        email: false,
        username: false,
        role: false,
        password: false,
        confirm: false
    });
    const [roles, setRoles] = useState([])

    const [isShowLoader, setIsShowLoader] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);

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
        }, 1400);
    };


    const handleChangeEmail = (event) => {
        const reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        setIsValidateEmail(!!event.target.value.match(reg));
        setValues({
            ...values,
            email: event.target.value
        });
    };

    const validate = () => {
        let validComplete = true;
        let formErrors = {...errors};

        if (values.role === '') {
            validComplete = false;
            formErrors.role = false;
            showAlert('error', "Поле Role не должно быть пустым")
        }

        if ( values.email === '') {
            validComplete = false;
            formErrors.email = false;
            showAlert('error', "Поле Email не должно быть пустым")
        } else if(!isValidateEmail){
            validComplete = false;
            formErrors.email = false;
            showAlert('error', "Вы передели в поле email не корректные данные")
        }

        if (values.username === '') {
            validComplete = false;
            formErrors.username = false;
            showAlert('error', "Поле User Name не должно быть пустым")

        }

        if (values.password === '') {
            validComplete = false;
            formErrors.password = false;
            showAlert('error', "Поле Пароль не должно быть пустым")
        } else if(values.password.length < 8){
            validComplete = false;
            formErrors.password = false;
            showAlert('error', "Пароль должен содержать более 8 символов")
        }

        if (values.confirm === '') {
            validComplete = false;
            formErrors.confirm = false;
            showAlert('error', "Поле User Name не должно быть пустым")
        } else if(values.confirm.length < 8){
            validComplete = false;
            formErrors.confirm = false;
            showAlert('error', "Пароль должен содержать более 8 символов")
        } else if(values.confirm !== values.password){
            validComplete = false;
            formErrors.confirm = false;
            showAlert('error', "Пароли должны совпадать")
        }

        setErrors(formErrors);
        return validComplete;
    };



    const clearForm = () => {
        setValues({
            username: '',
            email: '',
            password: '',
            confirm: ''
        });
    };

    const submit = async () => {
        if (validate()) {
            setIsShowLoader(true);
            setSubmitDisabled(true);

            const data = {
                username: values.username,
                email: values.email,
                role: values.role,
                password: values.password
            };

            postU('admin/users', data)
                .then((resp) => {
                    if (resp.status === 'success') {
                        showAlert('success', 'Admin added');
                        clearForm();
                    } else {
                        showAlert('error', 'Ошибка');
                    }
                })
                .catch((err) => {
                    showAlert('error', 'Ошибка сервера');
                    setIsShowLoader(false);
                    setSubmitDisabled(false);
                })
                .finally(()=>{

                });
        }
    };
    useEffect(() => {
        setIsLoaded(true)
        getU(`roles`)
            .then((resp) => {
                if (resp.status === 'success') {
                    console.log(resp.data.roles)
                    setRoles(resp.data.roles)
                    setValues({...values, role: resp.data.roles[1]})
                }
            })
            .catch(() => {
                showAlert('error', 'Произошла ошибка при загрузке ролей, попробуйте перезайти');

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
                <title>Create new user</title>
            </Helmet>
            <Box sx={{pt: 2}}>
                <Container maxWidth={false}>
                    <Button startIcon={<ChevronLeft/>} onClick={() => navigate(-1)}>
                        Back
                    </Button>
                </Container>
            </Box>
            <Box sx={{backgroundColor: 'background.default', minHeight: '100%'}}>
                <Container maxWidth={false}>
                    <Box sx={{pt: 2}}>
                        <form>
                            <Card>
                                <CardHeader
                                    title="Добавление нового пользователя"
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
                                        onChange={handleChangeEmail}
                                        type="text"
                                        value={values.email}
                                        variant="outlined"
                                        error={errors.email}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        margin="normal"
                                        name="password"
                                        onChange={handleChange}
                                        type="password"
                                        value={values.password}
                                        variant="outlined"
                                        error={errors.password}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Confirm Password"
                                        margin="normal"
                                        name="confirm"
                                        onChange={handleChange}
                                        type="password"
                                        value={values.confirm}
                                        variant="outlined"
                                        error={errors.confirm}
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

                                    <Alert severity={alert.type}
                                           style={{display: alert.isVisible ? 'flex' : 'none'}}>
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
                                        Добавить
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

export default UserAdd;
