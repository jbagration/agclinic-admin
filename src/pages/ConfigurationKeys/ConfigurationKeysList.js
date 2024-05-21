import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
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
  Divider
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import UserListSkelet from '../../skeletons/UserListSkelet';
import { useDelete, useGet } from '../../API/request';
import { useConfirm } from '../../components/Confirm/index';
import { BallTriangle } from 'react-loader-spinner';
import '../../styles/All.css';

const ConfigurationKeysList = () => {
  const confirm = useConfirm();
  const getU = useGet();
  const deleteU = useDelete();

  const [isLoaded, setIsLoaded] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [keys, setKeys] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);

  const loadKeys = () => {
    setIsDataLoading(true);
    setIsLoaded(true);

    let endpoint = `configuration/keys/?page=${page + 1}&limit=${limit}`;

    getU(endpoint)
      .then((resp) => {
        if (resp.status === 'success') {
          setKeys(resp.data.configurationKeys);
          setCount(resp.data.currentCount || 0);
        }
        setIsDataLoading(false);
      })
      .catch((err) => {
        console.log(err.response);
        setKeys([]);
        setCount(0);
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

  const onDelete = (id) => {
    confirm({
      title: 'Удаление',
      content: 'Вы уверены, что хотите удалить ключ?',
      onConfirm: () => {
        deleteU(`configuration/keys/${id}`)
          .then((resp) => {
            if (resp.status === 'success') {
              loadKeys();
            }
          })
          .catch((e) => {
            // console.log("opened")
            // console.log(e.response)
          });
      }
    });
  };

  useEffect(() => {
    loadKeys();
  }, [page, limit]);

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
        <title>Configuration keys</title>
      </Helmet>
      <Box className="headerWrapper">
        <Box className="headerTitle">Конфигуратор ключей</Box>
      </Box>
      <Box
        sx={{ backgroundColor: 'background.default', minHeight: '100%', py: 3 }}
      >
        <Container maxWidth={false}>
          {isDataLoading ? (
            <UserListSkelet />
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Box sx={{ marginLeft: 2 }}>
                  <Link to="/app/configuration/keys/add">
                    <Button color="primary" variant="contained">
                      Добавить ключ
                    </Button>
                  </Link>
                </Box>
              </Box>
              <Box sx={{ pt: 3 }}>
                <Card>
                  <PerfectScrollbar>
                    <Box sx={{ minWidth: 400 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ width: 80 }}>Id</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Key</TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {keys?.map((key) => (
                            <TableRow hover key={key.id}>
                              <TableCell sx={{ width: 80 }}>
                                {key?.id}
                              </TableCell>
                              <TableCell>{key?.name || '---'}</TableCell>
                              <TableCell>{key?.key || '---'}</TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex' }}>
                                  <Box sx={{ display: 'flex' }}>
                                    <Box sx={{ ml: 2 }}>
                                      <Link
                                        to={`/app/configuration/keys/edit/${key.id}`}
                                      >
                                        <Button
                                          color="primary"
                                          variant="contained"
                                        >
                                          Редакт.
                                        </Button>
                                      </Link>
                                    </Box>
                                    <Box sx={{ ml: 2 }}>
                                      <Button
                                        color="error"
                                        variant="contained"
                                        onClick={() => onDelete(key.id)}
                                      >
                                        Удалить
                                      </Button>
                                    </Box>
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
                              colSpan={7}
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

export default ConfigurationKeysList;
