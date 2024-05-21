import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import {
  Box,
  Avatar,
  Container,
  Button,
  Card,
  CardContent,
  Breadcrumbs,
  Divider,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
  Typography,
  CardMedia,
  CardHeader,
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useGet, usePut } from '../../API/request';
import '../../styles/All.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { BallTriangle } from 'react-loader-spinner';

const CommentsInfo = () => {
  const navigate = useNavigate();
  const getU = useGet();
  const putU = usePut();
  const { id } = useParams();

  const [isLoaded, setIsLoaded] = useState(true);
  const [cities, setCities] = useState([]);
  const [value, setValue] = useState({});

  const formattedDateTime = (createdAt) => {
    if (createdAt === null) {
      return '';
    }

    const dateObj = new Date(createdAt);
    return dateObj.toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const toggleStatus = (status) => {
    const updatedStatus = status ? false : true;
    const requestBody = {
      status: updatedStatus,
    };

    putU(`reviews/${id}`, requestBody)
      .then((resp) => {
        if (resp.status === 'success') {
          setValue((prevState) => ({
            ...prevState,
            status: updatedStatus,
          }));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setIsLoaded(true);
    getU(`city`)
      .then((resp) => {
        if (resp.status === 'success') {
          setCities(resp.data.city);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    getU(`reviews/${id}`)
      .then((resp) => {
        if (resp.status === 'success') {
          setValue(resp.data.reviews);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoaded(false);
      });
  }, []);

  if (isLoaded) {
    return (
      <div className="loader">
        <BallTriangle height="100" width="100" color="grey" ariaLabel="loading" />
      </div>
    );
  }

  const statusText = value?.status ? 'Отображается' : 'Не отображается';
  const statusColor = value?.status ? 'green' : 'red';
  const statusIcon = value?.status ? '✔️' : '❌';

  return (
    <>
      <Helmet>
        <title>Комментарий</title>
      </Helmet>
      <Container maxWidth={false}>
        <Box>
          <Button startIcon={<ChevronLeft />} onClick={() => navigate(-1)}>
            Назад
          </Button>
        </Box>
        <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 14, justifyContent: 'flex-start' }}>
          <Link underline="hover" color="inherit" to="/app/comments">
            Комментарии
          </Link>
          <p>{value?.name || 'Комментарий'}</p>
        </Breadcrumbs>
      </Container>
      <Box sx={{ backgroundColor: 'background.default', pt: 3, pb: 1 }}>
        <Container maxWidth={false}>
          <Card>
            <CardContent sx={{ p: 3 }}>
            <PerfectScrollbar>
                <div className="wrapAvatar">
                    <div className="avatar-block" style={{ marginRight: '10px' }}>
                    <Avatar src={`${process.env.REACT_APP_API_URL}public/uploads/images/${value.img}`} className="avatar" />
                    </div>
                    <div className="info-block">
                      <div className="wrap">
                          <div className="label" style={{ width: '200px' }}>
                          ID:
                          </div>
                          <div className="text">{value?.id || '---'}</div>
                      </div>
                      <div className="wrap">
                          <div className="label" style={{ width: '200px' }}>
                          Имя:
                          </div>
                          <div className="text">{value?.name || '---'}</div>
                      </div>
                      <div className="wrap">
                          <div className="label" style={{ width: '200px' }}>
                          Город:
                          </div>
                          <div className="text">
                          {cities.find((city) => city.id === value?.city_id)?.name || '---'}
                          </div>
                      </div>
                      <div className="wrap">
                          <div className="label" style={{ width: '200px' }}>
                          Статус:
                          </div>
                          <div className="text" style={{ display: 'flex', alignItems: 'center', color: statusColor }}>
                          {statusIcon} {statusText}
                          </div>
                          <div className="button-wrap">
                          <Button
                              variant="contained"
                              sx={{marginLeft: '30px'}}
                              color={value?.status ? 'secondary' : 'primary'}
                              onClick={() => toggleStatus(value?.status)}
                          >
                              {value?.status ? 'Не отображать' : 'Отобразить'}
                          </Button>
                          </div>
                      </div>
                      <div className="wrap">
                          <div className="label" style={{ width: '200px' }}>
                            Дата создания:
                          </div>
                          <div className="text">
                            {formattedDateTime(value?.date_create) || '---'}
                          </div>
                      </div>
                    </div>
                </div>
                </PerfectScrollbar>
              <Divider sx={{ my: 2 }} />
            </CardContent>
          </Card>
          <Card sx={{marginTop: '10px'}}>
            <CardHeader title="Комментарий" />
                <CardContent>
                    <div className="wrap">
                        <div className="text" dangerouslySetInnerHTML={{__html: value?.description || '---'}}>
                        </div>
                    </div>
                </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default CommentsInfo;