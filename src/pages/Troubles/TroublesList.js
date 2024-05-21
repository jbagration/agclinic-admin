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
import {useDelete, useGet, usePut} from '../../API/request';
import {useConfirm} from "../../components/Confirm/index";
import {BallTriangle} from "react-loader-spinner";
import '../../styles/All.css'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const TroublesList = () => {

    const confirm = useConfirm();
    const getU = useGet();
    const putU = usePut();
    const deleteU = useDelete();

    const [isLoaded, setIsLoaded] = useState(true);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [troubles, setTroubles] = useState([]);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [count, setCount] = useState(0);

    const toggleStatus = (isMain, id) => {
        const updatedStatus = isMain !== "0" ? false : true;
        const requestBody = {
            isMain: updatedStatus,
        };

        putU(`troubles/${id}`, requestBody)
          .then((resp) => {
            if (resp.status === 'success') {
              setValue((prevState) => ({
                ...prevState,
                isMain: updatedStatus,
              }));
            }
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            loadTroubles()
        });
      };

    const formattedDateTime = (createdAt) => {
        if (createdAt === null) {
          return '';
        }

        const dateObj = new Date(createdAt);
        return dateObj.toLocaleString('ru-RU', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      };

    const onDelete = (id) => {
        confirm({
            title: 'Удаление',
            content: 'Вы уверены, что хотите удалить услугу?',
            onConfirm: () => {
                deleteU(`troubles/${id}`)
                    .then((resp) => {
                        if (resp.status === 'success') {
                            loadTroubles();
                        }
                    })
                    .catch((e) => {
                        console.log(e)
                    });
            }
        });
    };

    const loadTroubles = () => {
        setIsDataLoading(true);
        setIsLoaded(true)

        let endpoint = `troubles?page=${page + 1}&limit=${limit}`;

        getU(endpoint)
            .then((resp) => {
                if (resp.status === 'success') {
                    setTroubles(resp.data.troubles);
                    setCount(resp.data.totalCount || 0);
                }
                setIsDataLoading(false);
            })
            .catch((err) => {
                console.log(err.response)
                setTroubles([]);
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
        loadTroubles();
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
                <title>Проблемы</title>
            </Helmet>
            <Box className="headerWrapper">
                <Box className="headerTitle">
                    Проблемы
                </Box>
            </Box>
            <Box sx={{backgroundColor: 'background.default', minHeight: '100%', py: 3}}>
                <Container maxWidth={false}>
                    {
                        isDataLoading ?
                            <UserListSkelet/>
                            :
                            <>
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
                                                               Изображение
                                                            </TableCell>
                                                            <TableCell>
                                                                Название проблемы
                                                            </TableCell>
                                                            <TableCell sx={{ width: 350, textAlign: 'center' }}>
                                                                Отображение на главной
                                                            </TableCell>
                                                            {/*
                                                            <TableCell>
                                                                Дата создания
                                                            </TableCell>
                                                             */}
                                                            <TableCell>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {troubles?.map((trouble) => (
                                                            <TableRow hover key={trouble.id}>
                                                                <TableCell sx={{width: 80}}>
                                                                    {trouble?.id || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Box sx={{ alignItems: 'center', display: 'flex' }}>
                                                                        <Avatar
                                                                            src={
                                                                                trouble.img
                                                                                    ? `${process.env.REACT_APP_API_URL}public/uploads/images/${trouble.img}`
                                                                                    : ''
                                                                            }
                                                                        />
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {trouble?.name || '---'}
                                                                </TableCell>
                                                                <TableCell sx={{ width: 350, textAlign: 'center' }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                        {trouble?.isMain === "1" || trouble?.isMain === true ? (
                                                                        <React.Fragment>
                                                                            <CheckCircleIcon style={{ color: 'green' }} /> {/* Иконка галочки */}
                                                                            <span style={{ marginLeft: '4px' }}>Отображается</span>
                                                                        </React.Fragment>
                                                                        ) : (
                                                                        <React.Fragment>
                                                                            <CancelIcon style={{ color: 'red' }} /> {/* Иконка крестика */}
                                                                            <span style={{ marginLeft: '4px' }}>Не отображается</span>
                                                                        </React.Fragment>
                                                                        )}
                                                                        <Button
                                                                            variant="contained"
                                                                            sx={{ marginLeft: '30px' }}
                                                                            color={trouble?.isMain !== "0" ? 'secondary' : 'primary'}
                                                                            onClick={() => toggleStatus(trouble?.isMain, trouble.id)}
                                                                            >
                                                                            {trouble?.isMain !== "0" ? 'Не отображать' : 'Отобразить'}
                                                                        </Button>
                                                                    </Box>
                                                                    </TableCell>
                                                                    {/*
                                                                    <TableCell>
                                                                        {formattedDateTime(trouble.date_create) || '---'}
                                                                    </TableCell>
                                                                        */}
                                                                    <TableCell>
                                                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                            <Link to={`/app/troubles/img/${trouble.id}`}>
                                                                                <Button color="primary" variant="contained" sx={{ marginLeft: "20px" }}>
                                                                                    Обновить изображение
                                                                                </Button>
                                                                            </Link>
                                                                            <Box sx={{ ml: 2 }}>
                                                                                <Button
                                                                                    color="error"
                                                                                    variant="contained"
                                                                                    onClick={(e) => e && onDelete(trouble.id)}
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

export default TroublesList;
