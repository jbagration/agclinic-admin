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
    Alert
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import UserListSkelet from '../../skeletons/UserListSkelet';
import {useDelete, useGet} from '../../API/request';
import {BallTriangle} from "react-loader-spinner";
import '../../styles/All.css'
import { ChildrenCategories } from './ChildrenCategories';

const CategoryList = () => {

    const getU = useGet();
    const [isLoaded, setIsLoaded] = useState(true);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [count, setCount] = useState(0);

    const [alert, setAlert] = useState({
        txt: '',
        isVisible: false,
        type: 'error'
    });

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
        }, 1400);
    };

    const loadServices = () => {
        setIsDataLoading(true);
        setIsLoaded(true)

        let endpoint = `services_category?page=${page + 1}&limit=${limit}`;

        getU(endpoint)
            .then((resp) => {
                if (resp.status === 'success') {
                    setCategories(resp.data.category);
                    setCount(resp.data.totalCount || 0);
                }
                setIsDataLoading(false);
            })
            .catch((err) => {
                console.log(err.response)
                setCategories([]);
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
                <title>Категории услуг</title>
            </Helmet>
            <Box className="headerWrapper">
                <Box className="headerTitle">
                    Категории услуг
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
                                        <Link to="/app/categories/add/0">
                                            <Button color="primary" variant="contained">
                                                Добавить категорию услуг
                                            </Button>
                                        </Link>
                                    </Box>
                                </Box>
                                <Box sx={{pt: 3}}>
                                    <Card>
                                        <PerfectScrollbar>
                                            <Box sx={{minWidth: 1000}}>
                                                <Divider/>
                                                <ChildrenCategories
                                                    ctgs={categories}
                                                    loadServices={loadServices}
                                                    showAlert={showAlert}
                                                    limit={limit}
                                                    page={page}
                                                    handleChangeLimit={handleChangeLimit}
                                                    handleChangePage={handleChangePage}
                                                    cnt={count}
                                                />
                                                <Alert severity={alert.type}
                                                        style={{display: alert.isVisible ? 'flex' : 'none'}}>
                                                    {alert.txt}
                                                </Alert>
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

export default CategoryList;
