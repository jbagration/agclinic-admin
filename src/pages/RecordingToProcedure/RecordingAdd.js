import React, {useEffect, useState} from 'react';
import {Helmet} from 'react-helmet';
import {
    Box,
    Container,
    Button,
    Card,
    CardHeader,
    Divider,
    CardContent,
    Breadcrumbs,
    TextField,
    Alert,
    Grid,
    OutlinedInput,
    Checkbox,
    ListItemText,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import {useParams, useNavigate, Link} from 'react-router-dom';
import {useGet, usePut, usePost} from "../../API/request";
import {BallTriangle} from "react-loader-spinner";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import '../../styles/Avatar/style.css'

const RecordingToProcedureAdd = () => {

    const navigate = useNavigate();
    const getU = useGet();
    const postU = usePost();
    const putU = usePut();

    const [isLoaded, setIsLoaded] = useState(true);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [values, setValues] = useState({
        name: "",
        phone: "+79507088469",
        city_id: null,
        services_id: null,
    });
    const [errors, setErrors] = useState({
        name: false,
        city_id: false,
        phone: false,
        services_id: false,
    });

    const [cities, setCities ] = useState([])
    const [specialists, setSpecialists ] = useState([])
    const [choosenCity, setChoosenCity] = useState("")
    const [choosenSpecialist, setChoosenSpecialist] = useState("")

    const [alert, setAlert] = useState({
        txt: '',
        type: 'error',
        isVisisble: false,
    });

    const handleChange = (event, name) => {
          setValues({
            ...values,
            [name]: event.target.value  // Для остальных полей
          });

        setErrors({
          ...errors,
          [name]: false
        });
    };


    const handleChangeCity = (event) => {
        const value = event.target.value
        setChoosenCity(value);
        setValues({
            ...values,
            city_id: cities?.find(elem => elem.name === value)?.id,
        })
        setErrors({
            ...errors,
            city_id: false
        });
    }

    const handleChangeSpecialist = (event) => {
        const value = event.target.value
        setChoosenSpecialist(value);
        setValues({
            ...values,
            services_id: specialists?.find(elem => elem.title === value)?.id,
        })
        setErrors({
            ...errors,
            services_id: false
        });
    }

    const showAlert = (type, text) => {
        setAlert({
            txt: text,
            type,
            isVisisble: true,
        });

        setTimeout(() => {
            setAlert({
                txt: text,
                type,
                isVisisble: false,
            });

            setSubmitDisabled(false);
        }, 2500);
    };

    const clearForm = () => {
        setChoosenCity("")
        setChoosenSpecialist("")
        setValues({
            name: "",
            city_id: null,
            specialist_id: null,
            description: "",
            });
    };

    const validate = () => {
        let validComplete = true;
        let formErrors = {...errors};

        if (values.name === '') {
            validComplete = false;
            formErrors.title = false;
            showAlert('error', "Поле name не должно быть пустым")
        }

        if (values.phone === '') {
            validComplete = false;
            formErrors.title = false;
            showAlert('error', "Поле телефон не должно быть пустым")
        }

        if ( !values.city_id) {
            validComplete = false;
            formErrors.city_id = false;
            showAlert('error', "Поле Город не должно быть пустым")
        }

        if ( !values.services_id) {
            validComplete = false;
            formErrors.city_id = false;
            showAlert('error', "Поле Процедура не должно быть пустым")
        }

        setErrors(formErrors);
        return validComplete;
    };

    const submit = async () => {
    if (validate()) {
        setSubmitDisabled(true);

        postU(`recording_to_procedure`, values)
        .then((resp) => {
            if (resp.status === 'success') {
                showAlert('success', 'Запись добавлена');
            }
        })
        .catch((err) => {
            const errorMessage = err.response?.data?.message || 'Произошла ошибка';
            showAlert('error', errorMessage);
        })
        .finally(() => {
            setSubmitDisabled(false);
        });
        }
      };

    useEffect(() => {
        setIsLoaded(true)
        getU(`city`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setCities(resp.data.city)
                }
            })
            .catch((err) => {
                console.log(err)
                showAlert('error', 'Произошла ошибка при загрузке городов, попробуйте перезайти')
            })
            .finally(() => {
                setIsLoaded(false)
            });
        getU(`services?page=1&limit=99999`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setSpecialists(resp.data.service)
                }
            })
            .catch(() => {
                showAlert('error', 'Произошла ошибка при загрузке процедур, попробуйте перезайти');
            })
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
                <title>Добавление записи на процедуру</title>
            </Helmet>
            <Box sx={{pt: 2}}>
                <Container maxWidth={false}>
                    <Button startIcon={<ChevronLeft/>} onClick={() => navigate(-1)}>
                        Назад
                    </Button>
                    <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 14 }}>
                        <Link underline="hover" color="inherit" to="/app/recording_to_procedure">
                            Запись на процедуру
                        </Link>
                            <p>Добавление записи</p>
                    </Breadcrumbs>
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
                                    title="Добавление записи"
                                />
                                <Divider/>
                                <CardContent sx={{position: 'relative'}}>
                                    <TextField
                                        fullWidth
                                        label="Имя"
                                        margin="normal"
                                        name="name"
                                        onChange={(event) => handleChange(event, 'name')}
                                        type="text"
                                        value={values.name}
                                        variant="outlined"
                                        error={errors.name}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Телефон"
                                        margin="normal"
                                        name="phone"
                                        onChange={(event) => handleChange(event, 'phone')}
                                        type="text"
                                        value={values.phone}
                                        variant="outlined"
                                        error={errors.phone}
                                    />
                                    <FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
                                        <InputLabel id="Город">Город</InputLabel>
                                        <Select
                                            label="Город"
                                            name="city_id"
                                            value={choosenCity}
                                            onChange={handleChangeCity}
                                            input={<OutlinedInput label="Город" />}
                                        >
                                            {cities?.map((city) => (
                                            <MenuItem key={city.name} value={city.name}>{city.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
                                        <InputLabel id="Город">Процедура</InputLabel>
                                        <Select
                                            label="Процедура"
                                            name="services_id"
                                            value={choosenSpecialist}
                                            onChange={handleChangeSpecialist}
                                            input={<OutlinedInput label="Процедура" />}
                                        >
                                            {specialists?.map((city) => (
                                                <MenuItem key={city.title} value={city.title}>{city.title}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <Alert severity={alert.type}
                                           style={{display: alert.isVisisble ? 'flex' : 'none'}}>
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
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default RecordingToProcedureAdd;
