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

const DocumentsList = () => {

    const confirm = useConfirm();
    const getU = useGet();
    const deleteU = useDelete();

    const [isLoaded, setIsLoaded] = useState(true);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [documents, setDocuments] = useState([]);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [count, setCount] = useState(0);

    const formattedDateTime = (createdAt) => {
        if (createdAt === null) {
          return '';
        }

        const dateObj = new Date(createdAt);
        return dateObj.toLocaleString('ru-RU', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
      };

    const loadDocuments = () => {
        setIsDataLoading(true);
        setIsLoaded(true)

        let endpoint = `documents?page=${page + 1}&limit=${limit}`;

        getU(endpoint)
            .then((resp) => {
                if (resp.status === 'success') {
                    setDocuments(resp.data.document);
                    setCount(resp.data.totalCount || 0);
                }
                setIsDataLoading(false);
            })
            .catch((err) => {
                console.log(err.response)
                setDocuments([]);
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
            content: 'Вы уверены, что хотите удалить документ?',
            onConfirm: () => {
                deleteU(`documents/${id}`)
                    .then((resp) => {
                        if (resp.status === 'success') {
                            loadDocuments();
                        }
                    })
                    .catch((e) => {
                        console.log(e)
                    });
            }
        });
    };

    useEffect(() => {
        loadDocuments();
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
                <title>Документы</title>
            </Helmet>
            <Box className="headerWrapper">
                <Box className="headerTitle">
                    Документы
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
                                        <Link to="/app/document/add">
                                            <Button color="primary" variant="contained">
                                                Добавить документ
                                            </Button>
                                        </Link>
                                    </Box>
                                </Box>
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
                                                            {/*<TableCell>
                                                               Изображение
                                                             </TableCell>*/}
                                                            <TableCell>
                                                                Название документа
                                                            </TableCell>
                                                            <TableCell>
                                                                Описание
                                                            </TableCell>
                                                            <TableCell>
                                                                Дата получения документа
                                                            </TableCell>
                                                            <TableCell>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {documents?.map((document) => (
                                                            <TableRow hover key={document.id}>
                                                                <TableCell sx={{width: 80}}>
                                                                    {document?.id || '---'}
                                                                </TableCell>
                                                                {/*<TableCell>
                                                                    <Box sx={{ alignItems: 'center', display: 'flex' }}>
                                                                        <Avatar
                                                                            src={
                                                                                document.img
                                                                                    ? `${process.env.REACT_APP_API_URL}public/uploads/images/${document.img}`
                                                                                    : ''
                                                                            }
                                                                        />
                                                                    </Box>
                                                                        </TableCell>*/}
                                                                <TableCell>
                                                                    {document?.title || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {document?.description || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {formattedDateTime(document?.date_receipt) || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                        <Link to={`/app/document/${document.id}`}>
                                                                            <Button color="primary" variant="contained">
                                                                                Инфо.
                                                                            </Button>
                                                                        </Link>
                                                                        <Box sx={{ ml: 2 }}>
                                                                        <Link to={`/app/document/edit/${document.id}`}>
                                                                            <Button color="primary" variant="contained">
                                                                            Редакт.
                                                                            </Button>
                                                                        </Link>
                                                                        </Box>
                                                                        <Box sx={{ ml: 2 }}>
                                                                        <Button
                                                                            color="error"
                                                                            variant="contained"
                                                                            onClick={(e) => e && onDelete(document.id)}
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

export default DocumentsList;
