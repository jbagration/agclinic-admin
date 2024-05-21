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

export const servicesColumns = [
    { field: 'id', headerName: 'id', width: 70 },
    { field: 'value', headerName: 'Наименование услуги', width: 130 },
    { field: 'parent_category', headerName: 'Категория', width: 130 },
]

const ServiceAdd = () => {

    const navigate = useNavigate();
    const getU = useGet();
    const postU = usePost();
    const putU = usePut();

    const [isLoaded, setIsLoaded] = useState(true);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [nothingChanged, setNothingChanged] = useState(true);

    const [uploadedPreview, setUploadedPreview] = useState('/static/images/defphoto.jpg');
    const [uploadedMainImg, setUploadedMainImg] = useState('/static/images/defphoto.jpg')
    const [values, setValues] = useState({
        title: "",
        city_id: [],
        category_id: [],
        preview_description: "",
        text: "",
        troubles: "",
    });
    const [errors, setErrors] = useState({
        title: false,
        city_id: false,
        category_id: false,
        preview_description: false,
        text: false,
        troubles: false,
    });

    const [cities, setCities ] = useState([])
    const [categories, setCategories ] = useState([])
    const [ choosenCities, setChoosenCities ] = useState([])
    const [ choosenCategory, setChoosenCategory ] = useState({})

    const [alert, setAlert] = useState({
        txt: '',
        type: 'error',
        number: 0,
    });

    const modules = {
        toolbar: [
          [{ 'header': [ 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'align': [] }],
          [{ 'indent': '-1' }, { 'indent': '+1' }],
          ['link', 'image', 'video'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'script': 'sub'}, { 'script': 'super' }],
          ['blockquote'],['code-block']
        ]
      };

    const handleChange = (event, name) => {
        setNothingChanged(false);

        if (name === 'text') {
          setValues({
            ...values,
            [name]: event   // Для ReactQuill значение передается напрямую
          });
        } else {
          setValues({
            ...values,
            [name]: event.target.value  // Для остальных полей
          });
        }

        setErrors({
          ...errors,
          [name]: false
        });
      };

    const handleChangeCategory = (event) => {
        setChoosenCategory(event.target.value)
        setValues({
            ...values,
            category_id: categories.find(el => el.value === event.target.value).id
        });
        setErrors({
            ...errors,
            category_id: false
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

    const avaUploaded = (event) => {
        setNothingChanged(false)
        setUploadedPreview(URL.createObjectURL(event.target.files[0]));
        setValues({
            ...values,
            preview_img: event.target.files[0]
        });
    };

    const mainImgUploaded = (event) => {
        setNothingChanged(false)
        setUploadedMainImg(URL.createObjectURL(event.target.files[0]));
        setValues({
            ...values,
            main_img: event.target.files[0]
        });
    };

    const showAlert = (number, type, text) => {
        setAlert({
            txt: text,
            type,
            number,
        });

        setTimeout(() => {
            setAlert({
                txt: text,
                type,
                number: 0,
            });

            setSubmitDisabled(false);
        }, 2500);
    };

    const clearForm = () => {
        setValues({
            title: "",
            city_id: [],
            category_id: [],
            preview_description: "",
            text: "",
            troubles: "",
            });
    };

    const validate = () => {
        let validComplete = true;
        let formErrors = {...errors};

        if (values.title === '') {
            validComplete = false;
            formErrors.title = false;
            showAlert(3, 'error', "Поле title не должно быть пустым")
        }
        if ( values.city_id.length === 0) {
            validComplete = false;
            formErrors.city_id = false;
            showAlert(3, 'error', "Поле Массив связных городов не должно быть пустым")
        }

        if (!values.category_id) {
            validComplete = false;
            formErrors.specialization = false;
            showAlert(3, 'error', "Поле Категория не должно быть пустым")
        }

        if (values.preview_description === '') {
            validComplete = false;
            formErrors.preview_description = false;
            showAlert(3, 'error', "Поле Описание превью не должно быть пустым")
        }

        if (values.text === '') {
            validComplete = false;
            formErrors.main_description = false;
            showAlert(3, 'error', "Поле Текст не должно быть пустым")
        }

        setErrors(formErrors);
        return validComplete;
    };

    const submitAvatar = async (id) => {
        if (nothingChanged) {
            showAlert(1, 'error', 'Нет изменений');
            return;
        }
        setSubmitDisabled(true);

        let data = new FormData();
        data.append('img', values.preview_img);

        putU(`services/preview/${id}`, data)
            .then((resp) => {
                if (resp.status === 'success') {
                    showAlert(3, 'success', 'Данные успешно добавлены');
                    clearForm();
                } else {
                    showAlert(3, 'error', 'Ошибка');
                }
            })
            .catch((err) => {
                showAlert(3, 'error', 'Ошибка сервера');
            })
            .finally(() => {
                setSubmitDisabled(false);
            })
        ;
    };

    const submitMainImg = async (id) => {
        if (nothingChanged) {
            showAlert(2, 'error', 'Нет изменений');
            return;
        }
        setSubmitDisabled(true);

        let data = new FormData();
        data.append('img', values.main_img);

        putU(`services/main/${id}`, data)
            .then((resp) => {
                if (resp.status === 'success') {
                    showAlert(2, 'success', 'Данные успешно обновленны');
                } else {
                    showAlert(2, 'error', 'Ошибка');
                }
            })
            .catch((err) => {
                showAlert(2, 'error', 'Ошибка сервера');
            })
            .finally(() => {
                setSubmitDisabled(false);
            })
        ;
    };

    const submit = async () => {
        if (nothingChanged) {
          showAlert(1, 'error', 'Нет изменений');
          return;
        }
        if (validate()) {
          setSubmitDisabled(true);

          const data = {
            title: values.title,
            city_id: values.city_id,
            preview_description: values.preview_description,
            category_id: values.category_id,
            text: values.text,
          };

          if (values.troubles !== "") {
            data.troubles = values.troubles;
          }

          postU(`services`, data)
            .then((resp) => {
              if (resp.status === 'success') {
                submitMainImg(resp.data.service[0])
                submitAvatar(resp.data.service[0])
                showAlert(3, 'success', 'Данные успешно добавлены');
              } else {
                showAlert(1, 'error', 'Ошибка');
              }
            })
            .catch((err) => {
              const errorMessage = err.response?.data?.message || 'Произошла ошибка';
              showAlert(3, 'error', errorMessage);
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
            })
            .finally(() => {
                setIsLoaded(false)
            });
        getU(`services_category?limit=99999`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setCategories(resp.data.category)
                }
            })
            .catch(() => {
                showAlert(1, 'error', 'Произошла ошибка при загрузке ролей, попробуйте перезайти');
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
                <title>Добавление услуги</title>
            </Helmet>
            <Box sx={{pt: 2}}>
                <Container maxWidth={false}>
                    <Button startIcon={<ChevronLeft/>} onClick={() => navigate(-1)}>
                        Назад
                    </Button>
                    <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 14 }}>
                        <Link underline="hover" color="inherit" to="/app/services">
                            Услуги
                        </Link>
                            <p>Добавление услуги</p>
                    </Breadcrumbs>
                </Container>
            </Box>

            {/*preview*/}
            <Box sx={{backgroundColor: 'background.default', pt: 3}}>

                <Container maxWidth={false}>
                    <Box sx={{mb: 1}}>
                        <Alert severity={alert.type} style={{display: alert.number === 1 ? 'flex' : 'none'}}>
                            {alert.txt}
                        </Alert>
                    </Box>
                    <Box sx={{
                        paddingBottom: 1
                    }}>
                        <form>
                            <Card>
                                <CardHeader
                                    title="Добавление превью"
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
                                </CardContent>
                                <Divider/>
                            </Card>
                        </form>
                    </Box>
                </Container>
            </Box>
            {/*main_img*/}
            <Box sx={{backgroundColor: 'background.default', pt: 3}}>
                <Container maxWidth={false}>
                    <Box sx={{mb: 1}}>
                        <Alert severity={alert.type} style={{display: alert.number === 2 ? 'flex' : 'none'}}>
                            {alert.txt}
                        </Alert>
                    </Box>
                    <Box sx={{
                        paddingBottom: 1
                    }}>
                        <form>
                            <Card>
                                <CardHeader
                                    title="Добавление основного изображения"
                                />
                                <Divider/>
                                <CardContent sx={{position: 'relative'}}>
                                    <div className="itemWrapper">
                                        <div className="container">
                                            <input accept="xlsx/*" type="file" style={{display: 'none'}}
                                                   id={2}
                                                   onChange={(event) => mainImgUploaded(event, 1)}/>
                                            <label htmlFor={2}>
                                                <img src={uploadedMainImg} className="itemMainImg"/>
                                                <div className="middle"/>
                                            </label>
                                        </div>
                                        <div className="help-text">
                                            Доступны следующие расширения: .png .jpg .svg .bmp .tga .webp
                                        </div>
                                    </div>
                                </CardContent>
                                <Divider/>
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
                                    title="Добавление услуги"
                                />
                                <Divider/>
                                <CardContent sx={{position: 'relative'}}>
                                    <TextField
                                        fullWidth
                                        label="Заголовок"
                                        margin="normal"
                                        name="title"
                                        onChange={(event) => handleChange(event, 'title')}
                                        type="text"
                                        value={values.title}
                                        variant="outlined"
                                        error={errors.title}
                                    />
                                    <FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
                                        <InputLabel id="Города">Города</InputLabel>
                                        <Select
                                            label="Города"
                                            name="city_id"
                                            multiple
                                            value={choosenCities}
                                            onChange={handleChangeCity}
                                            input={<OutlinedInput label="Города" />}
                                            renderValue={(selected) => selected.join(", ")}
                                        >
                                            {cities?.map((city) => (
                                            <MenuItem key={city.name} value={city.name}>
                                                <Checkbox checked={choosenCities?.indexOf(city.name) > -1} />
                                                <ListItemText primary={city.name} />
                                            </MenuItem>
                                            ))}
                                        </Select>
                                        </FormControl>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Категория</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={categories?.find((el) => el.id === choosenCategory)?.value}
                                                label="Категория"
                                                onChange={handleChangeCategory}
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                        maxHeight: 300,
                                                        overflowY: 'auto',
                                                        },
                                                    },
                                                }}
                                            >
                                                {categories.map((el) => (
                                                <MenuItem key={el.id} value={el.value}>
                                                    {el.value}
                                                </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    <TextField
                                        fullWidth
                                        label="Описание превью"
                                        margin="normal"
                                        name="preview_description"
                                        onChange={(event) => handleChange(event, 'preview_description')}
                                        type="textarea"
                                        multiline
                                        value={values.preview_description}
                                        variant="outlined"
                                        error={errors.preview_description}
                                    />
                                    <CardHeader
                                        title="Полное описание"
                                    />
                                    <ReactQuill
                                        name="text"
                                        style={{ marginBottom: '20px', height: '150px' }}
                                        value={values.text}
                                        onChange={(value) => handleChange(value, 'text')}
                                        modules={modules}
                                    />
                                    <TextField
                                        sx={{ marginTop: '40px'}}
                                        fullWidth
                                        label="Проблемы(через запятую)"
                                        margin="normal"
                                        name="troubles"
                                        onChange={(event) => handleChange(event, 'troubles')}
                                        type="text"
                                        value={values.troubles}
                                        variant="outlined"
                                        error={errors.troubles}
                                    />
                                    <Alert severity={alert.type}
                                           style={{display: alert.number === 3 ? 'flex' : 'none'}}>
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

export default ServiceAdd;