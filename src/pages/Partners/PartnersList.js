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
import {useConfirm} from "../../components/Confirm/index";
import {BallTriangle} from "react-loader-spinner";
import '../../styles/All.css'

const PartnersList = () => {

    const confirm = useConfirm();
    const getU = useGet();
    const deleteU = useDelete();

    const [isLoaded, setIsLoaded] = useState(true);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [partners, setPartners] = useState([]);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [count, setCount] = useState(0);

    const loadPartners = () => {
        setIsDataLoading(true);
        setIsLoaded(true)

        let endpoint = `partners?page=${page + 1}&limit=${limit}`;

        getU(endpoint)
            .then((resp) => {
                if (resp.status === 'success') {
                    setPartners(resp.data.partner);
                    setCount(resp.data.totalCount || 0);
                }
                setIsDataLoading(false);
            })
            .catch((err) => {
                console.log(err.response)
                setPartners([]);
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
          content: 'Вы уверены, что хотите удалить партнёра?',
          onConfirm: () => {
            deleteU(`partners/${id}`)
              .then((resp) => {
                loadPartners();
              })
              .catch((e) => {
                console.log(e.response);
              });
          }
        });
      };

    useEffect(() => {
        loadPartners();
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
                <title>Партнёры</title>
            </Helmet>
            <Box className="headerWrapper">
                <Box className="headerTitle">
                    Партнёры
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
                                        <Link to="/app/partners/add">
                                            <Button color="primary" variant="contained">
                                                Добавить партнёра
                                            </Button>
                                        </Link>
                                    </Box>
                                </Box>
                                <Box sx={{pt: 3}}>
                                    <Card>
                                        <PerfectScrollbar>
                                            <Box>
                                                <Divider/>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell sx={{width: 80}}>
                                                                Id
                                                            </TableCell>
                                                            <TableCell>
                                                               Логотип
                                                            </TableCell>
                                                            <TableCell>
                                                                Заголовок партнёра
                                                            </TableCell>
                                                            <TableCell>
                                                                Ссылка на партнёра
                                                            </TableCell>
                                                            <TableCell>
                                                                Дата создания
                                                            </TableCell>
                                                            <TableCell>
                                                                Дата обновления
                                                            </TableCell>
                                                            <TableCell>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {partners?.map((partner) => (
                                                            <TableRow hover key={partner.id}>
                                                                <TableCell sx={{width: 80}}>
                                                                    {partner?.id}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Box sx={{ alignItems: 'center', display: 'flex' }}>
                                                                        <Avatar
                                                                            src={
                                                                                partner.img
                                                                                    ? `${process.env.REACT_APP_API_URL}public/uploads/images/${partner.img}`
                                                                                    : ''
                                                                            }
                                                                        />
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {partner?.title || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {partner?.link || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {formattedDateTime(partner?.date_create) || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {formattedDateTime(partner?.date_update) || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Box sx={{display: 'flex'}}>

                                                                        <Box sx={{display: 'flex'}}>
                                                                            <Box sx={{ml: 2}}>
                                                                                <Link
                                                                                    to={`/app/partners/edit/${partner.id}`}
                                                                                    style={partner?.role === "admin" ? {pointerEvents: 'none'} : {}}>
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
                                                                                    onClick={(e) => e && onDelete(partner.id)}
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

export default PartnersList;
