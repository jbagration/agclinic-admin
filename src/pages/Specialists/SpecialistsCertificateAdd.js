import React, {useState, useEffect} from 'react';
import { Helmet } from 'react-helmet';
import {
    Box,
    Avatar,
    Container,
    Button,
    Card,
    CardContent,
    TextField,
    Paper,
    Divider,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Breadcrumbs,
    Table,
    Alert,
    IconButton,
    Grid,
    Typography,
    CardHeader,
    Tab,
    Tabs
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import {useParams, useNavigate, Link} from 'react-router-dom';
import {useGet, usePut, usePost} from "../../API/request";
import {BallTriangle} from "react-loader-spinner";
import DeleteIcon from '@mui/icons-material/Delete';

const SpecialistsCertificateAdd = () => {

    const {id} = useParams();
    const navigate = useNavigate();
    const getU = useGet();
    const postU = usePost();
    const putU = usePut();
    const [tab, setTab] = useState(0);
    const [values, setValues] = useState({
        img: [],
        url: '',
    });
    const [isLoaded, setIsLoaded] = useState(false);
    const [user, setUser] = useState({});
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [nothingChanged, setNothingChanged] = useState(true);
    const [imgDocument, setImgDocument] = useState('/static/images/defphoto.jpg');

    const [errors, setErrors] = useState({
        title: false,
        description: false,
    });

    const [alert, setAlert] = useState({
        txt: '',
        type: 'error',
        number: 0,
    });

    const handleTab = (_, value) => setTab(value);

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
            url: "",
            img: [],
            });
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

        putU(`specialist/certificates/image/${id}`, data)
            .then((resp) => {
                if (resp.status === 'success') {
                    showAlert(3, 'success', 'Сертификат добавлен');
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
        setSubmitDisabled(true);

        let data = {}

        if(tab === 0){
            data = {
                specialist_id: id,
                status: false,
            };
        } else {
            data = {
                url: values.url,
                specialist_id: id,
                status: true,
            };
        }

        postU(`specialist/certificates`, data)
            .then((resp) => {
                if (resp.status === 'success') {
                    showAlert(4,'success', 'Сертификат добавлен');
                        if(tab === 0){
                            submitImgDocument(resp.data.certificates)
                        }
                    clearForm();
                } else {
                    showAlert(4,'error', 'Ошибка');
                }
            })
            .catch((err) => {
                showAlert(4, 'error', 'Ошибка сервера');
                setSubmitDisabled(false);
            })
    };

    useEffect(() => {
        setIsLoaded(true)
        getU(`specialist/${id}`)
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
                <title>Добавить доп.вложение</title>
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
                            <p>Добавить доп.вложение</p>
                    </Breadcrumbs>
                </Container>
            </Box>

            <Box sx={{backgroundColor: 'background.default', minHeight: '100%'}}>
                <Container maxWidth={false}>
                    <Box sx={{pt: 2}}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '96%', marginLeft: 3 }}>
                            <Tabs value={tab} onChange={handleTab} aria-label="basic tabs example">
                                <Tab label="Добавить изображение" id="simple-tab-0" {...{ 'aria-controls': 'simple-tabpanel-0' }} />
                                <Tab label="Добавить видео" id="simple-tab-1" {...{ 'aria-controls': 'simple-tabpanel-1' }} />
                            </Tabs>
                        </Box>
                        <Box hidden={tab !== 0} id="simple-tabpanel-0" aria-labelledby="simple-tab-0">
                            <Container maxWidth={false}>
                                <Box sx={{
                                    paddingBottom: 1
                                }}>
                                    <form>
                                        <Card>
                                            <CardHeader
                                                title="Добавление изображения"
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
                                            </CardContent>
                                            <Divider/>
                                            <Alert severity={alert.type}
                                                    style={{display: alert.number === 3 ? 'flex' : 'none'}}>
                                                {alert.txt}
                                            </Alert>
                                        </Card>
                                    </form>
                                </Box>
                            </Container>
                        </Box>
                        <Box hidden={tab !== 1} id="simple-tabpanel-1" aria-labelledby="simple-tab-1">
                            {tab === 1 && (
                            <Box sx={{backgroundColor: 'background.default', minHeight: '100%'}}>
                                <Container maxWidth={false}>
                                    <form>
                                        <Card>
                                            <CardHeader
                                                title="Добавьте ссылку на видео"
                                            />
                                            <Divider/>
                                            <CardContent sx={{position: 'relative'}}>
                                                <TextField
                                                    fullWidth
                                                    label="Ссылка на видео"
                                                    margin="normal"
                                                    name="url"
                                                    onChange={handleChange}
                                                    type="text"
                                                    value={values.url}
                                                    variant="outlined"
                                                    error={errors.url}
                                                />
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
                                                    onClick={submit}
                                                    disabled={submitDisabled}
                                                >
                                                    Сохранить
                                                </Button>
                                            </Box>
                                        </Card>
                                    </form>
                                </Container>
                            </Box>
                            )}
                        </Box>
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default SpecialistsCertificateAdd;
