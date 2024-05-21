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
    Paper,
    OutlinedInput,
    Checkbox,
    IconButton,
    ListItemText,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import DeleteIcon from '@mui/icons-material/Delete';
import {useParams, useNavigate, Link} from 'react-router-dom';
import {useGet, usePut, usePost} from "../../API/request";
import {BallTriangle} from "react-loader-spinner";
import '../../styles/Avatar/style.css'
import 'react-quill/dist/quill.snow.css';


const DocumentAdd = () => {

    const navigate = useNavigate();
    const getU = useGet();
    const postU = usePost();
    const putU = usePut();

    const [isLoaded, setIsLoaded] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [nothingChanged, setNothingChanged] = useState(true);
    const [dataReceipt, setDataReceipt] = useState('');

    const [imgDocument, setImgDocument] = useState('/static/images/defphoto.jpg');
    const [values, setValues] = useState({
        title: "",
        description: "",
        img: []
    });
    const [errors, setErrors] = useState({
        title: false,
        description: false,
    });

    const [alert, setAlert] = useState({
        txt: '',
        type: 'error',
        number: 0,
    });

    const handleChange = (event, name) => {
        setNothingChanged(false);
        setValues({
            ...values,
            [name]: event.target.value
        });
        setErrors({
            ...errors,
            [name]: false
        });
      };

    const handleDataReceipt = (event) => {
        setDataReceipt(event.target.value);
        };

    const imgUploaded = (event) => {
        setNothingChanged(false);
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];

            // Проверка на дубликаты картинок
            const isDuplicate = values.img.some((existingFile) => existingFile.name === file.name && existingFile.size === file.size);
            if (isDuplicate) {
                showAlert(2, 'error', 'Дубликат документа');
            return;
            }

            setImgDocument(URL.createObjectURL(file));
            setValues((prevState) => ({
            ...prevState,
            img: [
                ...prevState.img,
                file
            ]
            }));
        }
        setImgDocument('/static/images/defphoto.jpg');
        };

    const handleRemoveImage = (index) => {
        const updatedImages = values.img.filter((_, i) => i !== index);
        setValues({ ...values, img: updatedImages });
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
            description: "",
            date_receipt: dataReceipt,
            img: [],
            });
    };

    const validate = () => {
        let validComplete = true;
        let formErrors = {...errors};

        if (values.title === '') {
            validComplete = false;
            formErrors.title = false;
            showAlert(3, 'error', "Введите название баннера")
        }

        if (values.description === '') {
            validComplete = false;
            formErrors.description = false;
            showAlert(3, 'error', "Введите описание")
        }

        setErrors(formErrors);
        return validComplete;
    };

    const submitImgDocument = async (id) => {
        if (nothingChanged) {
            showAlert(1, 'error', 'Нет изменений');
            return;
        }
        setSubmitDisabled(true);

        let data = new FormData();

        if (Array.isArray(values.img) && values.img.length === 1) {
          data.append('img', values.img[0]);
        } else {
            values.img.forEach((file) => {
              data.append('img', file);
            });
        }

        putU(`documents/image/${id}`, data)
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

    const submit = async () => {
        if (nothingChanged) {
          showAlert(1, 'error', 'Нет изменений');
          return;
        }
        setSubmitDisabled(true);

        const data = {};

        if (values.title !== "") {
            data.title = values.title;
          }

        if (values.description !== "") {
            data.description = values.description;
        }

        if (dataReceipt !== "") {
        data.date_receipt = dataReceipt;
        }

        postU(`documents`, data)
        .then((resp) => {
            if (resp.status === 'success') {
            submitImgDocument(resp.data.document)
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

      };

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
                <title>Добавление документа</title>
            </Helmet>
            <Box sx={{pt: 2}}>
                <Container maxWidth={false}>
                    <Button startIcon={<ChevronLeft/>} onClick={() => navigate(-1)}>
                        Назад
                    </Button>
                    <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 14 }}>
                        <Link underline="hover" color="inherit" to="/app/documents">
                            Документы
                        </Link>
                            <p>Добавление документа</p>
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
                                    title="Добавление изображения документа"
                                />
                                <Divider/>
                                <CardContent sx={{position: 'relative'}}>
                                    <Grid container spacing={2}>
                                        {values.img.map((image, index) => (
                                            <Grid item xs={6} sm={4} md={3} key={index}>
                                                <Paper elevation={3} style={{ width: '220px', height: '220px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                                                    <img src={URL.createObjectURL(image)} alt={`Image ${index}`} style={{ width: '200px', height: '200px' }} />
                                                    <IconButton
                                                        style={{ position: 'absolute', top: '5px', right: '5px' }}
                                                        onClick={() => handleRemoveImage(index)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                    <div className="itemWrapper">
                                        <div className="container">
                                            <input accept="xlsx/*" type="file" style={{display: 'none'}}
                                                   id={1}
                                                   onChange={(event) => imgUploaded(event, 1)}/>
                                            <label htmlFor={1}>
                                                <img src={imgDocument} className="itemImg"/>
                                                <div className="middle"/>
                                            </label>
                                        </div>
                                        <div className="help-text">
                                            Доступны следующие расширения: .png .jpg .svg .bmp .tga .webp
                                        </div>
                                    </div>
                                </CardContent>
                                <Divider/>
                                <Alert severity={alert.type}
                                        style={{display: alert.number === 2 ? 'flex' : 'none'}}>
                                    {alert.txt}
                                </Alert>
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
                                    title="Документ"
                                />
                                <Divider/>
                                <CardContent sx={{position: 'relative'}}>
                                    <TextField
                                        fullWidth
                                        label="Название документа"
                                        margin="normal"
                                        name="title"
                                        onChange={(event) => handleChange(event, 'title')}
                                        type="text"
                                        value={values.title}
                                        variant="outlined"
                                        error={errors.title}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Описание"
                                        margin="normal"
                                        name="description"
                                        onChange={(event) => handleChange(event, 'description')}
                                        type="textarea"
                                        multiline
                                        value={values.description}
                                        variant="outlined"
                                        error={errors.description}
                                    />
                                    <TextField
                                        fullWidth
                                        sx={{ marginRight: 2, marginTop: 2 }}
                                        label="Дата получения документа"
                                        type="date"
                                        value={dataReceipt}
                                        onChange={handleDataReceipt}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
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

export default DocumentAdd;
