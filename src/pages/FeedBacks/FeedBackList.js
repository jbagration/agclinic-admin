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

const FeedBackList = () => {

    const confirm = useConfirm();
    const getU = useGet();
    const deleteU = useDelete();

    const [isLoaded, setIsLoaded] = useState(true);
    const [feedBacks, setFeedBacks] = useState([]);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [count, setCount] = useState(0);

    const loadUsers = () => {
        setIsLoaded(true)

        let endpoint = `feedback?page=${page + 1}&limit=${limit}`;

        getU(endpoint)
            .then((resp) => {
                console.log(resp.data)
                if (resp.status === 'success') {
                    setFeedBacks(resp.data.feedbacks);
                    setCount(resp.data.totalCount || 0);
                }
            })
            .catch((err) => {
                console.log(err.response)
                setFeedBacks([]);
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


    const onDelete = (id) => {

        confirm({
            title: 'Удаление',
            content: 'Вы уверены, что хотите удалить обратную связь?',
            onConfirm: () => {
                deleteU(`feedback/${id}`)
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
                <title>FeedBacks</title>
            </Helmet>
            <Box className="headerWrapper">
                <Box className="headerTitle">
                    Обратная связь
                </Box>
            </Box>
            <Box sx={{backgroundColor: 'background.default', minHeight: '100%', py: 3}}>
                <Container maxWidth={false}>
                    <>
                        <Box sx={{pt: 3}}>
                            <Card>
                                <PerfectScrollbar>
                                    <Box sx={{minWidth: 1200}}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{width: 80}}>
                                                        Id
                                                    </TableCell>
                                                    <TableCell>
                                                        name
                                                    </TableCell>
                                                    <TableCell>
                                                        Email
                                                    </TableCell>
                                                    <TableCell>
                                                        isChecked
                                                    </TableCell>
                                                    <TableCell>
                                                        Message
                                                    </TableCell>
                                                    <TableCell>

                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {feedBacks?.map((item) => (
                                                    <TableRow hover key={item.id}>
                                                        <TableCell sx={{width: 80}}>
                                                            {item?.id}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item?.name || '---'}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item?.email || '---'}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item?.isChecked ? 'true' : 'false'}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item?.message || '---'}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box sx={{display: 'flex'}}>

                                                                <Box sx={{display: 'flex'}}>
                                                                    <Box sx={{ml: 2}}>
                                                                        <Link to={`/app/feedbacks/edit/${item.id}`}>
                                                                            <Button color="primary"
                                                                                    variant="contained"
                                                                            >
                                                                                Редакировать
                                                                            </Button>
                                                                        </Link>

                                                                    </Box>
                                                                    <Box sx={{ml: 2}}>
                                                                        <Button color="error"
                                                                                variant="contained"
                                                                                onClick={() => onDelete(item.id)}
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
                </Container>
            </Box>
        </>
    );
};

export default FeedBackList;
