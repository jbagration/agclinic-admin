import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  Button,
  Card,
  CardHeader,
  Divider,
  CardContent,
  CircularProgress,
  TextField,
  Alert,
  Grid
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import { useParams, useNavigate } from 'react-router-dom';
import UserFormEdit from '../../components/Users/UserFormEdit';
import { useGet, usePut } from '../../API/request';
import { BallTriangle } from 'react-loader-spinner';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import '../../styles/Avatar/style.css';

const ConfigurationKeysEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const getU = useGet();
  const putU = usePut();

  const [isLoaded, setIsLoaded] = useState(true);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [nothingChanged, setNothingChanged] = useState(true);

  const [values, setValues] = useState({
    name: '',
    key: ''
  });
  const [errors, setErrors] = useState({
    name: false,
    key: false
  });

  const [alert, setAlert] = useState({
    txt: '',
    isVisible: false,
    type: 'error'
  });

  const handleChange = (event) => {
    setNothingChanged(false);

    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
    setErrors({
      ...errors,
      [event.target.name]: false
    });
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
    }, 2500);
  };

  const validateInfo = () => {
    let validComplete = true;
    let formErrors = { ...errors };

    if (values.name === '') {
      validComplete = false;
      formErrors.role = false;
      showAlert('error', 'Поле Name не должно быть пустым');
    }

    setErrors(formErrors);
    return validComplete;
  };

  const submitInfo = async () => {
    if (nothingChanged) {
      showAlert('error', 'Нет изменений');
      return;
    }

    if (validateInfo()) {
      setSubmitDisabled(true);

      const data = {
        name: values.name,
        key: values.key
      };

      putU(`configuration/keys/${id}`, data)
        .then((resp) => {
          if (resp.status === 'success') {
            showAlert('success', 'Данные успешно обновленны');
          } else {
            showAlert('error', 'Ошибка');
          }
        })
        .catch((err) => {
          showAlert('error', 'Ошибка сервера');
        })
        .finally(() => {
          setSubmitDisabled(false);
        });
    }
  };

  useEffect(() => {
    setIsLoaded(true);
    getU(`configuration/keys/${id}`)
      .then((resp) => {
        if (resp.status === 'success') {
          const data = {
            key: resp.data.configurationKey.key,
            name: resp.data.configurationKey.name
          };

          setValues(data);
        }
      })
      .catch(() => {
        showAlert(
          'error',
          'Произошла ошибка при загрузке ключа, попробуйте перезайти'
        );
      })
      .finally(() => {
        setIsLoaded(false);
      });
  }, []);

  if (isLoaded) {
    return (
      <div className="loader">
        <BallTriangle
          height="100"
          width="100"
          color="grey"
          ariaLabel="loading"
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit configuration key</title>
      </Helmet>
      <Box className="headerWrapper">
        <Box className="headerTitle">
          <Button startIcon={<ChevronLeft />} onClick={() => navigate(-1)}>
            Назад
          </Button>
          Конфигуратор ключей
        </Box>
        <ul className="headerList">
          <li onClick={() => navigate(-1)}>Конфигуратор ключей</li>
          <li>/</li>
          <li>Редактирование</li>
        </ul>
      </Box>

      <Box sx={{ backgroundColor: 'background.default', pt: 3 }}>
        <Container maxWidth={false}>
          <Box>
            <form>
              <Card>
                <CardHeader title="Редактирование конфигурационного ключа" />
                <Divider />
                <CardContent sx={{ position: 'relative' }}>
                  <TextField
                    fullWidth
                    label="Name"
                    margin="normal"
                    name="name"
                    onChange={handleChange}
                    type="text"
                    value={values.name}
                    variant="outlined"
                    error={errors.name}
                  />
                  <TextField
                    fullWidth
                    label="Key"
                    margin="normal"
                    name="key"
                    onChange={handleChange}
                    type="text"
                    value={values.key}
                    variant="outlined"
                    error={errors.key}
                  />
                </CardContent>
                <Divider />
                <Alert
                  severity={alert.type}
                  style={{ display: alert.isVisible ? 'flex' : 'none' }}
                >
                  {alert.txt}
                </Alert>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={submitInfo}
                    disabled={submitDisabled}
                  >
                    Сохранить
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

export default ConfigurationKeysEdit;
