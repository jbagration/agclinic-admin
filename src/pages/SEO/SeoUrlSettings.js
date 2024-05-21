import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Typography, Button, TextField, Breadcrumbs } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useGet, usePost, usePut, useDelete } from '../../API/request';
import { useConfirm } from '../../components/Confirm/index';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import ChevronLeft from '@material-ui/icons/ChevronLeft';

const SeoUrlSettings = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const confirm = useConfirm();
  const getU = useGet();
  const postU = usePost();
  const putU = usePut();
  const deleteU = useDelete();

  const [seoUrl, setSeoUrl] = useState({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    getSeoUrl();
  }, []);

  const getSeoUrl = () => {
    getU(`seo/url/${id}`)
      .then((resp) => {
        if (resp.status === 'success') {
          setSeoUrl(resp.data);
          setTitle(resp.data.title || '');
          setDescription(resp.data.description || '');
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newData = {
      ...seoUrl,
      title,
      description,
    };

    if (id) {
      putU(`seo/url/${id}`, newData)
        .then((resp) => {
          if (resp.status === 'success') {
          }
        })
        .catch((err) => {
          console.log(err.response);
        });
    } else {
      postU('seo/url', newData)
        .then((resp) => {
          if (resp.status === 'success') {
          }
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  };

  const handleDelete = () => {
    confirm({
      title: 'Удаление',
      content: 'Вы уверены, что хотите удалить настройки SEO для этого URL?',
      onConfirm: () => {
        deleteU(`seo/url/${id}`)
          .then((resp) => {
            if (resp.status === 'success') {
            }
          })
          .catch((err) => {
            console.log(err.response);
          });
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>SEO URL Настройки</title>
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
      <Container>
        <Box my={2}>
          <Typography variant="h4" component="h1" gutterBottom>
            {id ? 'Отредактировать SEO URL настройки' : 'Добавить SEO URL настройки'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                fullWidth
                label="Title"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Box>
            <Box mb={2}>
              <TextField
                fullWidth
                label="Description"
                variant="outlined"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Box>
            <Button type="submit" variant="contained" color="primary" style={{ marginRight: '10px' }}>
  Сохранить
</Button>
            {id && (
              <Button
                variant="contained"
                color="error"
                onClick={handleDelete}
              >
                Удалить
              </Button>
            )}
          </form>
        </Box>
      </Container>
    </>
  );
};

export default SeoUrlSettings;
