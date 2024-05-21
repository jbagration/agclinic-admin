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
    CircularProgress,
    TextField,
    Alert,
    Grid,
    OutlinedInput,
    Checkbox,
    ListItemText,
    Breadcrumbs
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import {useParams, useNavigate, Link} from 'react-router-dom';
import UserFormEdit from '../../components/Users/UserFormEdit';
import {useGet, usePost, usePut} from "../../API/request";
import {BallTriangle} from "react-loader-spinner";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import '../../styles/Avatar/style.css'

export const servicesColumns = [
    { field: 'id', headerName: 'id', width: 70 },
    { field: 'value', headerName: 'Наименование услуги', width: 130 },
    { field: 'parent_category', headerName: 'Категория', width: 130 },
]

const PriceCategoryEdit = () => {

    const navigate = useNavigate();
    const postU = usePost();
    const getU = useGet();
    const putU = usePut();
    const {id} = useParams()

    const [isLoaded, setIsLoaded] = useState(true);
    const [uploadedPreview, setUploadedPreview] = useState('/static/images/defphoto.jpg');
    const [values, setValues] = useState({
        value: "",
        city_id: [],
        parent_category: id,
        level: +!!id, //id > 0 : 1, id === 0 : 0
        description: "",
    });
    const [errors, setErrors] = useState({
        value: false,
        city_id: false,
        parent_category: false,
        level: false,
        description: false,
        img: false,
    });

    const [cities, setCities ] = useState([])
    const [categories, setCategories ] = useState([])
    const [ choosenCities, setChoosenCities ] = useState([])
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [nothingChanged, setNothingChanged] = useState(true)
    const [isShowLoader, setIsShowLoader] = useState(false);

    const [alert, setAlert] = useState({
        txt: '',
        value: 0,
        type: 'error'
    });

    const handleChange = (event) => {
        setNothingChanged(false)
        setValues({
            ...values,
            [event.target.name]: event.target.value
        });
        setErrors({
            ...errors,
            [event.target.name]: false
        });
    };

    const handleChangeCity = (event) => {
        const value = event.target.value
        setNothingChanged(false)
        setChoosenCities(value);
        setValues({
            ...values,
            city_id: value?.map((el) => cities?.find(elem => elem.name === el)?.id),
        })
        setErrors({
            ...errors,
            city_id: false
        });
    }

    const showAlert = (type, text, value) => {
        setAlert({
            txt: text,
            type,
            value,
        });

        setTimeout(() => {
            setAlert({
                txt: text,
                type,
                value: 0,
            });

            setSubmitDisabled(false);
        }, 1400);
    };

    const validate = () => {
        let validComplete = true;
        let formErrors = {...errors};

        if (values.value === '') {
            validComplete = false;
            formErrors.value = false;
            showAlert('error', "Имя раздела не должно быть пустым", 2)
        }

        if ( values.city_id.length === 0) {
            validComplete = false;
            formErrors.city_id = false;
            showAlert('error', "Поле Массив связных городов не должно быть пустым", 2)
        }

        setErrors(formErrors);
        return validComplete;
    };

    const submit = async () => {
        if (nothingChanged){
            showAlert('error', 'Нет изменений', 3)
            return
        }
        if (validate()) {
            setIsShowLoader(true);
            setSubmitDisabled(true);

            const data = {
                value: values.value,
                city_id: values.city_id,
            };

            putU(`price/category/${id}`, data)
                .then((resp) => {
                    if (resp.status === 'success') {
                        showAlert('success', 'Категория обновлёна', 2);
                    } else {
                        showAlert('error', 'Ошибка', 2);
                    }
                })
                .catch((err) => {
                    showAlert('error', 'Ошибка сервера', 2);
                    setIsShowLoader(false);
                    setSubmitDisabled(false);
                })
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
            .catch(() => {
                showAlert('error', 'Произошла ошибка при загрузке городов, попробуйте перезайти', 1);
            })
            .finally(() => {
                setIsLoaded(false)
            });

        getU(`price/category/${id}`)
        .then((resp) => {
            if (resp.status === 'success') {
                const data = {
                    ...resp.data.category,
                };
                setValues({
                    value: data.value,
                    city_id: data.city.map(el => el.id),
                })
                setChoosenCities(data.city.map(el => el.name))
            }
        })
        .catch((e) => {
            showAlert('error', 'Произошла ошибка при загрузке категории, попробуйте перезайти', 1);
            console.log(e)
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
                <title>Редактирование категории</title>
            </Helmet>
            <Box className="headerWrapper">
                <Box className="headerTitle">
                    <Button startIcon={<ChevronLeft/>} onClick={() => navigate(-1)}>
                        Назад
                    </Button>
                </Box>
                <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 14 }}>
                    <Link underline="hover" color="inherit" to="/app/price-sections">
                        Разделы
                    </Link>
                        <p>Редактирование категории</p>
                </Breadcrumbs>
            </Box>
            <Box sx={{backgroundColor: 'background.default', pt: 3}}>

                <Container maxWidth={false}>
                    <Box sx={{mb: 1}}>
                        <Alert severity={alert.type} style={{display: alert.value === 1 ? 'flex' : 'none'}}>
                            {alert.txt}
                        </Alert>
                    </Box>
                    <Box sx={{
                        paddingBottom: 1
                    }}>
                    </Box>
                </Container>
            </Box>
            <Box sx={{backgroundColor: 'background.default', minHeight: '100%'}}>
                <Container maxWidth={false}>
                    <Box sx={{pt: 2}}>
                        <form>
                            <Card>
                                <CardHeader
                                    title="Редактирование категории"
                                />
                                <Divider/>
                                <CardContent sx={{position: 'relative'}}>
                                    <TextField
                                        fullWidth
                                        label="Название раздела"
                                        margin="normal"
                                        name="value"
                                        onChange={handleChange}
                                        type="text"
                                        value={values.value}
                                        variant="outlined"
                                        error={errors.value}
                                    />
                                    <FormControl fullWidth sx={{mt: 2, mb: 1}}>
                                        <InputLabel id="Города">
                                            Города
                                        </InputLabel>
                                        <Select
                                            label="Города"
                                            name="city_id"
                                            multiple
                                            value={choosenCities}
                                            onChange={handleChangeCity}
                                            input={<OutlinedInput label="Города" />}
                                            renderValue={(selected) => selected.join(', ')}
                                        >
                                            {cities?.map((city) => (
                                                <MenuItem key={city.name} value={city.name}>
                                                    <Checkbox checked={choosenCities?.indexOf(city.name) > -1} />
                                                    <ListItemText primary={city.name} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <Alert severity={alert.type}
                                           style={{display: alert.value === 2 ? 'flex' : 'none'}}>
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

export default PriceCategoryEdit;
