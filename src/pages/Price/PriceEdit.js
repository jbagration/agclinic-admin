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
    TextField,
    Alert,
    OutlinedInput,
    Checkbox,
    ListItemText,
    Breadcrumbs
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import {useParams, useNavigate, Link} from 'react-router-dom';
import {useGet, usePost, usePut} from "../../API/request";
import {BallTriangle} from "react-loader-spinner";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import '../../styles/Avatar/style.css'
import { format } from "date-fns";

const PriceEdit = () => {

    const navigate = useNavigate();
    const getU = useGet();
    const putU = usePut();
    const {id} = useParams()

    const [isLoaded, setIsLoaded] = useState(true);
    const [values, setValues] = useState({
        title: '',
        city_id: '',
        category_id: id,
        duration: '',
        cost: '',
        notes: '',
        discount_cost: '',
        discount_end: ''
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
    const [category, setCategory ] = useState([])
    const [ choosenCities, setChoosenCities ] = useState([])
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [nothingChanged, setNothingChanged] = useState(true)
    const [isShowLoader, setIsShowLoader] = useState(false);
    const [discountEnd, setDiscountEnd] = useState('');

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

    const handleStartDateChange = (event) => {
        setNothingChanged(false)
        setDiscountEnd(event.target.value);
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

        if (values.title === '') {
            validComplete = false;
            formErrors.title = false;
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
                title: values.title,
                city_id: values.city_id,
                duration: values.duration || "",
                cost: values.cost || "",
                notes: values.notes || "",
                discount_cost: values.discount_cost || "",
                discount_end: discountEnd || ""
            };

            // Фильтрация объекта data
            const filteredData = Object.fromEntries(
                Object.entries(data).filter(([key, value]) => value !== "" && value !== null)
            );

            putU(`price/price/${id}`, filteredData)
                .then((resp) => {
                    if (resp.status === 'success') {
                        showAlert('success', 'Раздел обновлён', 2);
                    } else {
                        showAlert('error', 'Ошибка', 2);
                    }
                })
                .catch((err) => {
                    showAlert('error', `Ошибка сервера: ${err.response.data.message}`);
                    setIsShowLoader(false);
                    setSubmitDisabled(false);
                })
        }
    };

    const loadCategory = (category_id) => {
        setIsLoaded(true)
        getU(`price/category/${category_id}`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setCategory(resp.data.category)
                }
            })
            .catch((err) => {
                console.log(err)
            } )
            .finally(() => {
                setIsLoaded(false)
            });
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

        getU(`price/price/${id}`)
        .then((resp) => {
            if (resp.status === 'success') {
                const data = {
                    ...resp.data.price,
                };
                setValues({
                    city_id: data.city.map(el => el.id),
                    title: data.title,
                    category_id: id,
                    duration: data.duration || "",
                    cost: data.cost || "",
                    notes: data.notes || "",
                    discount_cost: data.discount_cost || "",
                })
                loadCategory(resp.data.price.category_id)
                setDiscountEnd(resp.data.price.discount_end ? format(new Date(resp.data.price.discount_end), "yyyy-MM-dd'T'HH:mm") : ""),
                setChoosenCities(data.city.map(el => el.name))
            }
        })
        .catch((e) => {
            showAlert('error', 'Произошла ошибка при загрузке сервиса, попробуйте перезайти', 1);
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
                <title>Редактирование прайса</title>
            </Helmet>
            <Box className="headerWrapper">
                <Box className="headerTitle">
                    <Button startIcon={<ChevronLeft/>} onClick={() => navigate(-1)}>
                        Назад
                    </Button>
                    Прайс
                </Box>
                <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 14 }}>
                    <Link underline="hover" color="inherit" to="/app/price-sections">
                        Разделы
                    </Link>
                    <Link underline="hover" color="inherit" to={`/app/price-sections/category/info/${category.id}`}>
                        {category.value || "Категория"}
                    </Link>
                        <p>Редактирование прайса</p>
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
                                    title="Редактирование прайса"
                                />
                                <Divider/>
                                <CardContent sx={{position: 'relative'}}>
                                    <TextField
                                        fullWidth
                                        label="Название прайса"
                                        margin="normal"
                                        name="title"
                                        onChange={handleChange}
                                        type="text"
                                        value={values.title}
                                        variant="outlined"
                                        error={errors.title}
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
                                    <TextField
                                        fullWidth
                                        label="Продолжительность"
                                        margin="normal"
                                        name="duration"
                                        onChange={handleChange}
                                        type="text"
                                        value={values.duration}
                                        variant="outlined"
                                        error={errors.duration}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Цена"
                                        margin="normal"
                                        name="cost"
                                        onChange={handleChange}
                                        type="text"
                                        value={values.cost}
                                        variant="outlined"
                                        error={errors.cost}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Примечания"
                                        margin="normal"
                                        name="notes"
                                        onChange={handleChange}
                                        type="text"
                                        value={values.notes}
                                        variant="outlined"
                                        error={errors.notes}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Скидка"
                                        margin="normal"
                                        name="discount_cost"
                                        onChange={handleChange}
                                        type="text"
                                        value={values.discount_cost}
                                        variant="outlined"
                                        error={errors.discount_cost}
                                    />
                                    <TextField
                                        fullWidth
                                        sx={{ marginRight: 2, marginTop: 2 }}
                                        label="Окончание скидки"
                                        type="datetime-local"
                                        value={discountEnd}
                                        onChange={handleStartDateChange}
                                        InputLabelProps={{
                                        shrink: true,
                                        }}
                                    />
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

export default PriceEdit;
