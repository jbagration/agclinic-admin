import {Helmet} from 'react-helmet';
import {
  Box,
  Container,
  Button,
  TextField,
  CardContent,
  Breadcrumbs,
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {
  useGet,
  usePost,
} from '../../API/request';
import React, {useState} from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import Alert from '@material-ui/core/Alert';


const PartnerAdd = () => {
  const navigate = useNavigate();
  const postU = usePost();

  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [uploadedImg, setUploadedImg] = useState('/static/images/defphoto.jpg');

  const [values, setValues] = useState({
    title: '',
    link: '',
    img: '',
  });

  const [errors, setErrors] = useState({
    title: false,
    link: false,
    img: false,
  });

  const [alert, setAlert] = useState({
    txt: '',
    isVisible: false,
    type: 'error'
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((prevValues) => ({
    ...prevValues,
    [name]: value
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: false
    }));
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
    let validComplete = true;
    let formErrors = { ...errors };

    const requiredFields = [
      { field: 'title', errorMessage: 'Введите заголовок' },
      { field: 'link', errorMessage: 'Введите ссылку на партнёра' },
      { field: 'img', errorMessage: 'Добавьте логотип' },
    ];

    requiredFields.forEach(({ field, errorMessage }) => {
      if (values[field] === '') {
        validComplete = false;
        formErrors[field] = true;
        showAlert('error', errorMessage);
      }
    });

    setErrors(formErrors);
    return validComplete;
  };

  const clearForm = () => {
    setValues({
        title: '',
        link: '',
        img: '',
    });
  };

  const avaUploaded = (event) => {
    setUploadedImg(URL.createObjectURL(event.target.files[0]));
    setValues({
      ...values,
      img: event.target.files[0]
    });
  };

  const submit = async () => {
    if (validate()) {
      setSubmitDisabled(true);

      const Data = new FormData();
      Data.append ('title', values.title);
      Data.append('link', values.link);
      Data.append('img', values.img)

      postU('partners', Data)
        .then((resp) => {
          if (resp.status === 'success') {
            showAlert('success', 'Партнёр добавлен');
          } else {
            showAlert('error', 'Ошибка');
          }
        })
        .catch((err) => {
          showAlert('error', `Ошибка сервера: ${err.response.data.message}`);
          setSubmitDisabled(false);
        })
        .finally(() => {
          clearForm();
        });
    }
  };

  return (
    <>
      <Helmet>
        <title>Добавить партнёра</title>
      </Helmet>
      <Box sx={{pt: 2}}>
        <Container maxWidth={false}>
          <Button startIcon={<ChevronLeft/>} onClick={() => navigate(-1)}>
            Назад
          </Button>
          <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 14 }}>
            <RouterLink underline="hover" color="inherit" to="/app/partners">
                Партнёры
            </RouterLink>
                <p>Добавить Партнёра</p>
          </Breadcrumbs>
        </Container>
      </Box>
      <Box sx={{backgroundColor: 'background.default', minHeight: '100%'}}>
        <Container maxWidth={false}>
          <Box sx={{pt: 2}}>
            <form>
              <Card>
                <CardHeader title="Добавление партнёра"/>
                <Divider/>
                <CardContent sx={{position: 'relative'}}>
                  <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                    <TextField
                      sx={{mr: 3, width: '70%'}}
                      label="Заголовок"
                      fullWidth
                      margin="normal"
                      name="title"
                      onChange={handleChange}
                      type="text"
                      value={values.title}
                      variant="outlined"
                      error={errors.title}
                    />
                    <TextField
                      sx={{mr: 3, width: '70%'}}
                      label="Ссылка на партнёра"
                      fullWidth
                      margin="normal"
                      name="link"
                      onChange={handleChange}
                      type="text"
                      value={values.link}
                      variant="outlined"
                      error={errors.link}
                    />
                    <CardContent sx={{position: 'relative'}}>
                      <div className="itemWrapper">
                        <div className="container">
                          <input
                            accept="xlsx/*"
                            type="file"
                            style={{display: 'none'}}
                            id={1}
                            onChange={avaUploaded}
                          />
                          <label htmlFor={1}>
                            <img src={uploadedImg} className="itemImg"/>
                            <div className="middle"/>
                          </label>
                        </div>
                        <div className="help-text">
                          Доступны следующие расширения: .png .jpg .svg .bmp
                          .tga .webp
                        </div>
                      </div>
                    </CardContent>
                  </Box>
                  <Alert
                    severity={alert.type}
                    style={{display: alert.isVisible ? 'flex' : 'none'}}
                  >
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

export default PartnerAdd;
