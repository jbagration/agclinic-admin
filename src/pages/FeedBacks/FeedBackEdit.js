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

const FeedBackEdit = () => {

    const {id} = useParams();
    const navigate = useNavigate();
    const getU = useGet();
    const putU = usePut();

    const [isLoaded, setIsLoaded] = useState(true);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [nothingChanged, setNothingChanged] = useState(true);

    const [values, setValues] = useState({
        isChecked: '',
    });
    const [errors, setErrors] = useState({
        isChecked: ''
    });


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


    const submit = async () => {
        if (nothingChanged) {
            showAlert('error', 'Нет изменений');
            return;
        }

        setSubmitDisabled(true);

        const data = {
            isChecked: values.isChecked
        };

        putU(`feedback/${id}`, data)
            .then((resp) => {
                if (resp.status === 'success') {
                    showAlert('success', 'Статус заявки успешно обновлен');
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

    };

    useEffect(() => {
        setIsLoaded(true)
        getU(`feedback/${id}`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setValues({
                        isChecked: resp.data.feedback.isChecked
                    })
                }
            })
            .catch(() => {
                showAlert('error', 'Произошла ошибка при загрузке элемента');
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
                <title>FeedBack edit</title>
            </Helmet>
            <Box className="headerWrapper">
                <Box className="headerTitle">
                    <Button startIcon={<ChevronLeft/>} onClick={() => navigate(-1)}>
                        Назад
                    </Button>
                    Обратная связь
                </Box>
                <ul className="headerList">
                    <li onClick={() => navigate(-1)}>Обратная связь</li>
                    <li>/</li>
                    <li>Редактирование</li>
                </ul>

            </Box>

            <Box sx={{backgroundColor: 'background.default', pt: 3}}>

                <Container maxWidth={false}>
                    <Box sx={{
                        paddingBottom: 1
                    }}>
                        <form>
                            <Card>
                                <CardHeader
                                    title="Редактирование статуса"
                                />
                                <Divider/>
                                <CardContent sx={{position: 'relative'}}>
                                    <FormControl fullWidth sx={{mt: 2, mb: 1}}>
                                        <InputLabel id="isChecked">
                                            Статус заявки
                                        </InputLabel>
                                        <Select
                                            labelId="isChecked"
                                            name="isChecked"
                                            value={values.isChecked}
                                            label="Статус заявки"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value={true}>Заявка проверенна</MenuItem>
                                            <MenuItem value={false}>Заявка не проверенна</MenuItem>
                                        </Select>
                                    </FormControl>
                                </CardContent>
                                <Divider/>
                                <Alert severity={alert.type} style={{display: alert.isVisible ? 'flex' : 'none'}}>
                                    {alert.txt}
                                </Alert>
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

export default FeedBackEdit;
