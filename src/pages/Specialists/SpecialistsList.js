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

const SpecialistList = () => {

    const confirm = useConfirm();
    const getU = useGet();
    const deleteU = useDelete();
    const [searchParams, setSearchParams] = useSearchParams();

    const [isLoaded, setIsLoaded] = useState(true);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [count, setCount] = useState(0);

    const [queryParams, setQueryParams] = useState({
        username: searchParams.get("username") || '',
        email: searchParams.get("email") || '',
        id: searchParams.get("id") || '',
    });

    const loadUsers = () => {
        setIsDataLoading(true);
        setIsLoaded(true)

        let endpoint = `specialist?page=${page + 1}&limit=${limit}`;

        getU(endpoint)
            .then((resp) => {
                if (resp.status === 'success') {
                    setUsers(resp.data.specialist);
                    setCount(resp.data.totalCount || 0);
                }
                setIsDataLoading(false);
            })
            .catch((err) => {
                console.log(err.response)
                setUsers([]);
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
            content: 'Вы уверены, что хотите удалить специалиста?',
            onConfirm: () => {
                deleteU(`specialist/${id}`)
                    .then((resp) => {
                        if (resp.status === 'success') {
                            loadUsers();
                        }
                    })
                    .catch((e) => {
                        console.log(e.response)
                    });
            }
        });
    };

    useEffect(() => {
        if (queryParams.username === '') {
            searchParams.delete("username")
            setSearchParams(searchParams);
        }
        if (queryParams.id === '') {
            searchParams.delete("id")
            setSearchParams(searchParams);
        }
        if (queryParams.email === '') {
            searchParams.delete("email")
            setSearchParams(searchParams);
        }
    }, [queryParams])

    useEffect(() => {
        loadUsers();
    }, [page, limit, searchParams]);

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
                <title>Специалисты</title>
            </Helmet>
            <Box className="headerWrapper">
                <Box className="headerTitle">
                    Специалисты
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
                                        <Link to="/app/specialist/add">
                                            <Button color="primary" variant="contained">
                                                Добавить специалиста
                                            </Button>
                                        </Link>
                                    </Box>
                                </Box>
                                <Box sx={{pt: 3}}>
                                    <Card>
                                        <PerfectScrollbar>
                                            <Box sx={{minWidth: 1000}}>
                                                {/* <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    mx: 2,
                                                    mb: 1
                                                }}>
                                                    <TextField
                                                        fullWidth
                                                        label="Email"
                                                        margin="normal"
                                                        name="email"
                                                        onChange={handleChangeQueryParams}
                                                        type="text"
                                                        value={queryParams.email}
                                                        variant="outlined"
                                                        style={{width: '30%'}}
                                                    />
                                                    <TextField
                                                        fullWidth
                                                        label="Id"
                                                        margin="normal"
                                                        name="id"
                                                        onChange={handleChangeQueryParams}
                                                        type="text"
                                                        value={queryParams.id}
                                                        variant="outlined"
                                                        style={{width: '30%'}}
                                                    />
                                                    <TextField
                                                        fullWidth
                                                        label="User name"
                                                        margin="normal"
                                                        name="username"
                                                        onChange={handleChangeQueryParams}
                                                        type="text"
                                                        value={queryParams.username}
                                                        variant="outlined"
                                                        style={{width: '30%'}}
                                                    />
                                                    <Button
                                                        color="primary"
                                                        variant="contained"
                                                        onClick={handleFilterQueryParams}
                                                        sx={{mt: 2, mb: 1}}
                                                    >
                                                        Применить
                                                    </Button>
                                                </Box> */}
                                                <Divider/>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell sx={{width: 80}}>
                                                                Id
                                                            </TableCell>
                                                            <TableCell>
                                                               Avatar
                                                            </TableCell>
                                                            <TableCell>
                                                                Specialist name
                                                            </TableCell>
                                                            <TableCell />
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {users?.map((user) => (
                                                            <TableRow hover key={user.id}>
                                                                <TableCell sx={{width: 80}}>
                                                                    {user?.id}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Box sx={{ alignItems: 'center', display: 'flex' }}>
                                                                        <Avatar
                                                                            src={
                                                                                user.preview_img
                                                                                    ? `${process.env.REACT_APP_API_URL}public/uploads/images/${user.preview_img}`
                                                                                    : ''
                                                                            }
                                                                        />
                                                                    </Box>
                                                                </TableCell>

                                                                <TableCell>
                                                                    {user?.fio || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>

                                                                        <Box sx={{display: 'flex'}}>
                                                                            <Link to={`/app/specialist/${user.id}`}>
                                                                                <Button color="primary"
                                                                                        variant="contained">
                                                                                    Инфо.
                                                                                </Button>
                                                                            </Link>
                                                                            <Box sx={{ml: 2}}>
                                                                                <Link
                                                                                    to={`/app/specialist/edit/${user.id}`}>
                                                                                    <Button color="primary"
                                                                                            variant="contained"
                                                                                    >
                                                                                        Редакт.
                                                                                    </Button>
                                                                                </Link>

                                                                            </Box>
                                                                            <Box sx={{ml: 2}}>
                                                                                <Button
                                                                                    color="error"
                                                                                    variant="contained"
                                                                                    onClick={() => onDelete(user.id)}
                                                                                >
                                                                                    Удалить
                                                                                </Button>

                                                                            </Box>

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

export default SpecialistList;
