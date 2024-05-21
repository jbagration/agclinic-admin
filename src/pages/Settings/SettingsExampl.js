import React, {useState, useEffect} from 'react';
import {Helmet} from 'react-helmet';
import {Link} from 'react-router-dom';
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
import {BallTriangle} from "react-loader-spinner";

const SettingsExampl = () => {

    const getU = useGet();

    const [isLoaded, setIsLoaded] = useState(true);
    const [isDataLoading, setIsDataLoading] = useState(true);

    const [logs, setLogs] = useState([]);

    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [count, setCount] = useState(0);

    const loadUsers = () => {
        setIsDataLoading(true);
        setIsLoaded(true)

        let endpoint = `general/logs?page=${page + 1}&limit=${limit}`;

        getU(endpoint)
            .then((resp) => {
                console.log(resp)
                if (resp.status === 'success') {
                    setLogs(resp.data.logs);
                    setCount(resp.data.allCount || 0);
                }
            })
            .catch((err) => {
                console.log(err.response)
                setLogs([]);
                setCount(0);
            })
            .finally(() =>{
                setIsLoaded(false)
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



    useEffect(() => {
        loadUsers();
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
                <title>Users</title>
            </Helmet>

            <Box className="headerWrapper">
                <Box className="headerTitle">
                    Общие настройки
                </Box>
            </Box>
            <Box sx={{backgroundColor: 'background.default', minHeight: '90%', py: 3}}>
                <Container maxWidth={false}>
                    {
                        isDataLoading ?
                            <UserListSkelet/>
                            :
                            <>
                                <Box sx={{pt: 3}}>
                                    <Card>
                                        <PerfectScrollbar>
                                            <Box sx={{minWidth: 1050}}>

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

export default SettingsExampl;
