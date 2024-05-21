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
  Divider,
  Checkbox
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDelete, useGet } from '../../API/request';
import { useConfirm } from '../../components/Confirm';
import { BallTriangle } from 'react-loader-spinner';
import moment from 'moment';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import randomColor from 'randomcolor';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const AppStatistics = () => {
  const getU = useGet();
  const deleteU = useDelete();
  const confirm = useConfirm();

  const [isLoaded, setIsLoaded] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const [events, setEvents] = useState([]);
  const [checkedEventsIds, setCheckedEventsIds] = useState([]);
  const [statistics, setStatistics] = useState([]);

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams({});

  const [queryParams, setQueryParams] = useState({
    startDate:
      searchParams.get('startDate') ||
      new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    endDate: searchParams.get('endDate') || new Date()
  });

  const handleFilterQueryParams = () => {
    const params = {};
    if (queryParams.startDate !== '') {
      params.startDate = dayjs(queryParams.startDate).format('YYYY-MM-DD');
    }
    if (queryParams.endDate !== '') {
      params.endDate = dayjs(queryParams.endDate).format('YYYY-MM-DD');
    }

    if (Object.keys(params).length !== 0) {
      setSearchParams(params);
    }
  };

  const loadData = () => {
    setIsDataLoading(true);
    setIsLoaded(true);

    let endpoint = `statistics/events/statistics?page=${
      page + 1
    }&limit=${limit}&startDate=${
      searchParams.get('startDate') ||
      new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
    }&endDate=${searchParams.get('endDate') || new Date()}`;

    getU(endpoint)
      .then((resp) => {
        if (resp.status === 'success') {
          setEvents(resp.data.eventsStatistics);
          setCount(resp.data.currentCount || 0);
        }
      })
      .catch((err) => {
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

  const checkEvent = (eventId, checked) => {
    !checked && setCheckedEventsIds([...checkedEventsIds, eventId]);
    checked &&
      setCheckedEventsIds(checkedEventsIds.filter((event) => event != eventId));
  };

  useEffect(() => {
    loadData();
  }, [page, limit, searchParams]);

  useEffect(() => {
    let endpoint = `statistics/events/statistics/ids?ids=${JSON.stringify(
      checkedEventsIds
    )}&startDate=${
      searchParams.get('startDate') ||
      new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
    }&endDate=${searchParams.get('endDate') || new Date()}`;

    getU(endpoint)
      .then((resp) => {
        if (resp.status === 'success') {
          setStatistics(resp.data.eventsStatistics);
        }
      })
      .catch((err) => {
        setStatistics([]);
      });
  }, [checkedEventsIds, searchParams]);

  useEffect(() => {
    if (queryParams.fromDate === '') {
      searchParams.delete('fromDate');
      setSearchParams(searchParams);
    }
    if (queryParams.toDate === '') {
      searchParams.delete('toDate');
      setSearchParams(searchParams);
    }
  }, [queryParams]);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      }
    }
  };

  const labels = [
    ...(statistics[0]?.statisticsByDay.map((d) =>
      new Date(d.date).toDateString()
    ) || [])
  ];

  const barData = {
    labels: labels,
    datasets: [
      ...statistics.map((item) => {
        return {
          label: item.name,
          data: item.statisticsByDay.map((day) => day.count),
          backgroundColor: randomColor({ seed: item.id, format: 'rgb' }),
          borderColor: randomColor({ seed: item.id, format: 'rgb' })
        };
      })
    ]
  };

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
        <title>Статистика приложения</title>
      </Helmet>

      <Box className="headerWrapper">
        <Box className="headerTitle">Статистика приложения</Box>
      </Box>
      <Box
        sx={{ backgroundColor: 'background.default', minHeight: '90%', py: 3 }}
      >
        <Container maxWidth={false}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="/app/app-statistics/events">
              <Button color="primary" variant="contained">
                События
              </Button>
            </Link>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Container maxWidth={false}>
              <Line options={options} data={barData} updateMode={'none'} />
            </Container>
          </Box>

          <Box sx={{ pt: 3 }}>
            <Card>
              <PerfectScrollbar>
                <Box sx={{ minWidth: 700 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mx: 2,
                      mb: 1,
                      mt: 2
                    }}
                  >
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      adapterLocale="ru"
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <Box style={{ width: '45%' }}>
                          <DatePicker
                            onError={console.log}
                            minDate={dayjs('2020-01-01')}
                            maxDate={dayjs('2100-12-31')}
                            sx={{ width: '100%' }}
                            name="startDate"
                            variant="static"
                            inputFormat="DD.MM.YYYY"
                            label="С какой даты"
                            renderInput={(props) => <TextField {...props} />}
                            value={queryParams.startDate}
                            onChange={(newValue) => {
                              setQueryParams({
                                ...queryParams,
                                startDate: newValue
                              });
                            }}
                          />
                        </Box>
                        <Box style={{ width: '45%' }}>
                          <DatePicker
                            minDate={dayjs('2020-01-01')}
                            maxDate={dayjs('2100-12-31')}
                            sx={{ minWidth: 300 }}
                            ampm={false}
                            variant="static"
                            inputFormat="DD.MM.YYYY"
                            name="endDate"
                            label="По какую дату"
                            renderInput={(props) => <TextField {...props} />}
                            value={queryParams.endDate || new Date()}
                            onChange={(newValue) => {
                              setQueryParams({
                                ...queryParams,
                                endDate: newValue
                              });
                            }}
                          />
                        </Box>
                      </Box>
                    </LocalizationProvider>
                    <Button
                      color="warning"
                      variant="contained"
                      onClick={handleFilterQueryParams}
                      sx={{ mt: 2, mb: 2 }}
                    >
                      Поиск
                    </Button>
                  </Box>
                </Box>
                <Divider />
                <Box sx={{ minWidth: 700 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Название</TableCell>
                        <TableCell>Важное?</TableCell>
                        <TableCell>Срабатываний за период</TableCell>
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
                          <TableCell>{event.count}</TableCell>
                          <TableCell>
                            <Checkbox
                              checked={
                                !checkedEventsIds.find(
                                  (checkedEventId) => checkedEventId == event.id
                                )
                              }
                              value={event.id}
                              onClick={(e) => {
                                e.target.checked = e.target.checked;

                                checkEvent(e.target.value, e.target.checked);
                              }}
                            />
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

export default AppStatistics;
