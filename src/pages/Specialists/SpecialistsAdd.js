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
    Breadcrumbs,
    Typography
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import {useParams, useNavigate, Link} from 'react-router-dom';
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
import ReactQuill from 'react-quill';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/ru';
import '../../styles/All.css'

const SpecialistAdd = () => {

    const navigate = useNavigate();
    const postU = usePost();
    const getU = useGet();
    const putU = usePut();

    const [isLoaded, setIsLoaded] = useState(true);
    const [values, setValues] = useState({
        fio: "",
        city_id: [],
        // specialization: "",
        preview_description: "",
        main_description: "",
        experience: "",
        biography: ""
    });

    const [errors, setErrors] = useState({
        fio: false,
        data: false,
        // specialization: false,
        preview_description: false,
        main_description: false,
        experience: false,
    });

    const [cities, setCities ] = useState([])
    const [ choosenCities, setChoosenCities ] = useState([])
    const [isShowLoader, setIsShowLoader] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [data, setData] = useState('');
    const [uploadUrl] = useState(`${process.env.REACT_APP_API_URL}api/CKEditor/CKEditorUpload`);
    const [uploadedPreview, setUploadedPreview] = useState('/static/images/defphoto.jpg');
    const [uploadedMainImg, setUploadedMainImg] = useState('/static/images/defphoto.jpg')

    const [alert, setAlert] = useState({
        txt: '',
        isVisible: false,
        type: 'error'
    });

    const modules = {
        toolbar: [
          [{ 'header': [ 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'align': [] }],
          [{ 'indent': '-1' }, { 'indent': '+1' }],
          ['link'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'script': 'sub'}, { 'script': 'super' }],
          ['blockquote'],['code-block']
        ]
      };

    const editorConfig = {
        toolbar: [
          'heading',
          '|',
          'bold',
          'italic',
          'underline',
          'strikethrough',
          '|',
          'alignment',
          '|',
          'numberedList',
          'bulletedList',
          '|',
          'indent',
          'outdent',
          '|',
          'link',
          'unlink',
          '|',
          'insertImage',
          'insertVideo',
          '|',
          'blockQuote',
          'insertTable',
          '|',
          'undo',
          'redo'
        ],
        alignment: {
          options: ['left', 'center', 'right', 'justify']
        },
        table: {
          contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
        },
        language: 'ru'
      };

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

    const handleChangeExperience = (event) => {
        setValues({
            ...values,
            experience: event.target.value
        });
        setErrors({
            ...errors,
            experience: false
        });
    };

    const avaUploaded = (event) => {
        setUploadedPreview(URL.createObjectURL(event.target.files[0]));
        setValues({
            ...values,
            preview_img: event.target.files[0]
        });
    };

    const mainImgUploaded = (event) => {
        setUploadedMainImg(URL.createObjectURL(event.target.files[0]));
        setValues({
            ...values,
            main_img: event.target.files[0]
        });
    };

    const countCharacters = (html) => {
        const text = html.replace(/<[^>]+>/g, ''); // Удаление HTML тегов из текста
        return text.length;
      };

    const handleChangeBiography = (value) => {
        if (countCharacters(value) <= 850) {
          setValues({
            ...values,
            biography: value
          });
        }
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

        if (values.fio === '') {
            validComplete = false;
            formErrors.fio = false;
            showAlert('error', "Поле 'ФИО' не должно быть пустым")
        }

        if ( values.city_id.length === 0) {
            validComplete = false;
            formErrors.city_id = false;
            showAlert('error', "Поле 'Массив связных городов' не должно быть пустым")
        }

        if (values.preview_description === '') {
            validComplete = false;
            formErrors.preview_description = false;
            showAlert('error', "Поле 'Описание превью' не должно быть пустым")
        }

        if (data === '') {
            validComplete = false;
            formErrors.data = false;
            showAlert('error', "Поле 'О специалисте' не должно быть пустым")
        }

        if ((typeof(+values.experience) != 'number') | (+values.experience < 0) | (+values.experience > 100)) {
            validComplete = false;
            formErrors.experience = false;
            showAlert('error', "Поле 'Опыт' должно быть целым числом от 1 до 100")
        }

        if(values.biography === '') {
            validComplete = false;
            formErrors.biography = false;
            showAlert('error', "Поле 'Биография' не должно быть пустым")
        }

        setErrors(formErrors);
        return validComplete;
    };

    const clearForm = () => {
        setValues({
            fio: "",
            city_id: [],
            // specialization: "",
            preview_description: "",
            experience: "",
            main_description: "",
            biography: "",
        });
        setUploadedPreview('/static/images/defphoto.jpg');
        setUploadedMainImg('/static/images/defphoto.jpg');
    };

    const submitMainImg = async (id) => {
        setSubmitDisabled(true);

        let data = new FormData();
        data.append('img', values.main_img);

        putU(`specialist/main/${id}`, data)
            .then((resp) => {
            })
            .catch((err) => {
                showAlert('error', 'Ошибка');
            })
            .finally(() => {
                setSubmitDisabled(false);
                clearForm()
            })
        ;
    };

    const submitAvatar = async (id) => {
        setSubmitDisabled(true);

        let data = new FormData();
        data.append('img', values.preview_img);

        putU(`specialist/preview/${id}`, data)
            .then((resp) => {
            })
            .catch((err) => {
                showAlert('error', 'Ошибка');
            })
            .finally(() => {
                setSubmitDisabled(false);
                clearForm()
            })
        ;
    };

    const submit = async () => {
        if (validate()) {
            setIsShowLoader(true);
            setSubmitDisabled(true);

            const dataSet = {
                fio: values.fio,
                city_id: values.city_id,
                // specialization: values.specialization,
                preview_description: values.preview_description,
                main_description: data,
                experience: +values.experience,
                biography: values.biography
            };

            postU('specialist', dataSet)
                .then((resp) => {
                    if (resp.status === 'success') {
                        showAlert('success', 'Специалист добавлен');
                        submitAvatar(resp.data.specialist);
                        submitMainImg(resp.data.specialist);
                    } else {
                        showAlert('error', 'Ошибка');
                    }
                })
                .catch((err) => {
                    showAlert('error', 'Ошибка сервера');
                    setIsShowLoader(false);
                    setSubmitDisabled(false);
                })
                .finally(() => {
                    clearForm();
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
                <title>Добавить специалиста</title>
            </Helmet>
            <Box sx={{pt: 2}}>
                <Container maxWidth={false}>
                    <Button startIcon={<ChevronLeft/>} onClick={() => navigate(-1)}>
                        Назад
                    </Button>
                    <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 14 }}>
                        <Link underline="hover" color="inherit" to="/app/specialists">
                            Специалисты
                        </Link>
                            <p>Добавить специалиста</p>
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
                                    title="Редактирование аватарки"
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
                                    title="Редактирование основного изображения"
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
            <Box sx={{backgroundColor: 'background.default', minHeight: '100%'}}>
                <Container maxWidth={false}>
                    <Box sx={{pt: 2}}>
                        <form>
                            <Card>
                                <CardHeader
                                    title="Добавление нового специалиста"
                                />
                                <Divider/>
                                <CardContent sx={{position: 'relative'}}>
                                    <TextField
                                        fullWidth
                                        label="ФИО"
                                        margin="normal"
                                        name="fio"
                                        onChange={handleChange}
                                        type="text"
                                        value={values.fio}
                                        variant="outlined"
                                        error={Boolean(errors.fio)}
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
                                        label="Описание превью"
                                        margin="normal"
                                        name="preview_description"
                                        onChange={handleChange}
                                        type="textarea"
                                        multiline
                                        value={values.preview_description}
                                        variant="outlined"
                                        error={Boolean(errors.preview_description)}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Опыт"
                                        margin="normal"
                                        name="experience"
                                        onChange={handleChangeExperience}
                                        type="number"
                                        value={values.experience}
                                        variant="outlined"
                                        error={Boolean(errors.experience)}
                                    />
                                    <CardHeader title="О специалисте"/>
                                    <div style={{ minHeight: '200px' }}>
                                        <CKEditor
                                            config={{
                                                ckfinder: {
                                                    uploadUrl: uploadUrl
                                                }
                                            }}
                                            editor={ClassicEditor}
                                            onReady={(editor) => {
                                            editor.editing.view.change(writer => {
                                                writer.setStyle('min-height', '200px', editor.editing.view.document.getRoot());
                                            });
                                            }}
                                            onChange={(event, editor) => {
                                            setData(String(editor.getData()));
                                            }}
                                            data={data}
                                        />
                                    </div>
                                <CardHeader title="Биография"/>
                                    <ReactQuill
                                        name="biography"
                                        style={{ margin: '0 0 40px 0', height: '150px' }}
                                        value={values.biography}
                                        onChange={(value) => handleChangeBiography(value)}
                                        modules={modules}
                                        disabled={countCharacters(values.biography) >= 850}
                                    />
                                    <Typography>
                                        Символов осталось: { 850 - countCharacters(values.biography)}
                                    </Typography>
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

export default SpecialistAdd;
