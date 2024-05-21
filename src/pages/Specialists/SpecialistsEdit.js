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
    TableBody,
    Typography
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import {useParams, useNavigate, Link} from 'react-router-dom';
import UserFormEdit from '../../components/Users/UserFormEdit';
import {useGet, usePut} from "../../API/request";
import {BallTriangle} from "react-loader-spinner";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import '../../styles/Avatar/style.css'
import { DataGrid } from '@mui/x-data-grid';
import { BeforeAfterRow } from './BeforeAfter';
import { Paper } from '@mui/material';
import ReactQuill from 'react-quill';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/ru';
import { ContactSupportOutlined } from '@material-ui/icons';

export const servicesColumns = [
    { field: 'id', headerName: 'id', width: 70 },
    { field: 'title', headerName: 'Наименование услуги', width: 730 },
]

const SpecialistEdit = () => {

    const {id} = useParams();
    const navigate = useNavigate();
    const getU = useGet();
    const putU = usePut();

    const [isLoaded, setIsLoaded] = useState(true);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [nothingChanged, setNothingChanged] = useState(true);
    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    const [dataCkEditor, setDataCkEditor] = useState('');
    const [countValue, setCountValue] = useState(0);
    const [uploadUrl] = useState(`${process.env.REACT_APP_API_URL}api/CKEditor/CKEditorUpload`);
    const [uploadedPreview, setUploadedPreview] = useState('/static/images/defphoto.jpg');
    const [uploadedMainImg, setUploadedMainImg] = useState('/static/images/defphoto.jpg')
    const [values, setValues] = useState({
        fio: "",
        city: [],
        // specialization: "",
        preview_description: "",
        main_description: "",
        experience: "",
        biography: ""
    });
    const [errors, setErrors] = useState({
        fio: false,
        city: false,
        // specialization: false,
        preview_description: false,
        main_description: false,
        experience: false,
        biography: false
    });

    const [cities, setCities ] = useState([])
    const [ choosenCities, setChoosenCities ] = useState([])
    const [services, setServices] = useState([])
    const [beforeAfter, setBeforeAfter] = useState([])
    const [servicesTotalCount, setServicesTotalCount] = useState([])
    const [page, setPage] = useState(0); // Состояние текущей страницы
    const [pageSize, setPageSize] = useState(10); // Состояние размера страницы

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
          ['link'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'script': 'sub'}, { 'script': 'super' }],
          ['blockquote'],['code-block']
        ]
      };
    // Пагинация для услуг
    const data = {
        columns: servicesColumns,
        rows: services,
        initialState: {
          pagination: {
            paginationModel: {
              pageSize: pageSize,
            },
          },
        },
        pageSizeOptions: [5, 10, 25],
      };

    const handlePageChange = (newPage) => {
        // Обработчик изменения страницы услуг
        setPage(newPage);
      };

    const handlePageSizeChange = (newPageSize) => {
        // Обработчик изменения размера страницы услуг
        setPageSize(newPageSize);
      };

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

    const handleChangeExperience = (event) => {
        setNothingChanged(false);
        setValues({
            ...values,
            experience: event.target.value
        });
        setErrors({
            ...errors,
            experience: false
        });
    };

    const countCharacters = (html) => {
        const text = html.replace(/<[^>]+>/g, ''); // Удаление HTML тегов из текста
        return text.length;
      };

    const handleChangeBiography = (value) => {
        setNothingChanged(false);
        if (countCharacters(value) <= 850) {
          setValues({
            ...values,
            biography: value
          });
        }
        setCountValue(value.length)
      };

    const handleChangeMainDescription = (value) => {
        if (values.main_description !== value) {
          setNothingChanged(false);
          setDataCkEditor(value)
        }
      };

    const handleChangeCity = (event) => {
        const value = event.target.value
        setNothingChanged(false)
        setChoosenCities(value);
        setValues({
            ...values,
            city: value?.map((el) => cities?.find(elem => elem.name === el)?.id),
        })
        setErrors({
            ...errors,
            city: false
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

    const validate = () => {
        let validComplete = true;
        let formErrors = {...errors};

        if (values.fio === '') {
            validComplete = false;
            formErrors.fio = false;
            showAlert(3,'error', "Поле ФИО не должно быть пустым")
        }

        if ( values.city.length === 0) {
            validComplete = false;
            formErrors.city = false;
            showAlert(3, 'error', "Поле Массив связных городов не должно быть пустым")
        }

        if (values.preview_description === '') {
            validComplete = false;
            formErrors.preview_description = false;
            showAlert(3, 'error', "Поле Описание превью не должно быть пустым")
        }

        if (values.main_description === '') {
            validComplete = false;
            formErrors.main_description = false;
            showAlert(3, 'error', "Поле Основное описание не должно быть пустым")
        }

        if ((typeof(+values.experience) != 'number') | (+values.experience < 0) | (+values.experience > 100)) {
            validComplete = false;
            formErrors.experience = false;
            showAlert(3, 'error', "Поле Опыт должно быть целым числом от 1 до 100")
        }

        if(values.biography === '') {
            validComplete = false;
            formErrors.biography = false;
            showAlert(3, 'error', "Поле Биография не должно быть пустым")
        }

        setErrors(formErrors);
        return validComplete;
    };

    const submitAvatar = async () => {
        if (nothingChanged) {
            showAlert(1, 'error', 'Нет изменений');
            return;
        }

        setSubmitDisabled(true);

        let data = new FormData();
        data.append('img', values.preview_img);

        putU(`specialist/preview/${id}`, data)
            .then((resp) => {
                if (resp.status === 'success') {
                    showAlert(1, 'success', 'Данные успешно обновленны');
                } else {
                    showAlert(1, 'error', 'Ошибка');
                }
            })
            .catch((err) => {
                showAlert(1, 'error', 'Ошибка сервера');
            })
            .finally(() => {
                setSubmitDisabled(false);
            })
        ;
    };

    const submitServices = () => {
        if (nothingChanged) {
            showAlert(4, 'error', 'Нет изменений');
            return;
        }

        setSubmitDisabled(true);

        putU(`specialist/services/${id}`, {services_id: rowSelectionModel})
            .then((resp) => {
                if (resp.status === 'success') {
                    showAlert(4, 'success', 'Данные успешно обновленны');
                } else {
                    showAlert(4, 'error', 'Ошибка');
                }
            })
            .catch((err) => {
                showAlert(4, 'error', 'Ошибка сервера');
            })
            .finally(() => {
                setSubmitDisabled(false);
            })
        ;
    }

    const submitMainImg = async () => {
        if (nothingChanged) {
            showAlert(2, 'error', 'Нет изменений');
            return;
        }

        setSubmitDisabled(true);

        let data = new FormData();
        data.append('img', values.main_img);

        putU(`specialist/main/${id}`, data)
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

    const submitInfo = async () => {
        if (nothingChanged) {
            showAlert(3, 'error', 'Нет изменений');
            return;
        }

        if (validate()) {
            setSubmitDisabled(true);

            const data = {
                fio: values.fio,
                city_id: cities.filter(el => choosenCities.find(elem => elem === el.name)).map(el => el.id),
                // specialization: values.specialization,
                preview_description: values.preview_description,
                main_description: dataCkEditor,
                experience: +values.experience,
                biography: values.biography
            };

            putU(`specialist/${id}`, data)
                .then((resp) => {
                    console.log(resp)
                    if (resp.status === 'success') {
                        showAlert(3, 'success', 'Данные успешно обновленны');
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
        }
    };

    useEffect(() => {
        setIsLoaded(true);

        Promise.all([
          getU("city"),
          getU(`services?limit=${9999}`),
          getU(`specialist/services/${id}`),
          getU(`specialist/before_after/${id}`),
          getU(`specialist/${id}`)
        ])
          .then(([cityResp, servicesResp, specialistServicesResp, beforeAfterResp, specialistResp]) => {
            if (cityResp.status === "success") {
              setCities(cityResp.data.city);
            }

            if (servicesResp.status === "success") {
              setServices(servicesResp.data.service);
              setServicesTotalCount(servicesResp.data.totalCount)
            }

            if (specialistServicesResp.status === "success") {
              setRowSelectionModel(specialistServicesResp.data.data.map((el) => el.id));
            }

            if (beforeAfterResp.status === "success") {
              setBeforeAfter(beforeAfterResp.data.data);
            }

            if (specialistResp.status === "success") {
              const data = {
                ...specialistResp.data.specialist,
              };

              const preview_img = specialistResp.data.specialist.preview_img
                ? `${process.env.REACT_APP_API_URL}public/uploads/images/${specialistResp.data.specialist.preview_img}`
                : "";

              const main_img = specialistResp.data.specialist.main_img
                ? `${process.env.REACT_APP_API_URL}public/uploads/images/${specialistResp.data.specialist.main_img}`
                : "";
              setValues({ ...data, experience: String(data.experience) });
              setCountValue(countCharacters(data.biography))
              setDataCkEditor(specialistResp.data.specialist.main_description)
              setUploadedPreview(preview_img);
              setUploadedMainImg(main_img);
              setChoosenCities(specialistResp.data.specialist.city.map((el) => el.name));
            }
          })
          .catch((e) => {
            showAlert(1, "error", "Произошла ошибка при загрузке специалистов, попробуйте перезайти");
            console.log(e);
          })
          .finally(() => {
            setIsLoaded(false);
          });
      }, [id]);

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
                <title>Редактирование специалиста</title>
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
                            <p>Редактировать специалиста</p>
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
                                <Box sx={{display: 'flex', justifyContent: 'flex-end', p: 2}}>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        onClick={submitAvatar}
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
                                <Box sx={{display: 'flex', justifyContent: 'flex-end', p: 2}}>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        onClick={submitMainImg}
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

            {/*info*/}
            <Box sx={{backgroundColor: 'background.default', pt: 3}}>

                <Container maxWidth={false}>
                    <Box sx={{
                        paddingBottom: 1
                    }}>
                        <form>
                            <Card>
                                <CardHeader
                                    title="Редактирование пользователя"
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
                                        error={errors.fio}
                                    />
                                    <FormControl fullWidth sx={{mt: 2, mb: 1}}>
                                        <InputLabel id="Города">
                                            Города
                                        </InputLabel>
                                        <Select
                                            label="Города"
                                            name="city"
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
                                        error={errors.preview_description}
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
                                        error={errors.experience}
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
                                            handleChangeMainDescription(String(editor.getData()));
                                            }}
                                            data={dataCkEditor}
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
                                        Символов осталось: { 850 - countValue}
                                    </Typography>
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
                                        onClick={submitInfo}
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

            {/* services */}
            <Box sx={{backgroundColor: 'background.default', pt: 3}}>
                <Container maxWidth={false}>
                    <Box sx={{
                        paddingBottom: 1
                    }}>
                        <Card>
                            <CardHeader
                                title="Редактирование списка услуг"
                            />
                            <Divider/>
                            <CardContent sx={{position: 'relative'}}>
                                <DataGrid
                                    {...data}
                                    checkboxSelection
                                    onRowSelectionModelChange={(newRowSelectionModel) => {
                                        setNothingChanged(false);
                                        setRowSelectionModel(newRowSelectionModel);
                                    }}
                                    rowSelectionModel={rowSelectionModel}
                                    page={page}
                                    onPageChange={handlePageChange}
                                    pageSize={pageSize}
                                    onPageSizeChange={handlePageSizeChange}
                                />
                                <Box sx={{p: 2}}>
                                    Список услуг: {rowSelectionModel.join(', ')}
                                </Box>
                                <Alert severity={alert.type}
                                        style={{display: alert.number === 4 ? 'flex' : 'none'}}>
                                    {alert.txt}
                                </Alert>
                            </CardContent>
                            <Divider/>
                            <Box sx={{display: 'flex', justifyContent: 'flex-end', p: 2}}>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={submitServices}
                                    disabled={submitDisabled}
                                >
                                    Сохранить
                                </Button>
                            </Box>
                        </Card>
                    </Box>
                </Container>
            </Box>

            {/* до/после */}
            <Box sx={{backgroundColor: 'background.default', pt: 3}}>
                <Container maxWidth={false}>
                    <Box sx={{
                        paddingBottom: 1
                    }}>
                        <Card>
                            <CardHeader
                                title="Редактирование раздела До/после"
                            />
                            <Link to={`/app/specialist/before_after/add/${id}`} style={{margin: "0 0 16px 16px"}}>
                                <Button color="primary" variant="contained">
                                    Добавить запись
                                </Button>
                            </Link>
                            <Box sx={{
                                paddingBottom: 1
                            }}></Box>
                            <Divider />
                            <CardContent sx={{position: 'relative'}}>
                                {beforeAfter.length ?
                                <TableContainer component={Paper}>
                                <Table aria-label="collapsible table">
                                    <TableHead>
                                        <TableRow>
                                        <TableCell />
                                        <TableCell>ID</TableCell>
                                        <TableCell>Заголовок</TableCell>
                                        <TableCell>Фото до</TableCell>
                                        <TableCell>Фото после</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {beforeAfter.map((row) => (
                                            <BeforeAfterRow key={row.id} row={row} showAlert={showAlert} />
                                        ))}
                                    </TableBody>
                                </Table>
                                </TableContainer>
                                :
                                <Typography>
                                    Нет записей
                                </Typography>}
                                <Alert severity={alert.type}
                                        style={{display: alert.number === 5 ? 'flex' : 'none'}}>
                                    {alert.txt}
                                </Alert>
                            </CardContent>
                        </Card>
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default SpecialistEdit;
