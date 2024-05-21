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
import UserFormEdit from '../../components/Users/UserFormEdit';
import {useGet, usePut, usePost} from "../../API/request";
import {BallTriangle} from "react-loader-spinner";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import '../../styles/Avatar/style.css'
import { DataGrid } from '@mui/x-data-grid';
import { Paper } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RecordingToSpecialistAdd = () => {

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
        specialist_id: null,
    });
    const [errors, setErrors] = useState({
        name: false,
        city_id: false,
        phone: false,
        specialist_id: false,
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
            specialist_id: specialists?.find(elem => elem.fio === value)?.id,
        })
        setErrors({
            ...errors,
            specialist_id: false
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

        if ( !values.specialist_id) {
            validComplete = false;
            formErrors.city_id = false;
            showAlert('error', "Поле Специалист не должно быть пустым")
        }

        setErrors(formErrors);
        return validComplete;
    };

    const submit = async () => {
    if (validate()) {
        setSubmitDisabled(true);

        postU(`recording_to_specialist`, values)
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
        getU(`specialist?page=1&limit=999999`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setSpecialists(resp.data.specialist)
                }
            })
            .catch(() => {
                showAlert('error', 'Произошла ошибка при загрузке специалистов, попробуйте перезайти');
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
                <title>Добавление записи к специалисту</title>
            </Helmet>
            <Box sx={{pt: 2}}>
                <Container maxWidth={false}>
                    <Button startIcon={<ChevronLeft/>} onClick={() => navigate(-1)}>
                        Назад
                    </Button>
                    <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 14 }}>
                        <Link underline="hover" color="inherit" to="/app/recording_to_specialist">
                            Запись к специалисту
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
                                        <InputLabel id="Город">Специалист</InputLabel>
                                        <Select
                                            label="Город"
                                            name="specialist_id"
                                            value={choosenSpecialist}
                                            onChange={handleChangeSpecialist}
                                            input={<OutlinedInput label="Специалист" />}
                                        >
                                            {specialists?.map((city) => (
                                                <MenuItem key={city.fio} value={city.fio}>{city.fio}</MenuItem>
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

export default RecordingToSpecialistAdd;
