import {Helmet} from 'react-helmet';
import {
    Box,
    Container,
    Button,
    TextField,
    CardContent,
    Breadcrumbs
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

const BeforeAfterAdd = () => {

    const navigate = useNavigate();
    const postU = usePost();
    const {id} = useParams();

    const [isLoaded, setIsLoaded] = useState(false);

    const [isValidateEmail, setIsValidateEmail] = useState(true);
    const [title, setTitle] = useState('');
    const [error, setError] = useState(false);

    const [isShowLoader, setIsShowLoader] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const [alert, setAlert] = useState({
        txt: '',
        isVisible: false,
        type: 'error'
    });

    const handleChange = (e) => {
        setTitle(e.target.value);
        setError(false);
    };

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
        let formErrors = false
        let validComplete = true
        if (title === '') {
            validComplete = false;
            formErrors = true;
            showAlert('error', "Поле Title не должно быть пустым")
        }

        setError(formErrors);
        return validComplete;
    };

    const clearForm = () => {
        setTitle('');
    };

    const submit = async () => {
        if (validate()) {
            setIsShowLoader(true);
            setSubmitDisabled(true);

            const data = {
                specialist_id: id,
                title: title,
            };

            postU('specialist/before_after', data)
                .then((resp) => {
                    if (resp.status === 'success') {
                        showAlert('success', 'Note added');
                        clearForm();
                    } else {
                        showAlert('error', 'Ошибка');
                    }
                })
                .catch((err) => {
                    showAlert('error', 'Ошибка сервера');
                    setIsShowLoader(false);
                    setSubmitDisabled(false);
                })
                .finally(()=>{

                });
        }
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
                            <p>До/после</p>
                    </Breadcrumbs>
                </Container>
            </Box>
            <Box sx={{backgroundColor: 'background.default', minHeight: '100%'}}>
                <Container maxWidth={false}>
                    <Box sx={{pt: 2}}>
                        <form>
                            <Card>
                                <CardHeader
                                    title="Добавление записи До/после"
                                />
                                <Divider/>
                                <CardContent sx={{position: 'relative'}}>
                                    <TextField
                                        fullWidth
                                        label="Title"
                                        margin="normal"
                                        name="title"
                                        onChange={handleChange}
                                        type="text"
                                        value={title}
                                        variant="outlined"
                                        error={error}
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

export default BeforeAfterAdd;
