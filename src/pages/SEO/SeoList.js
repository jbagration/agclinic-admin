import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Avatar,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TableFooter,
  TablePagination,
  TextField,
  Divider,
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useConfirm } from '../../components/Confirm/index';
import { BallTriangle } from 'react-loader-spinner';
import { useGet, useDelete } from '../../API/request';
import UserListSkelet from '../../skeletons/UserListSkelet';
import '../../styles/All.css';

const SeoList = () => {
  const confirm = useConfirm();
  const getU = useGet();
  const deleteU = useDelete();

  const [isLoaded, setIsLoaded] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [seo, setSeo] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);

  const loadSeo = () => {
    setIsDataLoading(true);
    setIsLoaded(true);

    let endpoint = `seo?page=${page + 1}&limit=${limit}`;

    getU(endpoint)
      .then((resp) => {
        if (resp.status === 'success') {
          setSeo(resp.data.seo);
          setCount(resp.data.totalCount || 0);
        }
        setIsDataLoading(false);
      })
      .catch((err) => {
        console.log(err.response);
        setSeo([]);
        setIsDataLoading(false);
      })
      .finally(() => {
        setIsLoaded(false);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeLimit = (event) => {
    setLimit(event.target.value);
    setPage(0);
  };

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

  const onDelete = (id) => {
    confirm({
      title: 'Удаление',
      content: 'Вы уверены, что хотите удалить SEO?',
      onConfirm: () => {
        deleteU(`seo/${id}`)
          .then((resp) => {
            loadSeo();
          })
          .catch((e) => {
            console.log(e.response);
          });
      },
    });
  };

  useEffect(() => {
    loadSeo();
  }, [page, limit]);

  if (isLoaded) {
    return (
      <div className="loader">
        <BallTriangle height="100" width="100" color="grey" ariaLabel="loading" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>SEO</title>
      </Helmet>
      <Box className="headerWrapper">
        <Box className="headerTitle">SEO</Box>
      </Box>
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100%', py: 3 }}>
        <Container maxWidth={false}>
          {isDataLoading ? (
            <UserListSkelet />
          ) : (
            <>
              <Box sx={{ pt: 3 }}>
                <Card>
                  <PerfectScrollbar>
                    <Box>
                      <Divider />
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ width: 80 }}>Id</TableCell>
                            <TableCell>Логотип</TableCell>
                            <TableCell>Заголовок</TableCell>
                            <TableCell>Параметр</TableCell>
                            <TableCell>Описание</TableCell>
                            <TableCell>Дата создания</TableCell>
                            <TableCell>Дата обновления</TableCell>
                            <TableCell>Действия</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {seo?.map((item) => (
                            <TableRow hover key={item.id}>
                              <TableCell sx={{ width: 80 }}>{item?.id}</TableCell>
                              <TableCell>
                                <Box sx={{ alignItems: 'center', display: 'flex' }}>
                                  <Avatar
                                    src={
                                      item.img
                                        ? `${process.env.REACT_APP_API_URL}public/uploads/images/${item.img}`
                                        : ''
                                    }
                                  />
                                </Box>
                              </TableCell>
                              <TableCell>{item?.name || '---'}</TableCell>
                              <TableCell>{item?.param || '---'}</TableCell>
                              <TableCell>{item?.description || '---'}</TableCell>
                              <TableCell>
                                {formattedDateTime(item?.date_create) || '---'}
                              </TableCell>
                              <TableCell>
                                {formattedDateTime(item?.date_update) || '---'}
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex' }}>
                                  <Box sx={{ display: 'flex' }}>
                                    <Box sx={{ ml: 2 }}>
                                      <Link to={`/app/seo/edit/${item.id}`}>
                                        <Button color="primary" variant="contained">
                                          Редакт.
                                        </Button>
                                      </Link>
                                    </Box>
                                    <Box sx={{ ml: 2 }}>
                                      <Button
                                        color="error"
                                        variant="contained"
                                        onClick={(e) => e && onDelete(item.id)}
                                      >
                                        Удалить
                                      </Button>
                                    </Box>
                                  </Box>
                                  {/* Добавление ссылки для редактирования SEO по URL */}
                                  <Box sx={{ ml: 2 }}>
                                    <Link to={`/app/seo/url/${item.id}`}>
                                      <Button color="primary" variant="contained">
                                        URL
                                      </Button>
                                    </Link>
                                  </Box>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TablePagination
                              labelRowsPerPage={
                                <span>Кол-во строк на странице:</span>
                              }
                              rowsPerPageOptions={[10, 20, 30, 40, 50]}
                              colSpan={8}
                              count={count}
                              rowsPerPage={limit}
                              page={page}
                              onPageChange={handleChangePage}
                              onRowsPerPageChange={handleChangeLimit}
                            />
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </Box>
                  </PerfectScrollbar>
                </Card>
              </Box>
            </>
          )}
        </Container>
      </Box>
    </>
  );
};

export default SeoList;
