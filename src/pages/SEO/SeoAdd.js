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

const SeoAdd = () => {
  const navigate = useNavigate();
  const postU = usePost();

  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [uploadedImg, setUploadedImg] = useState('/static/images/defphoto.jpg');

  const [values, setValues] = useState({
    name: '',
    param: '',
    img: '',
    description: ''
  });

  const [errors, setErrors] = useState({
    name: false,
    param: false,
    img: false,
    description: false,
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
      { field: 'name', errorMessage: 'Введите имя' },
      { field: 'param', errorMessage: 'Введите параметр' },
      { field: 'img', errorMessage: 'Добавьте логотип' },
      { field: 'description', errorMessage: 'Добавьте описание' },
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
        name: '',
        param: '',
        img: '',
        description: ''
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
      Data.append ('name', values.name);
      Data.append('param', values.param);
      Data.append('img', values.img)
      Data.append('description', values.description)

      postU('seo', Data)
        .then((resp) => {
          if (resp.status === 'success') {
            showAlert('success', 'SEO добавлен');
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
        <title>Добавить SEO</title>
      </Helmet>
      <Box sx={{pt: 2}}>
        <Container maxWidth={false}>
          <Button startIcon={<ChevronLeft/>} onClick={() => navigate(-1)}>
            Назад
          </Button>
          <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 14 }}>
            <RouterLink underline="hover" color="inherit" to="/app/seo">
                SEO
            </RouterLink>
                <p>Добавить SEO</p>
          </Breadcrumbs>
        </Container>
      </Box>
      <Box sx={{backgroundColor: 'background.default', minHeight: '100%'}}>
        <Container maxWidth={false}>
          <Box sx={{pt: 2}}>
            <form>
              <Card>
                <CardHeader title="Добавление SEO"/>
                <Divider/>
                <CardContent sx={{position: 'relative'}}>
                  <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                    <TextField
                      sx={{mr: 3, width: '70%'}}
                      label="Имя"
                      fullWidth
                      margin="normal"
                      name="name"
                      onChange={handleChange}
                      type="text"
                      value={values.name}
                      variant="outlined"
                      error={errors.name}
                    />
                    <TextField
                      sx={{mr: 3, width: '70%'}}
                      label="Параметр"
                      fullWidth
                      margin="normal"
                      name="param"
                      onChange={handleChange}
                      type="text"
                      value={values.param}
                      variant="outlined"
                      error={errors.param}
                    />
                    <TextField
                        sx={{mr: 3, width: '70%'}}
                        fullWidth
                        label="Описание"
                        margin="normal"
                        name="description"
                        onChange={handleChange}
                        type="text"
                        value={values.description}
                        variant="outlined"
                        multiline
                        rows={4}
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
                    disabled
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

export default SeoAdd;
