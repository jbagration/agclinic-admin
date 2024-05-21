import {Helmet} from 'react-helmet';
import {
    Box,
    Container,
    Button,
    TextField,
    CardContent,
    OutlinedInput,
    Checkbox,
    ListItemText,
    Breadcrumbs
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import {useNavigate, useParams, Link} from 'react-router-dom';
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

const CategoryAdd = () => {

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
        level: +!!+id, //id > 0 : 1, id === 0 : 0
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
    const [ choosenCities, setChoosenCities ] = useState([])
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

    const handleChangeCity = (event) => {
        const value = event.target.value
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

    const showAlert = (type, text) => {
        setAlert({
            txt: text,
            type,
            isVisible: true,
        });

        setTimeout(() => {
            setAlert({
                txt: text,
                type,
                isVisible: false,
            });

            setSubmitDisabled(false);
        }, 1400);
    };

    const avaUploaded = (event) => {
        setUploadedPreview(URL.createObjectURL(event.target.files[0]));
        setValues({
            ...values,
            img: event.target.files[0]
        });
    };


    const validate = () => {
        let validComplete = true;
        let formErrors = {...errors};

        if (values.value === '') {
            validComplete = false;
            formErrors.value = false;
            showAlert('error', "Поле title не должно быть пустым", 2)
        }

        if ( values.city_id.length === 0) {
            validComplete = false;
            formErrors.city_id = false;
            showAlert('error', "Поле Массив связных городов не должно быть пустым", 2)
        }

        // if (values.description === '') {
        //     validComplete = false;
        //     formErrors.description = false;
        //     showAlert('error', "Поле Описание превью не должно быть пустым", 2)
        // }

        setErrors(formErrors);
        return validComplete;
    };

    const submitAvatar = async (id) => {
        setSubmitDisabled(true);

        if (!values.img) return

        let data = new FormData();
        data.append('img', values.img);

        putU(`services_category/preview/${id}`, data)
            .then((resp) => {
                if (resp.status === 'success') {
                    showAlert('success', 'Данные успешно обновленны', 1);
                } else {
                    showAlert('error', 'Ошибка', 1);
                }
            })
            .catch((err) => {
                showAlert('error', 'Ошибка сервера', 1);
            })
            .finally(() => {
                setSubmitDisabled(false);
            })
        ;
    };

    const clearForm = () => {
        setValues({
            value: "",
            city_id: [],
            parent_category: id,
            level: +!!id,
            description: "",
        });
        setChoosenCities([])
    };

    const submit = async () => {
        if (validate()) {
            setIsShowLoader(true);
            setSubmitDisabled(true);

            postU('services_category', {...values, img: undefined})
                .then((resp) => {
                    if (resp.status === 'success') {
                        submitAvatar(resp.data.category.id)
                        showAlert('success', 'Категория добавлена', 2);
                        clearForm();
                    } else {
                        showAlert('error', 'Ошибка', 2);
                    }
                })
                .catch((err) => {
                    showAlert('error', `Ошибка сервера: ${err.response.data.message}`, 2);
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
                <title>Добавление новой категории</title>
            </Helmet>
            <Box sx={{pt: 2}}>
                <Container maxWidth={false}>
                    <Button startIcon={<ChevronLeft/>} onClick={() => navigate(-1)}>
                        Назад
                    </Button>
                    <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 14 }}>
                        <Link underline="hover" color="inherit" to="/app/categories">
                            Категории
                        </Link>
                            <p>Добавление категории</p>
                    </Breadcrumbs>
                </Container>
            </Box>
            <Box sx={{backgroundColor: 'background.default', minHeight: '100%'}}>
                <Container maxWidth={false}>
                    <Box sx={{pt: 2}}>
                        <form>
                            <Card>
                                <CardHeader
                                    title="Добавление новой категории услуг"
                                />
                                <Divider/>
                                <CardContent sx={{position: 'relative'}}>
                                    <div className="itemWrapper">
                                        <div className="container">
                                            <input accept="xlsx/*" type="file" style={{display: 'none'}}
                                                   id={1}
                                                   onChange={(event) => avaUploaded(event, 1)}/>
                                            <label htmlFor={1}>
                                                <img src={uploadedPreview} className="itemImg"/>
                                                <div className="middle"/>
                                            </label>
                                        </div>
                                        <div className="help-text">
                                            Доступны следующие расширения: .png .jpg .svg .bmp .tga .webp
                                        </div>
                                    </div>
                                    <TextField
                                        fullWidth
                                        label="Название"
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
                                    <TextField
                                        fullWidth
                                        label="Описание"
                                        margin="normal"
                                        name="description"
                                        onChange={handleChange}
                                        type="textarea"
                                        multiline
                                        value={values.description}
                                        variant="outlined"
                                        error={errors.description}
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

export default CategoryAdd;
