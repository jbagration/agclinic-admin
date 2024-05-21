import React, {useEffect, useState} from 'react';
import {Helmet} from 'react-helmet';
import {
    Box,
    Container,
    Button,
    Card,
    CardMedia,
    CardHeader,
    Divider,
    CardContent,
    Breadcrumbs,
    TextField,
    Typography,
    Alert,
    Paper,
    Grid,
    IconButton,
    OutlinedInput,
    Checkbox,
    ListItemText,
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import {useParams, useNavigate, Link} from 'react-router-dom';
import {useGet, usePut, useDelete} from "../../API/request";
import {BallTriangle} from "react-loader-spinner";
import { format } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';
import '../../styles/Avatar/style.css'
import 'react-quill/dist/quill.snow.css';
import {useConfirm} from "../../components/Confirm/index";


const SpecialistsCertificateEditImage = () => {

    const {id} = useParams();
    const navigate = useNavigate();
    const getU = useGet();
    const putU = usePut();
    const deleteU = useDelete();
    const confirm = useConfirm();

    const [isLoaded, setIsLoaded] = useState(true);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [nothingChanged, setNothingChanged] = useState(true);
    const [user, setUser] = useState({});
    const [imgDocument, setImgDocument] = useState('/static/images/defphoto.jpg');
    const [values, setValues] = useState({
        title: "",
        img: [],
        image: [],
        specialist_id: "",
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

    const imgUploaded = (event) => {
        setNothingChanged(false);
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];

            setImgDocument(URL.createObjectURL(file));
            setValues((prevState) => ({
            ...prevState,
            img: prevState.img? [...prevState.img, file] : [file]
            }));
        }
        setImgDocument('/static/images/defphoto.jpg');
        };

    const handleRemoveImage = (index) => {
        const updatedImages = values.img.filter((_, i) => i !== index);
        setValues({ ...values, img: updatedImages });
        };

    const deleteImage = (name) => {
        confirm({
            title: 'Удаление',
            content: 'Вы уверены, что хотите удалить изображение?',
            onConfirm: () => {
                deleteU(`specialist/certificates//${id}/${name}`)
                    .then((resp) => {
                        if (resp.status === 'success') {
                            loadCertificates();
                        }
                    })
                    .catch((e) => {
                        console.log(e)
                    });
            }
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

        if (values.img === '') {
            validComplete = false;
            formErrors.img = false;
            showAlert(2, 'error', "Добавьте изображение")
        }

        setErrors(formErrors);
        return validComplete;
    };

    const submitImgDocument = async () => {
        if (nothingChanged) {
            showAlert(2, 'error', 'Нет изменений');
            return;
        }
        if (validate()) {
            setSubmitDisabled(true);

            let data = new FormData();

            if (Array.isArray(values.img) && values.img.length === 1) {
            data.append('img', values.img[0]);
            } else {
                values.img.forEach((file) => {
                data.append('img', file);
                });
            }

            putU(`specialist/certificates/image/${id}`, data)
                .then((resp) => {
                    if (resp.status === 'success') {
                        showAlert(2, 'success', 'Данные успешно добавлены');
                    } else {
                        showAlert(2, 'error', 'Ошибка');
                    }
                })
                .catch((err) => {
                    showAlert(2, 'error', 'Ошибка сервера');
                })
                .finally(() => {
                    setSubmitDisabled(false);
                    loadCertificates();
                });
        }
    };

    const loadSpecialist = (specialist_id) => {
        getU(`specialist/${specialist_id}`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setUser(resp.data.specialist)
                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setIsLoaded(false)
            });
    }

    const loadCertificates = () => {
        getU(`specialist/certificates/${id}`)
            .then((resp) => {
                if (resp.status === 'success') {
                    const data = {
                      ...resp.data.certificates,
                    };
                    setValues({
                      image: data.url,
                      specialist_id: data.specialist_id,
                    });
                }
            })
            .catch((e) => {
                showAlert(1, 'error', 'Произошла ошибка при загрузке изображений, попробуйте перезайти');
                console.log(e);
              })
            .finally(() => {
                setIsLoaded(false)
            });
    }

    useEffect(() => {
        loadCertificates();
        loadSpecialist(values.specialist_id);
      }, [values.specialist_id]);

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
                <title>Редактирование изображения</title>
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
                        <Link underline="hover" color="inherit" to={`/app/specialist/${user.id}`}>
                            {user?.fio || 'Специалист'}
                        </Link>
                            <p>Редактирование изображения доп.вложения</p>
                    </Breadcrumbs>
                </Container>
            </Box>

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
                        <CardHeader
                            title="Обновление изображения"
                        />
                        <form>
                            <Card>
                                <Divider/>
                                <CardContent sx={{position: 'relative'}}>
                                    <CardHeader title="Загруженные изображения" />
                                        {values.image && values.image.length > 0 ? (
                                    <>
                                        <Grid container spacing={2}>
                                            {values.image.map((image, index) => (
                                            <Grid item xs={6} sm={4} md={3} key={index}>
                                                <Paper
                                                elevation={3}
                                                style={{
                                                    width: '220px',
                                                    height: '220px',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    position: 'relative',
                                                    marginBottom: '15px',
                                                }}
                                                >
                                                <CardMedia
                                                    component="img"
                                                    image={`${process.env.REACT_APP_API_URL}public/uploads/images/${image}`}
                                                    alt={`Изображение ${index + 1}`}
                                                    sx={{
                                                    width: '200px',
                                                    height: '200px',
                                                    objectFit: 'contain',
                                                    }}
                                                />
                                                <IconButton
                                                    style={{ position: 'absolute', top: '5px', right: '5px' }}
                                                    onClick={() => deleteImage(image)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                                </Paper>
                                            </Grid>
                                            ))}
                                        </Grid>
                                    </>
                                ) : (
                                    <Typography sx={{ml: 5, mb: 3, mt: 2}}>Изображения отсутствуют</Typography>
                                )}
                                    <Divider style={{ marginBottom: '15px' }}></Divider>
                                    <CardHeader
                                        title="Добавление нового изображения"
                                    />
                                    <Grid container spacing={2}>
                                        {values.img?.map((image, index) => (
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
                                <Box sx={{display: 'flex', justifyContent: 'flex-end', p: 2}}>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        onClick={submitImgDocument}
                                        disabled={submitDisabled}
                                    >
                                        Сохранить
                                    </Button>
                                </Box>
                                <Alert severity={alert.type}
                                        style={{display: alert.number === 2 ? 'flex' : 'none'}}>
                                    {alert.txt}
                                </Alert>
                            </Card>
                        </form>
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default SpecialistsCertificateEditImage;
