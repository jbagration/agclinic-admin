import {Helmet} from 'react-helmet';
import {
  Box,
  Container,
  Button,
  TextField,
  CardContent,
  Checkbox,
  Typography,
  Breadcrumbs,
  Grid
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import {Link as RouterLink, useParams, useNavigate} from 'react-router-dom';
import {
  useGet,
  usePost,
  usePut
} from '../../API/request';
import React, {useEffect, useState} from 'react';
import {BallTriangle} from 'react-loader-spinner';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import Alert from '@material-ui/core/Alert';
import { IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

const SiteSettingsAdd = () => {
  const navigate = useNavigate();
  const postU = usePost();
  const getU = useGet();

  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [uploadedImg, setUploadedImg] = useState('/static/images/defphoto.jpg');
  const [cities, setCities] = useState([]);

  const [values, setValues] = useState({
    phone: [''],
    short_phone: [],
    address: '',
    schedule: '',
    start_schedule: '',
    end_schedule: '',
    logo: '',
    instagram_url: '',
    facebook_url: '',
    vk_url: '',
    youtube_url: '',
    city_id: ''
  });

  const [errors, setErrors] = useState({
    phone: false,
    short_phone: false,
    address: false,
    schedule: false,
    start_schedule: false,
    end_schedule: false,
    logo: false,
    instagram_url: false,
    facebook_url: false,
    vk_url: false,
    youtube_url: false,
  });

  const [alert, setAlert] = useState({
    txt: '',
    isVisible: false,
    type: 'error'
  });

  const addPhoneField = (fieldName) => {
    setValues((prevValues) => ({
      ...prevValues,
      [fieldName]: [...prevValues[fieldName], '']
    }));
  };

  const removePhoneField = (index) => {
    const updatedPhones = [...values.phone];
    updatedPhones.splice(index, 1);
    setValues((prevValues) => ({
      ...prevValues,
      phone: updatedPhones,
    }));

    const updatedErrors = { ...errors.phone };
    delete updatedErrors[index]; // Удалить поле ошибки для удаленного номера телефона
    setErrors((prevErrors) => ({
      ...prevErrors,
      phone: updatedErrors,
    }));
  };

  const removeShortPhoneField = (index) => {
    const updatedShortPhones = [...values.short_phone];
    updatedShortPhones.splice(index, 1);
    setValues((prevValues) => ({
      ...prevValues,
      short_phone: updatedShortPhones,
    }));

    const updatedErrors = { ...errors.phone };
    delete updatedErrors[index]; // Удалить поле ошибки для удаленного номера телефона
    setErrors((prevErrors) => ({
      ...prevErrors,
      phone: updatedErrors,
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'phone' || name === 'short_phone') {
      const index = event.target.getAttribute('data-index');
      const updatedList = [...values[name]];
      updatedList[index] = value;

      setValues((prevValues) => ({
        ...prevValues,
        [name]: updatedList
      }));
    } else {
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value
      }));
    }

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
      { field: 'phone', errorMessage: 'Введите номер телефона' },
      { field: 'address', errorMessage: 'Введите адрес' },
      { field: 'schedule', errorMessage: 'Введите рабочие дни' },
      { field: 'start_schedule', errorMessage: 'Введите время начала рабочего дня' },
      { field: 'end_schedule', errorMessage: 'Введите время окончания рабочего дня' },
      { field: 'img', errorMessage: 'Добавьте логотип' },
      { field: 'instagram_url', errorMessage: 'Введите ссылку на Instagram' },
      { field: 'facebook_url', errorMessage: 'Введите ссылку на Telegram' },
      { field: 'vk_url', errorMessage: 'Введите ссылку на VK' },
      { field: 'youtube_url', errorMessage: 'Введите ссылку на Youtube' },
    ];

    requiredFields.forEach(({ field, errorMessage }) => {
      if (values[field] === '') {
        validComplete = false;
        formErrors[field] = false;
        showAlert('error', errorMessage);
      }
    });

    // Валидация для поля "phone"
    const isValidPhone = values.phone.every(phone => /^[\d+]+$/.test(phone));
    if (!isValidPhone) {
      validComplete = false;
      formErrors.phone = false;
      showAlert('error', 'Некорректный номер телефона');
    }
    // Валидация для поля "short_phone"
    const isValidShortPhone = values.short_phone.every(phone => /^\d+$/.test(phone));
    if (!isValidShortPhone) {
      validComplete = false;
      formErrors.short_phone = false;
      showAlert('error', 'Некорректный короткий номер телефона');
    }

    setErrors(formErrors);
    return validComplete;
  };

  const loadCities = () => {
    getU('city')
        .then((resp) => {
            if (resp.status === 'success') {
                setCities(resp.data.city);
            }
        })
        .catch((err) => {
            console.log(err.response)
        })
};

  const clearForm = () => {
    setValues({
      phone: [''],
      short_phone: [''],
      address: '',
      schedule: '',
      start_schedule: '',
      end_schedule: '',
      logo: '',
      instagram_url: '',
      facebook_url: '',
      vk_url: '',
      youtube_url: '',
      city_id: ''
    });
  };

  const avaUploaded = (event) => {
    setUploadedImg(URL.createObjectURL(event.target.files[0]));
    setValues({
      ...values,
      logo: event.target.files[0]
    });
  };

  const submit = async () => {
    if (validate()) {
      setSubmitDisabled(true);

      const imageData = new FormData();

      imageData.append('img', values.logo);
      imageData.append('city_id', values.city_id);
      // Отфильтровать пустые значения из массива values.phone
      const filteredPhone = values.phone.filter(phone => phone.trim() !== '');
      if (filteredPhone.length > 0) {
        imageData.append('phone', filteredPhone);
      }
      // Отфильтровать пустые значения из массива values.short_phone
      const filteredShortPhone = values.short_phone.filter(phone => phone.trim() !== '');
      if (filteredShortPhone.length > 0) {
        imageData.append('short_phone', filteredShortPhone);
      }
      imageData.append ('address', values.address);
      imageData.append('schedule', values.schedule);
      imageData.append ('start_schedule', values.start_schedule);
      imageData.append ('end_schedule', values.end_schedule);
      imageData.append ('instagram_url', values.instagram_url);
      imageData.append ('facebook_url', values.facebook_url);
      imageData.append ('vk_url', values.vk_url);
      imageData.append ('youtube_url', values.youtube_url);

      postU('site_settings', imageData)
        .then((resp) => {
          if (resp.status === 'success') {
            showAlert('success', 'Клиника добавлена');
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

  useEffect(() => {
    loadCities();
  }, []);

  return (
    <>
      <Helmet>
        <title>Добавить клинику</title>
      </Helmet>
      <Box sx={{pt: 2}}>
        <Container maxWidth={false}>
          <Button startIcon={<ChevronLeft/>} onClick={() => navigate(-1)}>
            Назад
          </Button>
          <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 14 }}>
            <RouterLink underline="hover" color="inherit" to="/app/site-settings-cities">
                Выбрать город
            </RouterLink>
                <p>Добавить клинику</p>
          </Breadcrumbs>
        </Container>
      </Box>
      <Box sx={{backgroundColor: 'background.default', minHeight: '100%'}}>
        <Container maxWidth={false}>
          <Box sx={{pt: 2}}>
            <form>
              <Card>
                <CardHeader title="Добавление клиники"/>
                <Divider/>
                <CardContent sx={{position: 'relative'}}>
                  <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                    <FormControl sx={{ mr: 3, width: '70%' }}>
                      <InputLabel id="city">Выберите город</InputLabel>
                      <Select
                        labelId="city"
                        name="city_id"
                        value={values.city_id}
                        label="Выберите город"
                        onChange={handleChange}
                      >
                        {cities?.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {values.phone.map((phone, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                          key={index}
                          sx={{ mr: 3, width: 700 }}
                          label={`Телефон ${index + 1}`}
                          fullWidth
                          margin="normal"
                          name="phone"
                          onChange={handleChange}
                          type="text"
                          value={phone}
                          variant="outlined"
                          error={errors.phone[index]}
                          inputProps={{
                            'data-index': index // добавляем индекс в data-атрибут
                          }}
                        />
                        <IconButton
                          onClick={() => removePhoneField(index)}
                          style={{ color: 'red', marginLeft: '8px' }} // устанавливаем красный цвет и отступ слева
                        >
                          <Delete />
                        </IconButton>
                      </div>
                    ))}
                    <Button onClick={() => addPhoneField('phone')}>Добавить номер телефона</Button>
                    {values.short_phone.map((shortPhone, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                          key={index}
                          sx={{ mr: 3, width: 700 }}
                          label={`Короткий телефон ${index + 1}`}
                          fullWidth
                          margin="normal"
                          name="short_phone"
                          onChange={handleChange}
                          type="text"
                          value={shortPhone}
                          variant="outlined"
                          error={errors.short_phone[index]}
                          inputProps={{
                            'data-index': index // добавляем индекс в data-атрибут
                          }}
                        />
                        <IconButton
                          onClick={() => removeShortPhoneField(index)}
                          style={{ color: 'red', marginLeft: '8px' }} // устанавливаем красный цвет и отступ слева
                        >
                          <Delete />
                        </IconButton>
                      </div>
                    ))}
                    <Button onClick={() => addPhoneField('short_phone')}>Добавить короткий телефон</Button>
                    <TextField
                      sx={{mr: 3, width: '70%'}}
                      label="Адрес"
                      fullWidth
                      margin="normal"
                      name="address"
                      onChange={handleChange}
                      type="text"
                      value={values.address}
                      variant="outlined"
                      error={errors.address}
                    />
                    <TextField
                      sx={{mr: 3, width: '70%'}}
                      label="Рабочие дни"
                      fullWidth
                      margin="normal"
                      name="schedule"
                      onChange={handleChange}
                      type="text"
                      value={values.schedule}
                      variant="outlined"
                      error={errors.schedule}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Grid container spacing={2}>
                        <Grid item>
                        <h4>Начало рабочего дня</h4>
                          <TextField
                            sx={{ width: '230px' }}
                            margin="normal"
                            name="start_schedule"
                            type="time"
                            value={values.start_schedule || ''}
                            onChange={handleChange}
                            variant="outlined"
                            inputProps={{
                              step: 300,
                              inputMode: 'numeric',
                              pattern: '[0-9]{2}:[0-9]{2}',
                            }}
                          />
                        </Grid>
                        <Grid item>
                        <h4>Конец рабочего дня</h4>
                          <TextField
                            sx={{ width: '230px' }}
                            margin="normal"
                            name="end_schedule"
                            type="time"
                            value={values.end_schedule}
                            onChange={handleChange}
                            variant="outlined"
                            inputProps={{
                              step: 300,
                              inputMode: 'numeric',
                              pattern: '[0-9]{2}:[0-9]{2}',
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>
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
                    <CardHeader title="Социальные сети"/>
                        <TextField
                        sx={{mr: 3, width: '70%'}}
                        label="Instagram"
                        fullWidth
                        margin="normal"
                        name="instagram_url"
                        onChange={handleChange}
                        type="text"
                        value={values.instagram_url}
                        variant="outlined"
                        error={errors.instagram_url}
                        />
                        <TextField
                        sx={{mr: 3, width: '70%'}}
                        label="Telegram"
                        fullWidth
                        margin="normal"
                        name="facebook_url"
                        onChange={handleChange}
                        type="text"
                        value={values.facebook_url}
                        variant="outlined"
                        error={errors.facebook_url}
                        />
                        <TextField
                        sx={{mr: 3, width: '70%'}}
                        label="VK"
                        fullWidth
                        margin="normal"
                        name="vk_url"
                        onChange={handleChange}
                        type="text"
                        value={values.vk_url}
                        variant="outlined"
                        error={errors.vk_url}
                        />
                        <TextField
                        sx={{mr: 3, width: '70%'}}
                        label="Youtube"
                        fullWidth
                        margin="normal"
                        name="youtube_url"
                        onChange={handleChange}
                        type="text"
                        value={values.youtube_url}
                        variant="outlined"
                        error={errors.youtube_url}
                        />
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

export default SiteSettingsAdd;
