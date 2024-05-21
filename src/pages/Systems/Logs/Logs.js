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
import UserListSkelet from '../../../skeletons/UserListSkelet';
import {useDelete, useGet} from '../../../API/request';
import {useConfirm} from "../../../components/Confirm";
import {BallTriangle} from "react-loader-spinner";
import moment from "moment";

const Logs = () => {

    const getU = useGet();
    const deleteU = useDelete()
    const confirm = useConfirm();

    const [isLoaded, setIsLoaded] = useState(true);
    const [isDataLoading, setIsDataLoading] = useState(true);

    const [logs, setLogs] = useState([]);

    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [count, setCount] = useState(0);

    const loadData = () => {
        setIsDataLoading(true);
        setIsLoaded(true)

        let endpoint = `logs?page=${page + 1}&limit=${limit}`;

        getU(endpoint)
            .then((resp) => {
                console.log(resp)
                if (resp.status === 'success') {
                    setLogs(resp.data.logs);
                    setCount(resp.data.total || 0);
                }
            })
            .catch((err) => {
                console.log(err.response)
                setLogs([]);
                setCount(0);
            })
            .finally(() => {
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

    const cleareLogs = () => {

        confirm({
            title: 'Очистка логов',
            content: 'Вы уверены, что хотите очистить логи?',
            onConfirm: () => {
                deleteU(`logs`)
                    .then((resp) => {
                        if (resp.status === 'success') {
                            loadData();
                        }
                    })
                    .catch((e)=>{
                        console.log(e.response)
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
                    Логи
                </Box>
            </Box>
            <Box sx={{backgroundColor: 'background.default', minHeight: '90%', py: 3}}>
                <Container maxWidth={false}>
                    <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Button color="error" variant="contained" onClick={cleareLogs}>
                            Очистить историю
                        </Button>
                    </Box>

                    <Box sx={{pt: 3}}>
                        <Card>
                            <PerfectScrollbar>
                                <Box sx={{minWidth: 1050}}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    Id
                                                </TableCell>
                                                <TableCell>
                                                    Status
                                                </TableCell>
                                                <TableCell>
                                                    Message
                                                </TableCell>
                                                <TableCell>
                                                    Time
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {logs.map((log) => (
                                                <TableRow hover key={log.id}>
                                                    <TableCell>
                                                        {log.id || "---"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {log.status || "---"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {log.message || '---'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {moment(log.time).format('HH:mm, DD.MM.YYYY') || '---'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                        <TableFooter>
                                            <TableRow>
                                                <TablePagination
                                                    labelRowsPerPage={<span>Кол-во строк на странице:</span>}
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

export default Logs;
