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
import {Link as RouterLink, useParams, useNavigate} from 'react-router-dom';
import {
  useGet,
  usePost,
  usePut
} from '../../API/request';
import React, {useEffect, useState} from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import Alert from '@material-ui/core/Alert';


const SeoEdit = () => {
  const navigate = useNavigate();
  const getU = useGet();
  const putU = usePut();

  const [submitDisabled, setSubmitDisabled] = useState(false);
  const { id } = useParams();
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

  const commonParams = {
    Город: "{{city}}",
    Адрес: "{{address}}",
    Телефон: "{{phone}}",
    "Короткий телефон": "{{short_phone}}",
    "График работы": "{{schedule}}"
  };

  const uniqueParams = {
    4: {
      Заголовок: "{{title}}",
      Описание: "{{description}}",
      Скидка: "{{discount}}"
    },
    6: {
      Заголовок: "{{title}}"
    },
    7: {
      Заголовок: "{{title}}",
      Описание: "{{description}}",
      Проблемы: "{{troubles}}"
    },
    10: {
      ФИО: "{{fio}}",
      Специализация: "{{specialization}}",
      Опыт: "{{experience}}",
      Описание: "{{description}}"
    },
    12: {
      Заголовок: "{{title}}",
      Описание: "{{description}}"
    },
    20: {
      "Название категории": "{{category_name}}"
    },
  };

  const params = {};

  for (let id = 1; id <= 22; id++) {
    params[id] = { ...commonParams };

    if (uniqueParams[id]) {
      params[id] = { ...params[id], ...uniqueParams[id] };
    }
  }

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

    // Проверка полей "Имя" и "Описание"
    const fieldsToValidate = ['name', 'description'];

    fieldsToValidate.forEach((field) => {
      const matches = values[field].match(/{{(.*?)}}/g);
      if (matches) {
        matches.forEach((match) => {

          const isParamNameInParams = Object.values(params[id]).includes(match);

          if (!isParamNameInParams) {
            // match отсутствует в значениях params[id]
            // Выполнить необходимые действия здесь
            validComplete = false;
            formErrors[field] = true;
            showAlert('error', `Недопустимый параметр "${match}" в поле "${field}"`);
          }
        });
      }
    });

    setErrors(formErrors);
    return validComplete;
  };

  const avaUploaded = (event) => {
    setUploadedImg(URL.createObjectURL(event.target.files[0]));
    setValues({
      ...values,
      img: event.target.files[0]
    });
  };

  const loadSeo = () => {
    getU(`seo/specific/${id}`)
      .then((resp) => {
        if (resp.status === 'success') {
          setValues(resp.data.seo);
          setUploadedImg(`${process.env.REACT_APP_API_URL}public/uploads/images/${resp.data.seo.img}`);
        }
      })
      .catch((e) => {
        console.log(e)
      })
      .finally(() => {

      });
  }

      const submit = async () => {
        if (validate()) {
          setSubmitDisabled(true);

          const Data = new FormData();
          Data.append ('name', values.name);
          Data.append('param', values.param);
          if (values.img instanceof File) {
            Data.append('img', values.img);
          }
          Data.append('description', values.description)

          putU(`seo/${id}`, Data)
            .then((resp) => {
              if (resp.status === 'success') {
                showAlert('success', 'SEO обновлён');
              } else {
                showAlert('error', 'Ошибка');
              }
            })
            .catch((err) => {
              showAlert('error', `Ошибка сервера: ${err.response.data.message}`);
              setSubmitDisabled(false);
            })
        }
      };

    useEffect(() => {
        loadSeo();
      }, []);

  return (
    <>
<Helmet>
        <title>Редактировать SEO</title>
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
                <p>Редактировать SEO</p>
          </Breadcrumbs>
        </Container>
      </Box>
      <Box sx={{backgroundColor: 'background.default', minHeight: '100%'}}>
        <Container maxWidth={false}>
          <Box sx={{pt: 2}}>
            <form>
              <Card>
                <CardHeader title="Редактирование SEO"/>
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
                      sx={{ mr: 3, width: '70%' }}
                      label="Параметр"
                      fullWidth
                      margin="normal"
                      name="param"
                      onChange={handleChange}
                      type="text"
                      value={values.param}
                      variant="outlined"
                      error={errors.param}
                      readOnly  // Add this line to make the field read-only
                      disabled
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
                    <div>
                      <h1 style={{ textAlign: 'center' }}>Список доступных параметров:</h1>
                      <table style={{ margin: '0 auto' }}>
                        <tbody>
                          {Object.entries(params[id]).map(([param, value]) => (
                            <tr key={param}>
                              <td style={{ textAlign: 'right' }}>{param}:</td>
                              <td style={{ textAlign: 'left' }}>{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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
                    Редактировать
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

export default SeoEdit;
