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

const NewsList = () => {

    const confirm = useConfirm();
    const getU = useGet();
    const deleteU = useDelete();

    const [isLoaded, setIsLoaded] = useState(true);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [news, setNews] = useState([]);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [count, setCount] = useState(0);

    const loadServices = () => {
        setIsDataLoading(true);
        setIsLoaded(true)

        let endpoint = `publication/?type=0&page=${page + 1}&limit=${limit}`;

        getU(endpoint)
            .then((resp) => {
                if (resp.status === 'success') {
                    setNews(resp.data.publication);
                    setCount(resp.data.totalCount || 0);
                }
                setIsDataLoading(false);
            })
            .catch((err) => {
                console.log(err.response)
                setNews([]);
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
            content: 'Вы уверены, что хотите удалить новость?',
            onConfirm: () => {
                deleteU(`publication/${id}`)
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
                <title>Новости</title>
            </Helmet>
            <Box className="headerWrapper">
                <Box className="headerTitle">
                    Новости
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
                                        <Link to="/app/news/add">
                                            <Button color="primary" variant="contained">
                                                Добавить новость
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
                                                               Превью
                                                            </TableCell>
                                                            <TableCell>
                                                                Название новости
                                                            </TableCell>
                                                            <TableCell>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {news?.map((service) => (
                                                            <TableRow hover key={service.id}>
                                                                <TableCell sx={{width: 80}}>
                                                                    {service?.id || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Box sx={{ alignItems: 'center', display: 'flex' }}>
                                                                        <Avatar
                                                                            src={
                                                                                service.img
                                                                                    ? `${process.env.REACT_APP_API_URL}public/uploads/images/${service.img}`
                                                                                    : ''
                                                                            }
                                                                        />
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {service?.title || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                        <Link to={`/app/news/${service.id}`}>
                                                                        <Button color="primary" variant="contained">
                                                                            Инфо.
                                                                        </Button>
                                                                        </Link>
                                                                        <Box sx={{ ml: 2 }}>
                                                                        <Link to={`/app/news/edit/${service.id}`}>
                                                                            <Button color="primary" variant="contained">
                                                                            Редакт.
                                                                            </Button>
                                                                        </Link>
                                                                        </Box>
                                                                        <Box sx={{ ml: 2 }}>
                                                                        <Button
                                                                            color="error"
                                                                            variant="contained"
                                                                            onClick={(e) => e && onDelete(service.id)}
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

export default NewsList;
