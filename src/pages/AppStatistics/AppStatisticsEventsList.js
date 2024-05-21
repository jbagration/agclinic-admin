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
  Divider
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import UserListSkelet from '../../skeletons/UserListSkelet';
import { useDelete, useGet } from '../../API/request';
import { useConfirm } from '../../components/Confirm';
import { BallTriangle } from 'react-loader-spinner';
import moment from 'moment';

const AppStatisticsEventsList = () => {
  const getU = useGet();
  const deleteU = useDelete();
  const confirm = useConfirm();

  const [isLoaded, setIsLoaded] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const [events, setEvents] = useState([]);

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);

  const loadData = () => {
    setIsDataLoading(true);
    setIsLoaded(true);

    let endpoint = `statistics/events?page=${page + 1}&limit=${limit}`;

    getU(endpoint)
      .then((resp) => {
        console.log(resp);
        if (resp.status === 'success') {
          setEvents(resp.data.events);
          setCount(resp.data.currentCount || 0);
        }
      })
      .catch((err) => {
        console.log(err.response);
        setEvents([]);
        setCount(0);
      })
      .finally(() => {
        setIsLoaded(false);
        setIsDataLoading(false);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeLimit = (event) => {
    setLimit(event.target.value);
    setPage(0);
  };

  const deleteEvent = (id) => {
    confirm({
      title: 'Удаление события',
      content: 'Вы уверены, что хотите удалить событие?',
      onConfirm: () => {
        deleteU(`statistics/events/${id}`)
          .then((resp) => {
            if (resp.status === 'success') {
              loadData();
            }
          })
          .catch((e) => {
            console.log(e.response);
          });
      }
    });
  };

  useEffect(() => {
    loadData();
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
        <title>События</title>
      </Helmet>

      <Box className="headerWrapper">
        <Box className="headerTitle">События</Box>
      </Box>
      <Box
        sx={{ backgroundColor: 'background.default', minHeight: '90%', py: 3 }}
      >
        <Container maxWidth={false}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="/app/app-statistics/events/add">
              <Button color="primary" variant="contained">
                Добавить событие
              </Button>
            </Link>
          </Box>

          <Box sx={{ pt: 3 }}>
            <Card>
              <PerfectScrollbar>
                <Box sx={{ minWidth: 750 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Название</TableCell>
                        <TableCell>Важное?</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {events.map((event) => (
                        <TableRow hover key={event.id}>
                          <TableCell>{event.id || '---'}</TableCell>
                          <TableCell>{event.name || '---'}</TableCell>
                          <TableCell>
                            {event.isImportant ? 'Да' : 'Нет'}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex' }}>
                              <Box sx={{ display: 'flex' }}>
                                <Link
                                  to={`/app/app-statistics/events/edit/${event.id}`}
                                >
                                  <Button color="primary" variant="contained">
                                    Редакт.
                                  </Button>
                                </Link>
                                <Box sx={{ ml: 2 }}>
                                  <Button color="error" variant="contained"
                                  onClick={() => deleteEvent(event.id)}>
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
        </Container>
      </Box>
    </>
  );
};

export default AppStatisticsEventsList;
