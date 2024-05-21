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

const ServiceList = () => {

    const confirm = useConfirm();
    const getU = useGet();
    const deleteU = useDelete();

    const [isLoaded, setIsLoaded] = useState(true);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([])
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [count, setCount] = useState(0);

    const loadServices = () => {
        setIsDataLoading(true);
        setIsLoaded(true)

        let endpoint = `services?page=${page + 1}&limit=${limit}`;

        getU(endpoint)
            .then((resp) => {
                if (resp.status === 'success') {
                    setServices(resp.data.service);
                    setCount(resp.data.totalCount || 0);
                }
                setIsDataLoading(false);
            })
            .catch((err) => {
                console.log(err.response)
                setServices([]);
                setCount(0);
                setIsDataLoading(false);
            })
            .finally(() => {
                setIsLoaded(false)
            });
    };

    const loadCategory = () => {
        getU(`services_category?limit=99999`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setCategories(resp.data.category)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

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
            content: 'Вы уверены, что хотите удалить услугу?',
            onConfirm: () => {
                deleteU(`services/${id}`)
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
        loadCategory();
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
                <title>Услуги</title>
            </Helmet>
            <Box className="headerWrapper">
                <Box className="headerTitle">
                    Услуги
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
                                        <Link to="/app/services/add">
                                            <Button color="primary" variant="contained">
                                                Добавить услугу
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
                                                                Название услуги
                                                            </TableCell>
                                                            <TableCell>
                                                                Категория
                                                            </TableCell>
                                                            <TableCell>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {services?.map((service) => (
                                                            <TableRow hover key={service.id}>
                                                                <TableCell sx={{width: 80}}>
                                                                    {service?.id || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Box sx={{ alignItems: 'center', display: 'flex' }}>
                                                                        <Avatar
                                                                            src={
                                                                                service.preview_img
                                                                                    ? `${process.env.REACT_APP_API_URL}public/uploads/images/${service.preview_img}`
                                                                                    : ''
                                                                            }
                                                                        />
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {service?.title || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {categories?.find(el => el.id === service.category_id)?.value || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                        <Link to={`/app/services/${service.id}`}>
                                                                            <Button color="primary" variant="contained">
                                                                                Инфо.
                                                                            </Button>
                                                                        </Link>
                                                                        <Box sx={{ ml: 2 }}>
                                                                            <Link to={`/app/services/edit/${service.id}`}>
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

export default ServiceList;
