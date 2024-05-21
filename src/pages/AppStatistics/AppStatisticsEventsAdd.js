import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  Button,
  TextField,
  CardContent
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import { useNavigate } from 'react-router-dom';
import { useGet, usePost, usePut } from '../../API/request';
import React, { useEffect, useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import Alert from '@material-ui/core/Alert';

const AppStatisticsEventsAdd = () => {
  const navigate = useNavigate();
  const postU = usePost();
  const getU = useGet();
  const putU = usePut();

  const [values, setValues] = useState({
    name: '',
    isImportant: true
  });
  const [errors, setErrors] = useState({
    name: false,
    isImportant: false
  });

  const [isShowLoader, setIsShowLoader] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);

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

    if (values.role === '') {
      validComplete = false;
      formErrors.role = false;
      showAlert('error', 'Поле isImportant не должно быть пустым');
    }

    if (values.name === '') {
      validComplete = false;
      formErrors.username = false;
      showAlert('error', 'Поле Название не должно быть пустым');
    }

    setErrors(formErrors);
    return validComplete;
  };

  const clearForm = () => {
    setValues({
      name: '',
      isImportant: false,
    });
  };

  const submit = async () => {
    if (validate()) {
      setIsShowLoader(true);
      setSubmitDisabled(true);

      const data = {
        name: values.name,
        isImportant: values.isImportant,
      };

      postU('statistics/events', data)
        .then((resp) => {
          if (resp.status === 'success') {
            showAlert('success', 'Событие добавлено');
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
        .finally(() => {});
    }
  };

  return (
    <>
      <Helmet>
        <title>Добавление события</title>
      </Helmet>
      <Box sx={{ pt: 2 }}>
        <Container maxWidth={false}>
          <Button startIcon={<ChevronLeft />} onClick={() => navigate(-1)}>
            Back
          </Button>
        </Container>
      </Box>
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100%' }}>
        <Container maxWidth={false}>
          <Box sx={{ pt: 2 }}>
            <form>
              <Card>
                <CardHeader title="Добавление нового события" />
                <Divider />
                <CardContent sx={{ position: 'relative' }}>
                  <TextField
                    fullWidth
                    label="Название"
                    margin="normal"
                    name="name"
                    onChange={handleChange}
                    type="text"
                    value={values.name}
                    variant="outlined"
                    error={errors.name}
                  />
                  <FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
                    <InputLabel id="isImportant">
                      Это важное событие?
                    </InputLabel>
                    <Select
                      labelId="isImportant"
                      name="isImportant"
                      value={values.isImportant}
                      label="Это важное событие?"
                      onChange={handleChange}
                    >
                      <MenuItem value={true}>Да</MenuItem>
                      <MenuItem value={false}>Нет</MenuItem>
                    </Select>
                  </FormControl>

                  <Alert
                    severity={alert.type}
                    style={{ display: alert.isVisible ? 'flex' : 'none' }}
                  >
                    {alert.txt}
                  </Alert>
                </CardContent>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
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

export default AppStatisticsEventsAdd;
