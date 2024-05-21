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
    FormControl,
    Select,
    MenuItem,
    ListItemText,
    InputLabel,
    TableRow,
    OutlinedInput,
    Button,
    TableFooter,
    TablePagination,
    Divider
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import UserListSkelet from '../../skeletons/UserListSkelet';
import {useDelete, useGet} from '../../API/request';
import {useConfirm} from "../../components/Confirm/index";
import {BallTriangle} from "react-loader-spinner";
import '../../styles/All.css'

const VacancyList = () => {

    const confirm = useConfirm();
    const getU = useGet();
    const deleteU = useDelete();

    const [isLoaded, setIsLoaded] = useState(true);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [vacancies, setVacancy] = useState([]);
    const [cities, setCities ] = useState([])
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [count, setCount] = useState(0);
    const [choosenCities, setChoosenCities] = useState('')

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

    const loadVacancy = () => {
        setIsDataLoading(true);
        setIsLoaded(true)
        loadCities();

        let endpoint = `vacancy?page=${page + 1}&limit=${limit}`;

        if (choosenCities) {
            endpoint = `vacancy/city/${choosenCities}?page=${page + 1}&limit=${limit}`;
        } else{
            endpoint = `vacancy?page=${page + 1}&limit=${limit}`;
        }

        getU(endpoint)
            .then((resp) => {
                if (resp.status === 'success') {
                    setVacancy(resp.data.vacancy);
                    setCount(resp.data.totalCount || 0);
                }
                setIsDataLoading(false);
            })
            .catch((err) => {
                console.log(err.response)
                setVacancy([]);
                setCount(0);
                setIsDataLoading(false);
            })
            .finally(() => {
                setIsLoaded(false)
            });
    };

    const handleChangeCity = (event) => {
        const value = event.target.value
        setChoosenCities(value);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeLimit = (event) => {
        setLimit(event.target.value);
        setPage(0);
    };

    const loadCities = () => {
        getU(`city`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setCities(resp.data.city)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const onDelete = (id) => {
        confirm({
            title: 'Удаление',
            content: 'Вы уверены, что хотите удалить вакансию?',
            onConfirm: () => {
                deleteU(`vacancy/${id}`)
                    .then((resp) => {
                        if (resp.status === 'success') {
                            loadVacancy();
                        }
                    })
                    .catch((e) => {
                        console.log(e)
                    });
            }
        });
    };

    useEffect(() => {
        loadVacancy();
    }, [page, limit, choosenCities]);

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
                <title>Вакансии</title>
            </Helmet>
            <Box className="headerWrapper">
                <Box className="headerTitle">
                    Вакансии
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
                                        <Link to="/app/vacancy/add">
                                            <Button color="primary" variant="contained">
                                                Добавить вакансию
                                            </Button>
                                        </Link>
                                    </Box>
                                </Box>
                                <Box sx={{pt: 3}}>
                                    <Card>
                                        <PerfectScrollbar>
                                            <Box sx={{minWidth: 1000}}>
                                                <Divider/>
                                                <FormControl fullWidth sx={{ mt: 2, mb: 1, ml: 5, width: 500 }}>
                                                    <InputLabel id="Все города">Все города</InputLabel>
                                                    <Select
                                                        label="Все города"
                                                        name="city_id"
                                                        value={choosenCities}
                                                        onChange={handleChangeCity}
                                                        input={<OutlinedInput label="Все города" />}
                                                        renderValue={(selected) => {
                                                        if (selected === '---') {
                                                            return 'Все города';
                                                        }
                                                        const selectedCity = cities.find(city => city.id === selected);
                                                        return selectedCity ? selectedCity.name : '';
                                                        }}
                                                    >
                                                        <MenuItem value={''}>
                                                            <ListItemText primary="Все города" />
                                                        </MenuItem>
                                                        {cities?.map((city) => (
                                                        <MenuItem key={city.id} value={city.id}>
                                                            <ListItemText primary={city.name} />
                                                        </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                <Divider/>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell sx={{width: 80}}>
                                                                Id
                                                            </TableCell>
                                                            <TableCell>
                                                                Название услуги
                                                            </TableCell>
                                                            <TableCell>
                                                                Дата создания
                                                            </TableCell>
                                                            <TableCell>
                                                                Дата обновления
                                                            </TableCell>
                                                            <TableCell>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {vacancies?.map((vacancy) => (
                                                            <TableRow hover key={vacancy.id}>
                                                                <TableCell sx={{width: 80}}>
                                                                    {vacancy?.id || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {vacancy?.title || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {formattedDateTime(vacancy.date_create) || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {formattedDateTime(vacancy.date_update) || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                        <Link to={`/app/vacancy/${vacancy.id}`}>
                                                                        <Button color="primary" variant="contained">
                                                                            Инфо.
                                                                        </Button>
                                                                        </Link>
                                                                        <Box sx={{ ml: 2 }}>
                                                                        <Link to={`/app/vacancy/edit/${vacancy.id}`}>
                                                                            <Button color="primary" variant="contained">
                                                                            Редакт.
                                                                            </Button>
                                                                        </Link>
                                                                        </Box>
                                                                        <Box sx={{ ml: 2 }}>
                                                                        <Button
                                                                            color="error"
                                                                            variant="contained"
                                                                            onClick={(e) => e && onDelete(vacancy.id)}
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

export default VacancyList;
