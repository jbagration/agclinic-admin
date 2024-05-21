import {Helmet} from 'react-helmet';
import {
    Box,
    Container,
    Button, TextField, CardContent
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
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
import Breadcrumbs from "@material-ui/core/Breadcrumbs";

const CityEdit = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const getU = useGet();
    const putU = usePut();

    const [isLoaded, setIsLoaded] = useState(false);

    const [city, setCity] = useState([]);
    const [values, setValues] = useState({
        name: ''
    });
    const [errors, setErrors] = useState({
        name: false,
    });

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

    const validate = () => {
        let validComplete = true;
        let formErrors = {...errors};

        if (values.name === '') {
            validComplete = false;
            formErrors.name = false;
            showAlert('error', "Введите название города")

        }

        setErrors(formErrors);
        return validComplete;
    };

    const clearForm = () => {
        setValues({
            name: '',
        });
    };

    const submit = async () => {
        if (validate()) {
            setIsShowLoader(true);
            setSubmitDisabled(true);

            const data = {
                name: values.name,
            };

            putU(`city/${id}`, data)
                .then((resp) => {
                    if (resp.status === 'success') {
                        showAlert('success', 'Город обновлён');
                        clearForm();
                    } else if (resp.status === 'success') {


                    } else {
                        showAlert('error', 'Ошибка');
                    }
                })
                .catch((err) => {
                    showAlert('error', 'Ошибка сервера');
                    setIsShowLoader(false);
                    setSubmitDisabled(false);
                })
        }
    };

    useEffect(() => {
        setIsLoaded(true);
        getU(`city/${id}`)
          .then((resp) => {
            if (resp.status === 'success') {
              setValues(resp.data.city);
            }
          })
          .catch((e) => {
            console.log(e)
          })
          .finally(() => {
            setIsLoaded(false);
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
                <title>Редактировать город</title>
            </Helmet>
            <Box sx={{pt: 2}}>
                <Container maxWidth={false}>
                    <Box>
                        <Button startIcon={<ChevronLeft/>} onClick={() => navigate(-1)}>
                            Назад
                        </Button>
                    </Box>
                    <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 14 }}>
                        <RouterLink underline="hover" color="inherit" to="/app/cities">
                            Список городов
                        </RouterLink>
                            <p>Редактирование города</p>
                    </Breadcrumbs>
                </Container>
            </Box>
            <Box sx={{backgroundColor: 'background.default', minHeight: '100%'}}>
                <Container maxWidth={false}>
                    <Box sx={{pt: 2}}>
                        <form>
                            <Card>
                                <CardHeader
                                    title="Редактирование города"
                                />
                                <Divider/>
                                <CardContent sx={{position: 'relative'}}>
                                    <TextField
                                        fullWidth
                                        label="Название города"
                                        margin="normal"
                                        name="name"
                                        onChange={handleChange}
                                        type="text"
                                        value={values.name}
                                        variant="outlined"
                                        error={errors.name}
                                    />
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
                                        Редактировать
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

export default CityEdit;
