import {
    useState,
    useEffect,
    useMemo,
    useRef
} from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Container,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Button,
    Modal,
    Typography,
    Avatar,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TextField,
    TablePagination,
    TableFooter,
    CircularProgress,
    TableContainer
} from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';
import {useDelete, useGet, usePost} from '../../API/request';
import {Link, useSearchParams, useNavigate } from 'react-router-dom';
import {BallTriangle} from "react-loader-spinner";

const ListItems = ({ users, onClick, categories }) => users.map((user) => (
    <TableRow hover sx={{ cursor: 'pointer' }} key={uuidv4()} onClick={() => onClick(user.id)}>
        <TableCell sx={{ width: 80 }}>
            {user.id || "---"}
        </TableCell>
        <TableCell>
            {user.title || "---"}
        </TableCell>
        <TableCell>
            {categories?.find(el => el.id === user.category_id)?.value || '---'}
        </TableCell>
        <TableCell sx={{ width: 80 }}>
            {user.cost || "---"}
        </TableCell>
    </TableRow>
));

ListItems.propTypes = {
    onClick: PropTypes.func,
    users: PropTypes.array
};

ListItems.defaultProps = {
    onClick: () => {},
    users: []
};

const PriceOpenModal = ({ addMember, children }) => {

    const [visible, setVisible] = useState(false);
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const getU = useGet();
    const postU = usePost();
    const navigate = useNavigate();

    const [queryParams, setQueryParams] = useState({
        title: searchParams.get("title") || '',
        category_name: searchParams.get("category_name") || '',
    });

    const handleChangeQueryParams = (event) => {
        setQueryParams({
            ...queryParams,
            [event.target.name]: event.target.value
        });
    };

    const handleFilterQueryParams = () => {
        const params = {}
        if (queryParams.title !== '') {
            params.title = queryParams.title
        }
        if (queryParams.category_name !== '') {
            params.category_name = queryParams.category_name
        }
        if (Object.keys(params).length !== 0) {
            setSearchParams(params)
        }
    }

    const loadUsers = () => {
        setIsLoading(true);
        let endpoint = `price/price/search?page=${page + 1}&limit=${limit}`;

        const bodyParams = {}; // Объект для параметров, которые будут переданы в теле запроса

        if (queryParams.category_name !== '') {
            bodyParams.category_name = searchParams.get("category_name");
        }
        if (queryParams.title !== '') {
            bodyParams.title = searchParams.get("title");
        }

        postU(endpoint, bodyParams) // Передаем объект `bodyParams` в качестве второго аргумента
            .then((resp) => {
            if (resp.status === 'success') {
                setUsers(resp.data.price);
                setCount(resp.data.totalCount || 0);
            }
            setIsLoading(false);
            })
            .catch((err) => {
            console.log(err.response);
            setUsers([]);
            setCount(0);
            });
        };

    const loadCategory = () => {
        getU(`price/category?limit=99999`)
            .then((resp) => {
                console.log(resp)
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

    const handleOpenModal = () => {
        setVisible(true);
    };

    const handleCloseModal = () => {
        setVisible(false);
    };

    const handleNavigation = (id) => {
        handleCloseModal();
        navigate(`/app/price/info/${id}`);

    };

    useEffect(() => {
        if (queryParams.title === '') {
            searchParams.delete("title")
            setSearchParams(searchParams);
        }
        if (queryParams.category_name === '') {
            searchParams.delete("category_name")
            setSearchParams(searchParams);
        }
    }, [queryParams])

    useEffect(() => {
        loadUsers();
        loadCategory();
    }, [page, limit, searchParams]);

    return (
        <>
            {children({ openModal: handleOpenModal })}
            <Modal open={visible} onClose={handleCloseModal}>
                <Box sx={{ maxWidth: 1200, py: 3, margin: 'auto' }}>
                    <Container maxWidth={false}>
                        <Card>
                            <CardHeader title="Поиск прайса" />
                            <Divider />
                            <CardContent>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mx: 2,
                                mb: 1
                            }}>
                                <TextField
                                    fullWidth
                                    label="Название прайса"
                                    margin="normal"
                                    name="title"
                                    onChange={handleChangeQueryParams}
                                    type="text"
                                    value={queryParams.title}
                                    variant="outlined"
                                    style={{width: '35%'}}
                                />
                                <TextField
                                    fullWidth
                                    label="Категория"
                                    margin="normal"
                                    name="category_name"
                                    onChange={handleChangeQueryParams}
                                    type="text"
                                    value={queryParams.category_name}
                                    variant="outlined"
                                    style={{width: '35%'}}
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
                                <TableContainer
                                  sx={{
                                    maxHeight: '60vh'
                                  }}
                                >
                                    <Table>
                                        <TableHead sx={{
                                            left: 0,
                                            top: 0,
                                            zIndex: 2,
                                            position: 'sticky',
                                            backgroundColor: '#ffffff'
                                        }}
                                        >
                                            <TableRow>
                                                <TableCell sx={{ width: 180 }}>
                                                    Id
                                                </TableCell>
                                                <TableCell sx={{ width: 580 }}>
                                                    Название прайса
                                                </TableCell>
                                                <TableCell sx={{ width: 580 }}>
                                                    Категория
                                                </TableCell>
                                                <TableCell sx={{ width: 580 }}>
                                                    Цена
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        {isLoading ? (
                                            <TableBody style={{ position: 'relative', height: 100  }}>
                                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                                                    <BallTriangle
                                                        height="100"
                                                        width="100"
                                                        color='grey'
                                                        ariaLabel='loading'
                                                    />
                                                </div>
                                            </TableBody>
                                        ) : (
                                            <TableBody>
                                                <ListItems users={users} onClick={handleNavigation} categories={categories} />
                                            </TableBody>
                                        )}
                                        <TableFooter
                                            sx={{
                                                left: 0,
                                                bottom: 0,
                                                zIndex: 2,
                                                position: 'sticky',
                                                backgroundColor: '#ffffff',
                                            }}
                                        >
                                            <TableRow sx={{ width: '100%', justifyContent: 'center' }}>
                                                <TablePagination
                                                    sx={{ border: 0 }}
                                                    rowsPerPageOptions={[10, 20, 30, 40, 50]}
                                                    colSpan={4}
                                                    count={count}
                                                    rowsPerPage={limit}
                                                    page={page}
                                                    onPageChange={handleChangePage}
                                                    onRowsPerPageChange={handleChangeLimit}
                                                />
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Container>
                </Box>
            </Modal>
        </>
    );
};

export default PriceOpenModal;
