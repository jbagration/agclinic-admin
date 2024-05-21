import React, {useState, useEffect} from 'react';
import {Helmet} from 'react-helmet';
import {
    Box,
    Container,
    Button,
    Typography, Card, Table, TableHead, TableRow, TableCell, TableBody, TextField, Alert, Grid, CardContent
} from '@material-ui/core';
import {Link as RouterLink, Link} from 'react-router-dom';
import {useGet, useDelete, usePost, usePut} from '../../../API/request'
import PerfectScrollbar from "react-perfect-scrollbar";
import {useConfirm} from '../../../components/Confirm';
import {BallTriangle} from "react-loader-spinner";
import '../../../styles/Emails/email.css'
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import {Visibility, VisibilityOff} from "@material-ui/icons";

const EmailSettings = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [emailTemplates, setEmailTemplates] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);

    const getU = useGet();
    const postU = usePost();
    const putU = usePut();
    const deleteU = useDelete();
    const confirm = useConfirm();

    const [values, setValues] = useState({
        smtpHost: '',
        smtpPort: '',
        smtpUsername: '',
        smtpPassword: ''
    });

    const [errors, setErrors] = useState({
        smtpHost: false,
        smtpPort: false,
        smtpUsername: false,
        smtpPassword: false
    });

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

    const hideValue = (event) => {
        setErrors({
            ...errors,
            [event.target.name]: false
        });
    };

    const showAlert = (type, text, hideAlert = true) => {
        setAlert({
            txt: text,
            type,
            isVisible: true
        });

        if (hideAlert) {
            setTimeout(() => {
                setAlert({
                    ...alert,
                    isVisible: false
                });

                setSubmitDisabled(false);

                if (type === 'success') {
                    loadData();
                }
            }, 1400);
        }
    };

    const onDelete = (id) => {
        confirm({
            title: 'Deleting',
            content: 'Are you sure you want to delete the template?',
            onConfirm: () => {
                deleteU(`admin/setting?setting=email_template&id=${id}`)
                    .then((resp) => {
                        if (resp.status === 'success') {
                            loadData();
                        }
                    })
                    .catch((e) => {
                        console.log(e.response)
                    });
            }
        });
    };


    const validate = () => {
        let validComplete = true;
        let formErrors = {...errors};

        if (!values.smtpHost) {
            validComplete = false;
            formErrors.smtpHost = 'Поле не должно быть пустым';
        }

        if (!values.smtpPort) {
            validComplete = false;
            formErrors.email = 'Поле не должно быть пустым';
        }

        if (!values.smtpUsername) {
            validComplete = false;
            formErrors.smtpUsername = 'Поле не должно быть пустым';
        }

        if (!values.smtpPassword) {
            validComplete = false;
            formErrors.smtpPassword = 'Поле не должно быть пустым';
        }

        setErrors(formErrors);
        return validComplete;
    };

    const onSubmit = async () => {
        if (validate()) {

            putU(`smtp`, values)
                .then((resp) => {
                    if (resp.status === 'success') {
                        showAlert('success', 'SMTP успешно обновлен');
                    }
                })
                .catch((err) => {
                    showAlert('error', 'Ошибка');
                })
                .finally(() => {

                });
        }
    };

    const loadData =  async () => {
        setDataLoading(true);


        await getU('template')
            .then((resp) => {
                if (resp.status === 'success') {
                    setEmailTemplates(resp.data.templates);
                }
            })
            .catch((err) => {
                console.log(err.response)
            })
            .finally(() => {
                setDataLoading(false);
            });

        await getU('smtp')
            .then((response) => {
                if (response.status === 'success') {
                    setValues({
                        smtpHost: response.data.smtp.smtpHost,
                        smtpPort: response.data.smtp.smtpPort,
                        smtpUsername: response.data.smtp.smtpUsername,
                        smtpPassword: response.data.smtp.smtpPassword,
                    })
                }
            })
            .catch(() => {

            })
            .finally(() => {
                setDataLoading(false);
            })


    };

    useEffect(() => {
        loadData();
    }, []);

    if (dataLoading) {
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
                <title>Email template list</title>
            </Helmet>
            <Box className="headerWrapper">
                <Box className="headerTitle">
                    Email шаблоны
                </Box>
            </Box>
            <Box sx={{backgroundColor: 'background.default', minHeight: '100%', py: 3}}>
                <Container maxWidth={false}>
                    <>
                        <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                            <Link to="/app/email-templates/create">
                                <Button color="primary" variant="contained">
                                    Добавить email шаблон
                                </Button>
                            </Link>
                        </Box>
                        <div className="email-smtp-container">
                            <div className="email-smtp-form">
                                <div className="email-smtp-header">
                                    Update Smtp
                                </div>
                                <div className="email-smtp-inputs">
                                    <Grid container spacing={3} marginTop={0}>
                                        <Grid item md={12} xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Smtp Host"
                                                name="smtpHost"
                                                onChange={handleChange}
                                                onFocus={hideValue}
                                                required
                                                type="email"
                                                value={values.smtpHost}
                                                variant="outlined"
                                                error={errors.smtpHost}
                                                helperText={errors.smtpHost}
                                            />
                                            {!errors.smtpHost &&
                                            <div className="email-smtp-helperMess">
                                                Хост
                                            </div>
                                            }
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Smtp Port"
                                                name="smtpPort"
                                                onChange={handleChange}
                                                onFocus={hideValue}
                                                required
                                                type="message"
                                                value={values.smtpPort}
                                                variant="outlined"
                                                error={errors.smtpPort}
                                                helperText={errors.smtpPort}
                                            />
                                            {!errors.smtpPort &&
                                            <div className="email-smtp-helperMess">
                                                Порт
                                            </div>
                                            }
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Smtp Username"
                                                name="smtpUsername"
                                                onChange={handleChange}
                                                onFocus={hideValue}
                                                required
                                                type="message"
                                                value={values.smtpUsername}
                                                variant="outlined"
                                                error={errors.smtpUsername}
                                                helperText={errors.smtpUsername}
                                            />
                                            {!errors.smtpUsername &&
                                            <div className="email-smtp-helperMess">
                                                Имя пользователя
                                            </div>
                                            }
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Пароль"
                                                name="smtpPassword"
                                                onChange={handleChange}
                                                onFocus={hideValue}
                                                required
                                                type={showPassword ? "text" : "password"}
                                                value={values.smtpPassword}
                                                variant="outlined"
                                                error={errors.smtpPassword}
                                                helperText={errors.smtpPassword}
                                                InputProps={{ // <-- This is where the toggle button is added.
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                onMouseDown={() => setShowPassword(!showPassword)}
                                                            >
                                                                {showPassword ? <Visibility/> : <VisibilityOff/>}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                            {!errors.smtpPassword &&
                                            <div className="email-smtp-helperMess">
                                                Пароль приложения
                                            </div>
                                            }
                                        </Grid>
                                    </Grid>

                                    <Alert severity={alert.type}
                                           style={{display: alert.isVisible ? 'flex' : 'none', margin: '12px 0'}}>
                                        {alert.txt}
                                    </Alert>
                                    <div>
                                        <Button
                                            className="email-smtp-button"
                                            color="primary"
                                            variant="contained"
                                            disabled={submitDisabled}
                                            onClick={onSubmit}
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <Box sx={{pt: 3}}>
                                <Card>
                                    <PerfectScrollbar>
                                        <Box sx={{minWidth: 700}}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>
                                                            Id
                                                        </TableCell>
                                                        <TableCell>
                                                            Ключ
                                                        </TableCell>
                                                        <TableCell>
                                                            Название
                                                        </TableCell>
                                                        <TableCell/>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {emailTemplates?.map((template) => (
                                                        <TableRow hover key={template.id}>
                                                            <TableCell>
                                                                {template.id}
                                                            </TableCell>
                                                            <TableCell>
                                                                {template.key}
                                                            </TableCell>
                                                            <TableCell>
                                                                {template.subject}
                                                            </TableCell>
                                                            <TableCell sx={{
                                                                display: 'flex',
                                                                justifyContent: 'flex-end'
                                                            }}>
                                                                <RouterLink
                                                                    to={`/app/email-templates/edit/${template.id}`}>
                                                                    <Button color="primary"
                                                                            variant="contained">
                                                                        Редактировать
                                                                    </Button>
                                                                </RouterLink>
                                                                <Button sx={{ml: 1}} color="primary"
                                                                        variant="contained"
                                                                        onClick={() => onDelete(template.id)}>
                                                                    Удалить
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </Box>
                                    </PerfectScrollbar>
                                </Card>
                            </Box>
                        </div>

                    </>
                </Container>
            </Box>
        </>
    );
};

export default EmailSettings;
