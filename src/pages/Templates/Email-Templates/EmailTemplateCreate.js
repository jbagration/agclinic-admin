import {useState, useRef, useEffect} from 'react';
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
import {useNavigate} from 'react-router-dom';
import EmailTemplateAlert from '../../../components/email-template/EmailTemplateAlert';
import {useGet, usePost} from '../../../API/request';
import {BallTriangle} from "react-loader-spinner";

const EmailTemplateCreate = () => {

    const navigate = useNavigate();
    const postU = usePost();
    const getU = useGet();

    const emailEditorRef = useRef(null);

    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
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

    const exportHtml = (callback) => emailEditorRef.current.editor.exportHtml((data) => callback(data.html, data.design));

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
        }, 2500);
    };

    const validate = () => {
        let validComplete = true;
        let formErrors = {...errors};

        if (values.subject.trim() === '') {
            validComplete = false;
            formErrors.subject = true;
        }

        setErrors(formErrors);
        return validComplete;
    };

    const create = () => {
        if (validate()) {
            exportHtml((html, design) => {

                if (!(html && design)) {
                    showAlert('error', 'Шаблон еще не загрузился');
                    return;
                }

                const payload = {
                    subject: values.subject,
                    key: values.key,
                    draft: design,
                    html: html,
                    comment: values.comment
                };

                setSubmitDisabled(true);
                setShowLoader(true);

                postU('template', payload)
                    .then((resp) => {
                        setShowLoader(false);
                        if (resp.status === 'success') {
                            showAlert('success', 'Шаблон успешно добавлен');
                        } else {
                            showAlert('error', 'Ошибка');
                        }
                    })
                    .catch((err) => {
                        setShowLoader(false);

                        console.log(err.response)

                        if (err.response.status === 400){
                            if (err.response.data.message === 'such a key already exists'){
                                showAlert('error', 'Шаблон с таким ключем уже существует');
                            } else {
                                showAlert('error', 'Ошибка сервера');
                            }
                        } else {
                            showAlert('error', 'Ошибка сервера');
                        }


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
            <Box sx={{pt: 2}}>
                <Container maxWidth={false}>
                    <Button startIcon={<ChevronLeft/>} onClick={() => navigate(-1)}>
                        Назад
                    </Button>
                </Container>
            </Box>
            <form>
                <Card sx={{m: 3}}>
                    <CardHeader
                        title="Создание email шаблона"
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
                <Box sx={{mx: 3, mt: 1, mb: 3}}>
                    <EmailTemplateAlert status={alert.status} message={alert.message}
                                        onClose={() => setAlert({status: '', message: ''})}/>
                </Box>
                <Box sx={{m: 3, flex: 1}}>
                    <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button color="primary" variant="outlined" onClick={() => navigate(-1)}>
                            Cancel
                        </Button>

                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <CircularProgress style={{marginRight: '16px', display: showLoader ? 'block' : 'none'}}/>
                            <Button color="primary" variant="contained" onClick={create} disabled={submitDisabled}>
                                Create
                            </Button>
                        </Box>
                    </Box>
                    <Box sx={{mt: 3}}>
                        <Card>
                            <CardContent>
                                <EmailEditor ref={emailEditorRef} minHeight="75vh"/>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            </form>
        </>
    );
};

export default EmailTemplateCreate;
