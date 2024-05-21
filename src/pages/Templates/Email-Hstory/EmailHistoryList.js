import React, {useState, useEffect} from 'react';
import {Helmet} from 'react-helmet';
import {Link, useParams, useSearchParams} from 'react-router-dom';
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
import {BallTriangle} from "react-loader-spinner";
import '../../../styles/All.css'
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import moment from 'moment';
import {useConfirm} from "../../../components/Confirm";

const PaymentList = () => {

    const getU = useGet();
    const deleteU = useDelete();
    const confirm = useConfirm();
    const [searchParams, setSearchParams] = useSearchParams();

    const [isLoaded, setIsLoaded] = useState(true);
    const [history, setHistory] = useState([]);

    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [count, setCount] = useState(0);

    const [queryParams, setQueryParams] = useState({
        id: searchParams.get("id") || '',
    });
    const [curSearchVal, setCurSearchVal] = useState('success');

    const handleChangeQueryParams = (event) => {
        setQueryParams({
            ...queryParams,
            [event.target.name]: event.target.value
        });
    };

    const handleFilterQueryParams = () => {
        const params = {}
        if (queryParams.id !== '') {
            params.id = queryParams.id
        }
        if (Object.keys(params).length !== 0) {
            setSearchParams(params)
        }
    }

    const loadData = () => {
        setIsLoaded(true)

        let endpoint = `email/history?filter=${curSearchVal}&page=${page + 1}&limit=${limit}`;

        if (queryParams.id !== '') {
            endpoint += `&id=${searchParams.get("id")}`;
        }

        getU(endpoint)
            .then((resp) => {
                if (resp.status === 'success') {
                    console.log(resp.data)
                    setHistory(resp?.data?.emailHistory);
                    setCount(resp.total || 0);
                }
            })
            .catch((err) => {
                console.log(err.response)
                setHistory([]);
                setCount(0);
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


    const cleareHistory = () => {

        confirm({
            title: 'Очистка истории',
            content: 'Вы уверены, что хотите очистить историю?',
            onConfirm: () => {
                deleteU(`email/history`)
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
        if (queryParams.id === '') {
            searchParams.delete("id")
            setSearchParams(searchParams);
        }
    }, [queryParams])

    useEffect(() => {
        loadData();
    }, [page, limit, searchParams, curSearchVal]);



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
                <title>Email history</title>
            </Helmet>
            <Box className="headerWrapper">
                <Box className="headerTitle">
                    История почты
                </Box>
            </Box>
            <Box sx={{backgroundColor: 'background.default', minHeight: '100%', py: 3}}>
                <Container maxWidth={false}>
                    <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>

                        <Button color="error" variant="contained" onClick={cleareHistory}>
                            Очистить историю
                        </Button>
                    </Box>
                    <Box sx={{pt: 3}}>
                        <Card>
                            <PerfectScrollbar>
                                <Box sx={{pt: 1, px: 2}} fullWidth>
                                    <Box fullWidth>
                                        <FormControl fullWidth sx={{mt: 2, mb: 1}}>
                                            <InputLabel id="searchType">
                                                Выберите тип фильтрации
                                            </InputLabel>
                                            <Select
                                                labelId="searchType"
                                                name="searchValue"
                                                value={curSearchVal}
                                                label="Выберите тип фильтрации"
                                                onChange={(evt) => setCurSearchVal(evt.target.value)}
                                            >
                                                <MenuItem value="success">
                                                    Успешные
                                                </MenuItem>
                                                <MenuItem value="error">
                                                    Провальные
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 1
                                    }}>
                                        <TextField
                                            fullWidth
                                            label="Id"
                                            margin="normal"
                                            name="id"
                                            onChange={handleChangeQueryParams}
                                            type="text"
                                            value={queryParams.id}
                                            variant="outlined"
                                            style={{marginRight: 10}}
                                        />
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            onClick={handleFilterQueryParams}
                                            sx={{mt: 2, mb: 1}}
                                        >
                                            Применить
                                        </Button>
                                    </Box>
                                </Box>
                                <Box sx={{minWidth: 1400}}>
                                    <Divider/>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{width: 80}}>
                                                    Id
                                                </TableCell>
                                                <TableCell>
                                                    Key
                                                </TableCell>
                                                <TableCell>
                                                    Status
                                                </TableCell>
                                                <TableCell>
                                                    Error message
                                                </TableCell>
                                                <TableCell>
                                                    Message
                                                </TableCell>
                                                <TableCell>
                                                    Email
                                                </TableCell>
                                                <TableCell>
                                                    Date
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {history?.map((item) => (
                                                <TableRow hover key={item.id}>
                                                    <TableCell sx={{width: 80}}>
                                                        {item?.id || '---'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item?.key || '---'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item?.status || '---'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {'---'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item?.message || '---'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item?.email || '---'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {moment(item?.date).format('HH:mm, DD.MM.YYYY')}
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
                </Container>
            </Box>
        </>
    );
};

export default PaymentList;
