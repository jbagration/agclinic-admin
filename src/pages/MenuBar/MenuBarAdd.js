import {Helmet} from 'react-helmet';
import {
  Box,
  Container,
  Button,
  TextField,
  CardContent,
  Checkbox,
  Typography,
  TableBody,
  TableHead,
  Table,
  Breadcrumbs,
  Grid,
  TableRow,
  TableCell
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import {Link as RouterLink, useParams, useNavigate} from 'react-router-dom';
import {
  useGet,
  usePost,
} from '../../API/request';
import React, {useEffect, useState} from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import Alert from '@material-ui/core/Alert';

const MenuBarAdd = () => {
  const navigate = useNavigate();
  const postU = usePost();
  const getU = useGet();
  const [cities, setCities] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedCitiesData, setSelectedCitiesData] = useState([]);
  const [formattedData, setFormattedData] = useState([]);
  const [orderErrors, setOrderErrors] = useState({});

  const [submitDisabled, setSubmitDisabled] = useState(false);

  const [values, setValues] = useState({
    name: '',
    path: '',
  });
  const [errors, setErrors] = useState({
    name: false,
    path: false,
  });

  const [alert, setAlert] = useState({
    txt: '',
    isVisible: false,
    type: 'error'
  });

  const handleChange = (event, cityId) => {
    if (event.target.name.startsWith('order-')) {
      const newCityOrders = { ...values, [event.target.name]: event.target.value };
      setValues(newCityOrders);

      // Проверка значения поля order при изменении
      const newOrderErrors = { ...orderErrors };
      if (selectedCities.includes(cityId) && !event.target.value) {
        newOrderErrors[cityId] = true;
      } else {
        delete newOrderErrors[cityId];
      }
      setOrderErrors(newOrderErrors);
    } else {
      setValues({
        ...values,
        [event.target.name]: event.target.value
      });
      setErrors({
        ...errors,
        [event.target.name]: false
      });
    }
  };

  const handleOrderChange = (event, cityId) => {
    const newCityOrders = { ...values, [event.target.name]: event.target.value };
    setValues(newCityOrders);

    // Проверка значения поля order при изменении
    const newOrderErrors = { ...orderErrors };
    if (selectedCities.includes(cityId) && !event.target.value) {
      newOrderErrors[cityId] = true;
    } else {
      delete newOrderErrors[cityId];
    }
    setOrderErrors(newOrderErrors);
  };

  const handleCityCheckboxChange = (cityId) => {
    const updatedSelectedCities = selectedCities.includes(cityId)
      ? selectedCities.filter((id) => id !== cityId)
      : [...selectedCities, cityId];

    setSelectedCities(updatedSelectedCities);

    const updatedSelectedCitiesData = updatedSelectedCities.map((id) => {
      return { id: id, order: values[`order-${id}`] || '' };
    });

    setSelectedCitiesData(updatedSelectedCitiesData);

    const Data = updatedSelectedCitiesData.map((data) => {
      return { id: data.id, order: data.order };
    });

    setFormattedData(Data);

    // Проверка значения поля order при включенном чекбоксе
    const newOrderErrors = { ...orderErrors };
    if (updatedSelectedCities.includes(cityId) && !values[`order-${cityId}`]) {
      newOrderErrors[cityId] = true;
    } else {
      delete newOrderErrors[cityId];
    }
    setOrderErrors(newOrderErrors);
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
    let formErrors = {...errors};

    if (values.name === '') {
      validComplete = false;
      formErrors.name = false;
      showAlert('error', 'Название пункта меню не должно быть пустым');
    }

    if (values.path === '') {
      validComplete = false;
      formErrors.path = false;
      showAlert('error', 'Введите путь');
    }
    setErrors(formErrors);
    return validComplete;
  };

  const clearForm = () => {
    setValues({
      name: '',
      path: '',
    });
  };

  const loadCities = () => {
    getU('city')
      .then((resp) => {
        if (resp.status === 'success') {
          setCities(resp.data.city);
          setSelectedCities([]);
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const submit = async () => {
    if (validate()) {
      setSubmitDisabled(true);

      const updatedData = selectedCitiesData.map((data) => {
        return { id: data.id, order: values[`order-${data.id}`] || '' };
      });

      const Data = {
        "name": values.name,
        "city_id": updatedData,
        "path": values.path
      };

      postU('menu_bar', Data)
        .then((resp) => {
          if (resp.status === 'success') {
            showAlert('success', 'Пункт меню добавлен');
            clearForm();
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
    loadCities();
  }, []);

  useEffect(() => {
    // Инициализация значений порядка городов
    const initialCityOrders = {};
    cities.forEach((city) => {
      initialCityOrders[city.id] = '';
    });
    setValues({ ...values, ...initialCityOrders });
  }, []);

  return (
    <>
      <Helmet>
        <title>Добавление пункта меню</title>
      </Helmet>
      <Box sx={{pt: 2}}>
        <Container maxWidth={false}>
          <Button startIcon={<ChevronLeft/>} onClick={() => navigate(-1)}>
            Назад
          </Button>
          <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 14 }}>
            <RouterLink underline="hover" color="inherit" to="/app/menu-bar">
                Пункты меню
            </RouterLink>
                <p>Добавить пункт меню</p>
          </Breadcrumbs>
        </Container>
      </Box>
      <Box sx={{backgroundColor: 'background.default', minHeight: '100%'}}>
        <Container maxWidth={false}>
          <Box sx={{pt: 2}}>
            <form>
              <Card>
                <CardHeader title="Добавление пункта меню"/>
                <Divider/>
                <CardContent sx={{position: 'relative'}}>
                  <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                    <TextField
                      sx={{mr: 3, width: '70%'}}
                      label="Название пункта меню"
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
                      label="Укажите ссылку (/url)"
                      fullWidth
                      margin="normal"
                      name="path"
                      onChange={handleChange}
                      type="text"
                      value={values.path}
                      variant="outlined"
                      error={errors.path}
                    />
                  </Box>
                  <CardContent sx={{ position: 'relative' }}>
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                      <Table sx={{ width: '50%' }}>
                        <TableHead>
                          <TableRow>
                            <TableCell align="center"  colSpan={2}>
                              <Typography variant="h6" align="center" gutterBottom >
                                Выберите город
                              </Typography>
                            </TableCell>
                            <TableCell align="center" sx={{ width: '25%' }} colSpan={1}>
                              <Typography variant="h6" align="center" gutterBottom>
                                Введите позицию
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                        {cities.map((city) => (
                          <TableRow key={city.id}>
                            <TableCell align="center" sx={{ width: '5%' }}>
                              <Checkbox
                                checked={selectedCities.includes(city.id)}
                                onChange={() => handleCityCheckboxChange(city.id)}
                              />
                            </TableCell>
                            <TableCell align="center" sx={{ width: '20%' }}>
                              <Typography>{city.name}</Typography>
                            </TableCell>
                            <TableCell align="center" sx={{ width: '25%' }}>
                              <Grid container alignItems="center" spacing={1}>
                                <Grid item xs={12} sm={8}>
                                  <TextField
                                    sx={{ width: '100%' }}
                                    label="Позиция"
                                    fullWidth
                                    margin="normal"
                                    name={`order-${city.id}`}
                                    onChange={(event) => handleOrderChange(event, city.id)}
                                    type="text"
                                    disabled={!selectedCities.includes(city.id)}
                                    value={values[`order-${city.id}`] || ''}
                                    variant="outlined"
                                    error={errors[`order-${city.id}`] || orderErrors[city.id]}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  {orderErrors[city.id] && (
                                    <Typography variant="caption" color="error" align="right">
                                      Введите позицию для этого города.
                                    </Typography>
                                  )}
                                </Grid>
                              </Grid>
                            </TableCell>
                          </TableRow>
                        ))}
                        </TableBody>
                      </Table>
                    </Box>
                  </CardContent>

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

export default MenuBarAdd;
