import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TableFooter,
  TablePagination,
  TextField
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useGet, usePut, useDelete } from "../../API/request";
import { useConfirm } from '../../components/Confirm/index';
import { Link, useSearchParams } from 'react-router-dom';
import { BallTriangle } from "react-loader-spinner";
import '../../styles/All.css'

const MenuBar = () => {
  const getU = useGet();
  const deleteU = useDelete();
  const confirm = useConfirm();

  const [isLoaded, setIsLoaded] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [menu, setMenu] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);

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
      minute: '2-digit'
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
};

const handleChangeLimit = (event) => {
    setLimit(event.target.value);
    setPage(0);
};

  const loadMenuBar = async () => {
    setIsDataLoading(true);

    let endpoint = `menu_bar?page=${page + 1}&limit=${limit}`;

    getU(endpoint)
    .then((resp) => {
        if (resp.status === 'success') {
            setMenu(resp.data.menu);
            setCount(resp.data.totalCount || 0);
        }
        setIsDataLoading(false);
    })
    .catch((err) => {
        console.log(err.response)
        setPartners([]);
        setIsDataLoading(false);
    })
    .finally(() => {
        setIsLoaded(false)
    });
};

  const onDelete = (id) => {
    confirm({
      title: 'Удаление',
      content: 'Вы уверены, что хотите удалить пункт меню?',
      onConfirm: () => {
        deleteU(`menu_bar/${id}`)
          .then((resp) => {
            loadMenuBar();
          })
          .catch((e) => {
            console.log(e.response);
          });
      }
    });
  };

  useEffect(() => {
    loadMenuBar();
  }, [page, limit]);

  if (isLoaded) {
    return (
      <div className="loader">
        <BallTriangle
          height="100"
          width="100"
          color='grey'
          ariaLabel='loading'
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Пункты меню</title>
      </Helmet>
      <Box className="headerWrapper">
        <Box className="headerTitle">
          Пункты меню
        </Box>
      </Box>
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100%', py: 3 }}>
        <Container maxWidth={false}>
          {isDataLoading ? (
            <div>Loading...</div>
          ) : (
            <Box sx={{ pt: 3, width: 1200, margin: '0 auto' }}>
              <Card>
                <PerfectScrollbar>
                  <Box>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ fontSize: '20px', justifyContent: 'center' }}>Пункты меню</TableCell>
                          <TableCell>Дата создания</TableCell>
                          <TableCell>Дата обновления</TableCell>
                          <TableCell colSpan={2}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <Box sx={{ marginLeft: 2 }}>
                                <Link to="/app/menu-bar-add">
                                  <Button sx={{ margin: 1 }} color="primary" variant="contained" >
                                    Добавить пункт меню
                                  </Button>
                                </Link>
                              </Box>
                            </Box>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {menu?.map((menuItem) => (
                          <TableRow hover key={menuItem.id}>
                            <TableCell>
                              {menuItem.name || '---'}
                            </TableCell>
                            <TableCell>
                              {formattedDateTime(menuItem.date_create) || '---'}
                            </TableCell>
                            <TableCell>
                              {formattedDateTime(menuItem.date_update) || '---'}
                            </TableCell>
                            <TableCell>
                              <Box sx={{ml: 2}}>
                                <Link
                                  to={`/app/menu-bar-edit/${menuItem.id}`}>
                                  <Button color="primary"
                                      variant="contained"
                                  >
                                    Редакт.
                                  </Button>
                                </Link>
                              </Box>
                            </TableCell>
                            <TableCell>
                                <Button
                                    color="error"
                                    variant="contained"
                                    onClick={(e) => e && onDelete(menuItem.id)}
                                >
                                    Удалить
                                </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                          <TableRow>
                              <TablePagination
                                  labelRowsPerPage={
                                      <span>Кол-во строк на странице:</span>}
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
          )}
        </Container>
      </Box>
    </>
  );
};

export default MenuBar;