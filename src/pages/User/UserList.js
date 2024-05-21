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

const UserList = () => {

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

    const handleChangeQueryParams = (event) => {
        setQueryParams({
            ...queryParams,
            [event.target.name]: event.target.value
        });
    };

    const handleFilterQueryParams = () => {
        const params = {}
        if (queryParams.username !== '') {
            params.username = queryParams.username
        }
        if (queryParams.id !== '') {
            params.id = queryParams.id
        }
        if (queryParams.email !== '') {
            params.email = queryParams.email
        }
        console.log(Object.keys(params).length !== 0)
        if (Object.keys(params).length !== 0) {
            setSearchParams(params)
        }
    }

    const loadUsers = () => {
        setIsDataLoading(true);
        setIsLoaded(true)

        let endpoint = `admin/users?page=${page + 1}&limit=${limit}`;

        if (queryParams.email !== '') {
            endpoint += `&email=${searchParams.get("email")}`;
        }
        if (queryParams.username !== '') {
            endpoint += `&username=${searchParams.get("username")}`;
        }
        if (queryParams.id !== '') {
            endpoint += `&id=${searchParams.get("id")}`;
        }

        getU(endpoint)
            .then((resp) => {
                if (resp.status === 'success') {
                    setUsers(resp.data.users);
                    setCount(resp.data.currentCount || 0);
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
            content: 'Вы уверены, что хотите удалить пользователя?',
            onConfirm: () => {
                deleteU(`admin/user/${id}`)
                    .then((resp) => {
                        if (resp.status === 'success') {
                            loadUsers();
                        }
                    })
                    .catch((e) => {
                        // console.log("opened")
                        // console.log(e.response)
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
                <title>Users</title>
            </Helmet>
            <Box className="headerWrapper">
                <Box className="headerTitle">
                    Пользователи
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
                                        <Link to="/app/user/add">
                                            <Button color="primary" variant="contained">
                                                Добавить пользователя
                                            </Button>
                                        </Link>
                                    </Box>
                                </Box>
                                <Box sx={{pt: 3}}>
                                    <Card>
                                        <PerfectScrollbar>
                                            <Box sx={{minWidth: 1400}}>
                                                <Box sx={{
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
                                                </Box>
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
                                                                User name
                                                            </TableCell>
                                                            <TableCell>
                                                                Email
                                                            </TableCell>
                                                            <TableCell>
                                                                Role
                                                            </TableCell>
                                                            <TableCell>

                                                            </TableCell>
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
                                                                                user.avatar
                                                                                    ? `${process.env.REACT_APP_API_URL}/uploads/avatars/${user.avatar}`
                                                                                    : ''
                                                                            }
                                                                        />
                                                                    </Box>
                                                                </TableCell>

                                                                <TableCell>
                                                                    {user?.username || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {user?.email || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {user?.role || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Box sx={{display: 'flex'}}>

                                                                        <Box sx={{display: 'flex'}}>
                                                                            <Link to={`/app/user/${user.id}`}>
                                                                                <Button color="primary"
                                                                                        variant="contained">
                                                                                    Инфо.
                                                                                </Button>
                                                                            </Link>
                                                                            <Box sx={{ml: 2}}>
                                                                                <Link
                                                                                    to={`/app/user/edit/${user.id}`}
                                                                                    style={user?.role === "admin" ? {pointerEvents: 'none'} : {}}>
                                                                                    <Button color="primary"
                                                                                            variant="contained"
                                                                                            disabled={user?.role === "admin"}
                                                                                    >
                                                                                        Редакт.
                                                                                    </Button>
                                                                                </Link>

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

export default UserList;
