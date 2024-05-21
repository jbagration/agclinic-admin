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

const PriceDiscount = () => {

    const navigate = useNavigate();
    const getU = useGet();
    const putU = usePut();
    const {id} = useParams()

    const [isLoaded, setIsLoaded] = useState(true);
    const [values, setValues] = useState({
        city_id: '',
        discount_cost: '',
        discount_end: ''
    });
    const [errors, setErrors] = useState({
        city_id: false,
        discount_cost: false,
        discount_end: false,
    });

    const [cities, setCities ] = useState([])
    const [citiesDiscount, setCitiesDiscount ] = useState([])
    const [category, setCategory ] = useState([])
    const [choosenCities, setChoosenCities] = useState([])
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
            city_id: cities?.find(elem => elem.name === value)?.id,
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
                city_id: values.city_id,
                status: true,
                discount_cost: values.discount_cost || "",
                discount_end: discountEnd || ""
            };

            // Фильтрация объекта data
            const filteredData = Object.fromEntries(
                Object.entries(data).filter(([key, value]) => value !== "" && value !== null)
            );

            putU(`price/discount/${id}`, filteredData)
                .then((resp) => {
                    if (resp.status === 'success') {
                        showAlert('success', 'Скидка обновлёна', 2);
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
                    discount_cost: data.discount_cost || "",
                    id: data.id || "",
                    title: data.title || "",
                })
                loadCategory(resp.data.price.category_id)
                setDiscountEnd(resp.data.price.discount_end ? format(new Date(resp.data.price.discount_end), "yyyy-MM-dd'T'HH:mm") : ""),
                setCitiesDiscount(data.city.map(el => el.name))
                console.log(data)
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
                <title>Обновление скидки</title>
            </Helmet>
            <Box className="headerWrapper">
                <Box className="headerTitle">
                    <Button startIcon={<ChevronLeft/>} onClick={() => navigate(-1)}>
                        Назад
                    </Button>
                    Обновление скидки
                </Box>
                <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 14 }}>
                    <Link underline="hover" color="inherit" to="/app/price-sections">
                        Разделы
                    </Link>
                    <Link underline="hover" color="inherit" to={`/app/price-sections/category/info/${category.id}`}>
                        {category.value || "Категория"}
                    </Link>
                    <Link underline="hover" color="inherit" to={`/app/price/info/${values.id}`}>
                        {values.title || "Название праса"}
                    </Link>
                        <p>Обновление скидки</p>
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
                                    title="Редактирование скидки"
                                />
                                <Divider/>
                                <CardContent sx={{position: 'relative'}}>
                                    <FormControl fullWidth sx={{mt: 2, mb: 1}}>
                                        <InputLabel id="city">Выберите город</InputLabel>
                                        <Select
                                            name="city_id"
                                            value={choosenCities}
                                            label="Выберите город"
                                            onChange={handleChangeCity}
                                        >
                                            {citiesDiscount?.map((item) => (
                                            <MenuItem key={item.length} value={item}>
                                                {item}
                                            </MenuItem>
                                            ))}
                                        </Select>
                                        </FormControl>
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
                                        type="date"
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

export default PriceDiscount;
