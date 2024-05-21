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
    Divider
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import UserListSkelet from '../../skeletons/UserListSkelet';
import {useDelete, useGet} from '../../API/request';
import {useConfirm} from "../../components/Confirm/index";
import {BallTriangle} from "react-loader-spinner";
import '../../styles/All.css'

const CitiesList = () => {

    const confirm = useConfirm();
    const getU = useGet();
    const deleteU = useDelete();
    const [searchParams, setSearchParams] = useSearchParams();

    const [isLoaded, setIsLoaded] = useState(true);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [cities, setCities] = useState([]);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [count, setCount] = useState(0);

    const loadCities = () => {
        setIsDataLoading(true);
        setIsLoaded(true)

        getU('city')
            .then((resp) => {
                if (resp.status === 'success') {
                    setCities(resp.data.city);
                    setCount(resp.data.totalCount || 0);
                }
                setIsDataLoading(false);
            })
            .catch((err) => {
                console.log(err.response)
                setCities([]);
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

    const handleDelete = (id) => {
    confirm({
        title: 'Удаление',
        content: 'Вы уверены, что хотите удалить город?',
        onConfirm: () => {
        deleteU(`city/${id}`)
            .then((resp) => {
            if (resp.status === 'success') {
                loadCities();
            }
            })
            .catch((e) => {
            console.error(e.response);
            });
        },
    });
    };

    useEffect(() => {
        loadCities();
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
                <title>Города</title>
            </Helmet>
            <Box className="headerWrapper">
                <Box className="headerTitle">
                    Список городов
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
                                        <Link to="/app/city/add">
                                            <Button color="primary" variant="contained">
                                                Добавить город
                                            </Button>
                                        </Link>
                                    </Box>
                                </Box>
                                <Box sx={{pt: 3}}>
                                    <Card>
                                        <PerfectScrollbar>
                                            <Box>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    mx: 2,
                                                    mb: 1
                                                }}>
                                                </Box>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell sx={{width: 100}}>
                                                                Id
                                                            </TableCell>
                                                            <TableCell>
                                                                Город
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
                                                        {cities?.map((city) => (
                                                            <TableRow hover key={city.id}>
                                                                <TableCell sx={{width: 80}}>
                                                                    {city?.id}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {city?.name || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {city?.date_create || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {city?.date_update || '---'}
                                                                </TableCell>
                                                                <TableCell sx={{maxWidth: '200px'}}>
                                                                    <Box sx={{display: 'flex'}}>
                                                                        <Box sx={{ml: 2}}>
                                                                            <Link
                                                                                to={`/app/city/edit/${city.id}`}>
                                                                                <Button color="primary"
                                                                                        variant="contained"
                                                                                >
                                                                                    Редакт.
                                                                                </Button>
                                                                            </Link>
                                                                        </Box>
                                                                        <Box sx={{ml: 2}}>
                                                                        <Button color="error" variant="contained" onClick={() => handleDelete(city.id)}>
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
                    }
                </Container>
            </Box>
        </>
    );
};

export default CitiesList;
