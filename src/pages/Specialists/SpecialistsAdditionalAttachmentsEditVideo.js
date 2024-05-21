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

const SpecialistsAdditionalAttachmentsEditVideo = () => {

    const {id} = useParams();
    const navigate = useNavigate();
    const getU = useGet();
    const putU = usePut();
    const [values, setValues] = useState({
        img: [],
        url: '',
    });
    const [isLoaded, setIsLoaded] = useState(false);
    const [user, setUser] = useState({});
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [nothingChanged, setNothingChanged] = useState(true);

    const [errors, setErrors] = useState({
        title: false,
        description: false,
    });

    const [alert, setAlert] = useState({
        txt: '',
        type: 'error',
        number: 0,
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

    const submit = async () => {

        if (nothingChanged) {
            showAlert('error', 'Нет изменений');
            return;
        }
        setSubmitDisabled(true);

        let data = {
                url: values.url
            };

        putU(`specialist/certificates/url/${id}`, data)
            .then((resp) => {
                if (resp.status === 'success') {
                    showAlert(4,'success', 'Видео обновлено');
                }
            })
            .catch((err) => {
                showAlert(4, 'error', 'Ошибка сервера');
                setSubmitDisabled(false);
            })
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
                      url: data.url,
                      specialist_id: data.specialist_id,
                    });
                }
            })
            .catch((e) => {
                showAlert(1, 'error', 'Произошла ошибка при загрузке документов, попробуйте перезайти');
                console.log(e);
              })
            .finally(() => {
                setIsLoaded(false)
            });
    }

    useEffect(() => {
        loadCertificates();
      }, []);

    useEffect(() => {
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
                <title>Редактирование видео</title>
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
                            <p>Редактирование видео</p>
                    </Breadcrumbs>
                </Container>
            </Box>

            <Box sx={{backgroundColor: 'background.default', minHeight: '100%'}}>
                <Container maxWidth={false}>
                    <Box sx={{pt: 2}}>
                        <Box sx={{backgroundColor: 'background.default', minHeight: '100%'}}>
                            <Container maxWidth={false}>
                                <form>
                                    <Card>
                                        <CardHeader
                                            title="Обновление ссылки на видео"
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
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default SpecialistsAdditionalAttachmentsEditVideo;
