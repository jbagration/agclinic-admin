import React, {useState, useEffect} from 'react';
import {Helmet} from 'react-helmet';
import {Link, useSearchParams} from 'react-router-dom';
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
    Checkbox,
    Alert
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import UserListSkelet from '../../skeletons/UserListSkelet';
import {useDelete, useGet, usePut} from '../../API/request';
import {useConfirm} from "../../components/Confirm/index";
import {BallTriangle} from "react-loader-spinner";
import '../../styles/All.css'

const RecordingToProcedureList = () => {

    const confirm = useConfirm();
    const getU = useGet();
    const putU = usePut()
    const deleteU = useDelete();

    const [isLoaded, setIsLoaded] = useState(true);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [recordings, setRecordings] = useState([]);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [count, setCount] = useState(0);
    const [cities, setCities ] = useState([])
    const [specialists, setSpecialists ] = useState([])

    const [alert, setAlert] = useState({
        txt: '',
        type: 'error',
        isVisible: false,
    });

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

    const handleChange = (id) => {
        setRecordings(prev => prev.map(el => {
            if (el.id === id) return {
                ...el,
                status: !el.status
            }
            return el
        }))

        putU(`recording_to_procedure/${id}`, {status: 1 - recordings.find(el => el.id === id).status})// Меняет 0 на 1 и наоборот
            .then((resp) => {
                if (resp.status === 'success') {
                    // showAlert('success', 'Статус изменён')
                }
            })
            .catch((err) => {
                console.log(err)
                showAlert('error', 'Ошибка изменения статуса')
                setRecordings(prev => prev.map(el => {
                    if (el.id === id) return {
                        ...el,
                        status: !el.status
                    }
                    return el
                }))
            })
            .finally(() => {
                setIsLoaded(false)
            });
    }

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
        }, 2500);
    };

    const loadServices = () => {
        setIsDataLoading(true);
        setIsLoaded(true)

        let endpoint = `recording_to_procedure?page=${page + 1}&limit=${limit}`;

        getU(`city`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setCities(resp.data.city)
                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setIsLoaded(false)
            });
        getU(`services?page=1&limit=999999`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setSpecialists(resp.data.service)
                }
            })
            .catch(() => {
                showAlert('error', 'Произошла ошибка при загрузке процедур, попробуйте перезайти');
            })

        getU(endpoint)
            .then((resp) => {
                if (resp.status === 'success') {
                    setRecordings(resp.data.record);
                    setCount(resp.data.totalCount || 0);
                }
                setIsDataLoading(false);
            })
            .catch((err) => {
                console.log(err.response)
                setRecordings([]);
                setCount(0);
                setIsDataLoading(false);
            })
            .finally(() => {
                setIsLoaded(false)
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
            content: 'Вы уверены, что хотите удалить запись?',
            onConfirm: () => {
                deleteU(`recording_to_procedure/${id}`)
                    .then((resp) => {
                        if (resp.status === 'success') {
                            loadServices();
                        }
                    })
                    .catch((e) => {
                        console.log(e)
                    });
            }
        });
    };

    useEffect(() => {
        loadServices();
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
                <title>Записи на процедуру</title>
            </Helmet>
            <Box className="headerWrapper">
                <Box className="headerTitle">
                    Записи на процедуру
                </Box>
            </Box>
            <Box sx={{backgroundColor: 'background.default', minHeight: '100%', py: 3}}>
                <Container maxWidth={false}>
                    {
                        isDataLoading ?
                            <UserListSkelet/>
                            :
                            <>
                                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                                    <Box sx={{marginLeft: 2}}>
                                        <Link to="/app/recording_to_procedure/add">
                                            <Button color="primary" variant="contained">
                                                Добавить запись
                                            </Button>
                                        </Link>
                                    </Box>
                                </Box>
                                <Box sx={{pt: 3}}>
                                    <Card>
                                        <PerfectScrollbar>
                                            <Box sx={{minWidth: 1000}}>
                                                <Divider/>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell sx={{width: 80}}>
                                                                Id
                                                            </TableCell>
                                                            <TableCell>
                                                                Имя
                                                            </TableCell>
                                                            <TableCell>
                                                                Телефон
                                                            </TableCell>
                                                            <TableCell>
                                                                Город
                                                            </TableCell>
                                                            <TableCell>
                                                                Процедура
                                                            </TableCell>
                                                            <TableCell>
                                                                Дата создания
                                                            </TableCell>
                                                            <TableCell>
                                                                Статус
                                                            </TableCell>
                                                            <TableCell>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {recordings?.map((recording) => (
                                                            <TableRow hover key={recording.id}>
                                                                <TableCell sx={{width: 80}}>
                                                                    {recording?.id || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {recording?.name || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {recording?.phone || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {cities.find(el => el.id === recording.city_id)?.name || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {recording?.services || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {formattedDateTime(recording.date_create) || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Box sx={{ display: 'flex', justifyContent: 'start' }}>
                                                                    <Checkbox
                                                                        checked={!!recording.status}
                                                                        onChange={() => handleChange(recording.id)}
                                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                                        />
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                        {/* <Link to={`/app/news/${recording.id}`}>
                                                                        <Button color="primary" variant="contained">
                                                                            Инфо.
                                                                        </Button>
                                                                        </Link> */}
                                                                        {/* <Box sx={{ ml: 2 }}>
                                                                        <Link to={`/app/news/edit/${recording.id}`}>
                                                                            <Button color="primary" variant="contained">
                                                                            Редакт.
                                                                            </Button>
                                                                        </Link>
                                                                        </Box> */}
                                                                        <Box sx={{ ml: 2 }}>
                                                                        <Button
                                                                            color="error"
                                                                            variant="contained"
                                                                            onClick={(e) => e && onDelete(recording.id)}
                                                                        >
                                                                            Удалить
                                                                        </Button>
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
                                                                    <span>Кол-во строк на странице:</span>}
                                                                rowsPerPageOptions={[10, 20, 30, 40, 50]}
                                                                colSpan={6}
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
                                            <Alert severity={alert.type}
                                                    style={{display: alert.isVisible ? 'flex' : 'none'}}>
                                                {alert.txt}
                                            </Alert>
                                        </PerfectScrollbar>
                                    </Card>
                                </Box>
                            </>
                    }
                </Container>
            </Box>
        </>
    );
};

export default RecordingToProcedureList;
