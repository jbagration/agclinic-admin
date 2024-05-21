import { useState, useRef, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardHeader,
    CardContent,
    Divider,
    TextField,
    CircularProgress,
    Container, FormControl, InputLabel, Select, MenuItem
} from '@material-ui/core';
import EmailEditor from 'react-email-editor';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import { useNavigate, useParams } from 'react-router-dom';
import EmailTemplateAlert from '../../../components/email-template/EmailTemplateAlert';
import { useGet, usePut } from '../../../API/request';
import {BallTriangle} from "react-loader-spinner";

const EmailTemplateEdit = () => {

    const { id } = useParams();
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const getU = useGet();
    const putU = usePut();

    const [isLoaded, setIsLoaded] = useState(true);
    const [keys, setKeys] = useState();

    const [values, setValues] = useState({
        key: '',
        subject: '',
        comment: ''
    });
    const [errors, setErrors] = useState({
        key: false,
        subject: false,
        comment: false
    });
    const [alert, setAlert] = useState({
        status: '',
        message: ''
    });
    const [dataBeforeChange, setDataBeforeChange] = useState({
        key: '',
        subject: ''
    });

    const emailEditorRef = useRef(null);
    const navigate = useNavigate();

    const handleChange = (event) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value
        });
    };

    const showAlert = (status, msg) => {
        setAlert({
            status,
            message: msg
        });

        setTimeout(() => {
            setAlert({
                status: '',
                message: ''
            });
            setSubmitDisabled(false);
        }, 1500);
    };

    const onLoad = () => {
        getU(`template/${id}`)
            .then((resp) => {

                let tpl = resp.data.template;

                setValues({
                    key: tpl.key,
                    subject: tpl.subject,
                    comment: tpl.comment
                });

                setDataBeforeChange({
                    subject: tpl.subject
                });

                emailEditorRef.current.editor.loadDesign(tpl.draft);
            });

    };

    const exportHtml = (callback) => emailEditorRef.current.editor.exportHtml((data) => callback(data.html, data.design));

    const validate = () => {
        let validComplete = true;
        let formErrors = { ...errors };


        if (values.subject.trim() === '') {
            validComplete = false;
            formErrors.subject = true;
        }

        setErrors(formErrors);
        return validComplete;
    };

    const save = () => {
        if (validate()) {
            exportHtml((html, design) => {
                console.log(html)
                console.log(design)
                let payload = {
                    draft: design,
                    html,
                    comment: values.comment,
                    key: values.key
                };

                if (dataBeforeChange.subject !== values.subject) {
                    payload.subject = values.subject;
                }


                setSubmitDisabled(true);
                setShowLoader(true);

                putU(`template/${id}`, payload)
                    .then((resp) => {
                        setShowLoader(false);
                        if (resp.status === 'success') {
                            showAlert('success', 'Шаблон успешно обновлен');
                        } else {
                            showAlert('error', 'Ошибка');
                        }
                    })
                    .catch((err) => {
                        setShowLoader(false);
                        showAlert('error', 'Server error');
                    });
            });
        }
    };

    useEffect(() => {
        setIsLoaded(true)
        getU('template/keys')
            .then((response) => {
                if (response.status === 'success') {
                    setKeys(response.data.keys)
                }
            })
            .catch(() => {
                console.log('error')
            })
            .finally(() => {
                setIsLoaded(false)
            })
    }, [])


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
            <Box sx={{ pt: 2 }}>
                <Container maxWidth={false}>
                    <Button startIcon={<ChevronLeft/>} onClick={() => navigate(-1)}>
                        Назад
                    </Button>
                </Container>
            </Box>
            <form>
                <Card sx={{ m: 3 }}>
                    <CardHeader
                        title="Обновление email шаблона"
                    />
                    <Divider/>
                    <CardContent>
                        <FormControl fullWidth sx={{mt: 2, mb: 1}}>
                            <InputLabel id="keys">Ключ</InputLabel>
                            <Select
                                labelId="keys"
                                name="key"
                                value={values.key}
                                label="Ключ"
                                onChange={handleChange}
                            >
                                {
                                    keys?.map((item) => <MenuItem value={item.key}>{item.key}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="Subject"
                            margin="normal"
                            name="subject"
                            onChange={handleChange}
                            type="text"
                            value={values.subject}
                            variant="outlined"
                            error={errors.subject}
                            helperText={errors.subject && 'Type template subject'}
                        />
                        <TextField
                            fullWidth
                            label="Comment"
                            margin="normal"
                            name="comment"
                            onChange={handleChange}
                            type="text"
                            value={values.comment}
                            variant="outlined"
                            error={errors.comment}
                            helperText={errors.comment && 'Type template subject'}
                        />
                    </CardContent>
                </Card>
                <Box sx={{ m: 3 }}>
                    <EmailTemplateAlert status={alert.status} message={alert.message}
                                        onClose={() => setAlert({ status: '', message: '' })}/>
                </Box>
                <Box sx={{ m: 3, flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button color="primary" variant="outlined" onClick={() => navigate(-1)}>
                            Cancel
                        </Button>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CircularProgress style={{ marginRight: '16px', display: showLoader ? 'block' : 'none' }}/>
                            <Button color="primary" variant="contained" onClick={save} disabled={submitDisabled}>
                                Edit
                            </Button>
                        </Box>
                    </Box>
                    <Box sx={{ mt: 3 }}>
                        <Card>
                            <CardContent>
                                <EmailEditor ref={emailEditorRef} minHeight="75vh" onLoad={onLoad}/>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            </form>
        </>
    );
};

export default EmailTemplateEdit;
