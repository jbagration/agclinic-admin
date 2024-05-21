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
    FormControl,
    Select,
    MenuItem,
    ListItemText,
    InputLabel,
    TableRow,
    OutlinedInput,
    Button,
    TableFooter,
    TablePagination,
    Divider
} from '@material-ui/core';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PerfectScrollbar from 'react-perfect-scrollbar';
import UserListSkelet from '../../skeletons/UserListSkelet';
import {useDelete, useGet} from '../../API/request';
import {useConfirm} from "../../components/Confirm/index";
import {BallTriangle} from "react-loader-spinner";
import '../../styles/All.css'

const CommentsList = () => {

    const confirm = useConfirm();
    const getU = useGet();
    const deleteU = useDelete();

    const [isLoaded, setIsLoaded] = useState(true);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [cities, setCities ] = useState([])
    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [count, setCount] = useState(0);
    const [choosenCities, setChoosenCities] = useState('')

    const loadComments = () => {
        setIsDataLoading(true);
        setIsLoaded(true)

        let endpoint = `reviews?page=${page + 1}&limit=${limit}`;

        if (choosenCities) {
            endpoint = `reviews/city/${choosenCities}?page=${page + 1}&limit=${limit}`;
        } else{
            endpoint = `reviews?page=${page + 1}&limit=${limit}`;
        }

        getU(endpoint)
            .then((resp) => {
                if (resp.status === 'success') {
                    setComments(resp.data.reviews);
                    setCount(resp.data.totalCount || 0);
                }
                setIsDataLoading(false);
            })
            .catch((err) => {
                console.log(err.response)
                setComments([]);
                setIsDataLoading(false);
            })
            .finally(() => {
                setIsLoaded(false)
            });
    };

    const loadCities = () => {
        getU(`city`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setCities(resp.data.city)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const handleChangeCity = (event) => {
        const value = event.target.value
        setChoosenCities(value);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeLimit = (event) => {
        setLimit(event.target.value);
        setPage(0);
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
          content: 'Вы уверены, что хотите удалить комментарий?',
          onConfirm: () => {
            deleteU(`reviews/${id}`)
              .then((resp) => {
                loadComments();
              })
              .catch((e) => {
                console.log(e.response);
              });
          }
        });
      };

    useEffect(() => {
        loadCities();
        loadComments();
    }, [page, limit, choosenCities]);

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
                <title>Комментарии</title>
            </Helmet>
            <Box className="headerWrapper">
                <Box className="headerTitle">
                    Комментарии
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
                                            <Box>
                                                <FormControl fullWidth sx={{ mt: 2, mb: 1, ml: 5, width: 500 }}>
                                                    <InputLabel id="Все города">Все города</InputLabel>
                                                    <Select
                                                        label="Все города"
                                                        name="city_id"
                                                        value={choosenCities}
                                                        onChange={handleChangeCity}
                                                        input={<OutlinedInput label="Все города" />}
                                                        renderValue={(selected) => {
                                                        if (selected === '---') {
                                                            return 'Все города';
                                                        }
                                                        const selectedCity = cities.find(city => city.id === selected);
                                                        return selectedCity ? selectedCity.name : '';
                                                        }}
                                                    >
                                                        <MenuItem value={''}>
                                                            <ListItemText primary="Все города" />
                                                        </MenuItem>
                                                        {cities?.map((city) => (
                                                        <MenuItem key={city.id} value={city.id}>
                                                            <ListItemText primary={city.name} />
                                                        </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                <Divider/>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell sx={{width: 80}}>
                                                                Id
                                                            </TableCell>
                                                            <TableCell>
                                                               Аватар
                                                            </TableCell>
                                                            <TableCell>
                                                                Имя пользователя
                                                            </TableCell>
                                                            <TableCell>
                                                                Город
                                                            </TableCell>
                                                            <TableCell sx={{ width: 300, textAlign: 'center' }}>
                                                                Комментарий
                                                            </TableCell>
                                                            <TableCell sx={{ width: 300, textAlign: 'center' }}>
                                                                Статус
                                                            </TableCell>
                                                            <TableCell>
                                                                Дата создания
                                                            </TableCell>
                                                            <TableCell>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                    {comments?.length > 0 ? (
                                                        comments?.map((comment) => (
                                                            <TableRow hover key={comment.id}>
                                                                <TableCell sx={{width: 80}}>
                                                                    {comment?.id}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Box sx={{ alignItems: 'center', display: 'flex' }}>
                                                                        <Avatar
                                                                            src={
                                                                                comment.img
                                                                                    ? `${process.env.REACT_APP_API_URL}public/uploads/images/${comment.img}`
                                                                                    : ''
                                                                            }
                                                                        />
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {comment?.name || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {cities?.find(elem => elem.id === comment?.city_id)?.name || '---'}
                                                                </TableCell>
                                                                <TableCell sx={{ width: 300, textAlign: 'center' }}>
                                                                    {comment?.description
                                                                        ? comment.description.slice(0, 50) + (comment.description.length > 50 ? '...' : '')
                                                                        : '---'}
                                                                </TableCell>
                                                                <TableCell sx={{ width: 300, textAlign: 'center' }}>
                                                                    {comment?.status === 1 || comment?.status === true ? (
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
                                                                </TableCell>
                                                                <TableCell>
                                                                    {formattedDateTime(comment?.date_create) || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Box sx={{display: 'flex'}}>
                                                                        <Link to={`/app/comments/info/${comment.id}`}>
                                                                            <Button color="primary" variant="contained">
                                                                                Инфо.
                                                                            </Button>
                                                                        </Link>
                                                                        <Box sx={{ml: 2}}>
                                                                            <Button
                                                                                color="error"
                                                                                variant="contained"
                                                                                onClick={(e) => e && onDelete(comment.id)}
                                                                            >
                                                                                Удалить
                                                                            </Button>
                                                                        </Box>
                                                                    </Box>
                                                                </TableCell>
                                                            </TableRow>
                                                            ))
                                                            ) : (
                                                              <TableRow>
                                                                <TableCell colSpan={7} sx={{ textAlign: 'center' }}>
                                                                  Нет комментариев
                                                                </TableCell>
                                                              </TableRow>
                                                            )}
                                                        </TableBody>
                                                    <TableFooter>
                                                        <TableRow>
                                                            <TablePagination
                                                                labelRowsPerPage={
                                                                    <span>Кол-во строк на странице:</span>}
                                                                rowsPerPageOptions={[10, 20, 30, 40, 50]}
                                                                colSpan={8}
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

export default CommentsList;
