import React, {useState, useEffect} from 'react';
import {Helmet} from 'react-helmet';
import {
    Box,
    Avatar,
    Container,
    Button,
    Card,
    CardContent,
    Divider,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Breadcrumbs,
    Table,
    Typography,
    CardHeader
} from '@material-ui/core';
import {
    TableContainer
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import {Link, useParams, useNavigate} from 'react-router-dom';
import {useDelete, useGet} from '../../API/request';
import '../../styles/All.css'
import PerfectScrollbar from 'react-perfect-scrollbar';
import {BallTriangle} from "react-loader-spinner";
import { DataGrid } from '@mui/x-data-grid';
import { Paper } from '@mui/material';
import { idID } from '@mui/material/locale';
import {useConfirm} from "../../components/Confirm/index";
import ReactPlayer from 'react-player';

const servicesColumns = [
    { field: 'id', headerName: 'id', width: 70 },
    { field: 'value', headerName: 'Наименование услуги', width: 730 },
]

const SpecialistInfo = () => {

    const navigate = useNavigate();
    const getU = useGet();
    const deleteU = useDelete();
    const {id} = useParams();
    const confirm = useConfirm();

    const [isLoaded, setIsLoaded] = useState(true);
    const [user, setUser] = useState({});
    const [certificates, setСertificates] = useState([]);
    const [services, setServces] = useState([])
    const [beforeAfter, setBeforeAfter] = useState([])

    const onDelete = (id) => {
        confirm({
            title: 'Удаление',
            content: 'Вы уверены, что хотите удалить сертификат?',
            onConfirm: () => {
            deleteU(`specialist/certificates/${id}`)
                .then((resp) => {
                    loadCertificates();
                })
                .catch((e) => {
                    console.log(e.response);
                });
            }
        });
        };

    const loadCertificates = () => {
        getU(`specialist/certificates/current/${id}`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setСertificates(resp.data.certificates)
                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setIsLoaded(false)
            });
    }

    useEffect(() => {
        setIsLoaded(true)
        getU(`specialist/services/${id}`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setServces(resp.data.data)
                }
            })
            .catch((err) => {
                console.log(err)
            })
        getU(`specialist/before_after/${id}`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setBeforeAfter(resp.data.data)
                }
            })
            .catch((err) => {
                console.log(err)
            })
        getU(`specialist/${id}`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setUser(resp.data.specialist)
                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setIsLoaded(false)
            });
        loadCertificates();
    }, []);

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
                <title>{user?.fio || 'Специалист'}</title>
            </Helmet>
            <Container maxWidth={false} >
                <Box>
                    <Button startIcon={<ChevronLeft />} onClick={() => navigate(-1)}>
                        Назад
                    </Button>
                </Box>
                <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 14, justifyContent: 'flex-start' }}>
                    <Link underline="hover" color="inherit" to="/app/specialists">
                        Специалисты
                    </Link>
                        <p>{user?.fio || 'Специалист'}</p>
                </Breadcrumbs>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Link to={`/app/specialist/edit/${user.id}`}>
                    <Button color="primary" variant="contained">
                        Редактировать
                    </Button>
                    </Link>
                </Box>
            </Container>

            <Box sx={{backgroundColor: 'background.default', pt: 3, pb: 1}}>
                <Container maxWidth={false}>
                    <Card>
                        <CardContent sx={{p: 3}}>
                            <PerfectScrollbar>
                                <div className="wrapAvatar">
                                    <div className="avatar-block">
                                        <Avatar src={`${process.env.REACT_APP_API_URL}public/uploads/images/${user.preview_img}`} className="avatar"/>
                                    </div>
                                    <div className="info-block">
                                        <div className="wrap">
                                            <div className="label">
                                                ID:
                                            </div>
                                            <div className="text">
                                                {user?.id || '---'}
                                            </div>
                                        </div>
                                        <div className="wrap">
                                            <div className="label">
                                                User name
                                            </div>
                                            <div className="text">
                                                {user?.fio || '---'}
                                            </div>
                                        </div>

                                        <div className="wrap">
                                            <div className="label">
                                                Города
                                            </div>
                                            <div className="text">
                                                {user?.city?.map(el => el.name)?.join(', ') || '---'}
                                            </div>
                                        </div>

                                        <div className="wrap">
                                            <div className="label">
                                                Инфо
                                            </div>
                                            <div className="text">
                                                {user?.preview_description || '---'}
                                            </div>
                                        </div>

                                        <div className="wrap">
                                            <div className="label">
                                                Опыт
                                            </div>
                                            <div className="text">
                                                {user?.experience || '---'}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </PerfectScrollbar>
                        </CardContent>
                    </Card>
                </Container>
            </Box>

            <Box>
                <Container sx={{margin: 0}} maxWidth={false}>
                    <Card>
                        <CardHeader title="Общая информация" />
                        <CardContent>
                            <CardHeader title="О специалисте" />
                            <Card sx={{ minHeight: '300px', maxHeight: '300px', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: user?.main_description || '---' }}></Card>
                            <CardHeader title="Биография" />
                            <Card sx={{ minHeight: '300px', maxHeight: '300px', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: user?.biography || '---' }}></Card>
                        </CardContent>
                    </Card>
                </Container>
            </Box>

            <Box>
                <Container sx={{marginTop: 1}} maxWidth={false}>
                    <Card>
                        <CardHeader
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                            title="Дополнительные вложения (Сертификаты, Видео)"
                            action={
                                <Box sx={{ marginLeft: 2 }}>
                                <Link to={`/app/specialist/additional_attachments/add/${user?.id}`}>
                                    <Button sx={{ margin: 1 }} color="primary" variant="contained">
                                        Добавить доп.вложение
                                    </Button>
                                </Link>
                                </Box>
                            }
                        />
                        <Divider/>
                        <CardContent sx={{ position: 'relative' }}>
                            {certificates.length ? (
                                <TableContainer component={Paper}>
                                <Table aria-label="collapsible table">
                                    <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Дополнительные вложения</TableCell>
                                        <TableCell sx={{ width: '300px' }} />
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {certificates.map((row) => (
                                        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} key={row.id}>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>
                                            {row.status === 0 && Array.isArray(row.url) ? (
                                            <Box sx={{ display: 'flex' }}>
                                                {row.url.slice(0, 6).map((photoUrl, index) => (
                                                <Box sx={{ p: 1 }} key={photoUrl}>
                                                    <Avatar
                                                    src={`${process.env.REACT_APP_API_URL}public/uploads/images/${photoUrl}`}
                                                    sx={{ width: 100, height: 100 }}
                                                    variant="square"
                                                    />
                                                </Box>
                                                ))}
                                                {row.url.length > 6 && (
                                                <Box sx={{ p: 1 }}>
                                                    <Typography variant="caption">{`+${row.url.length - 6} фото`}</Typography>
                                                </Box>
                                                )}
                                            </Box>
                                            ) : row.status === 1 && typeof row.url === 'string' ? (
                                            <ReactPlayer
                                                url={row.url}
                                                width="200px"
                                                height="110px"
                                                controls
                                                light={true}
                                            />
                                            ) : null}
                                        </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', width: '200px' }}>
                                                    <Box sx={{ display: 'flex' }}>
                                                        <Box sx={{ ml: 2 }}>
                                                        {row.status === 0 ? (
                                                            <Link to={`/app/specialist/additional_attachments/edit/images/${row.id}`}>
                                                                <Button color="primary" variant="contained">
                                                                    Редакт.
                                                                </Button>
                                                            </Link>
                                                        ) : row.status === 1 ? (
                                                            <Link to={`/app/specialist/additional_attachments/edit/video/${row.id}`}>
                                                                <Button color="primary" variant="contained">
                                                                    Редакт.
                                                                </Button>
                                                            </Link>
                                                        ) : null}
                                                        </Box>
                                                        <Box sx={{ ml: 2 }}>
                                                        <Button
                                                            color="error"
                                                            variant="contained"
                                                            onClick={(e) => e && onDelete(row.id)}
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
                                </Table>
                                </TableContainer>
                            ) : (
                                <Typography>Нет сертификатов</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Container>
            </Box>

            <Box sx={{backgroundColor: 'background.default', pt: 3}}>
                <Container maxWidth={false}>
                    <Box sx={{
                        paddingBottom: 1
                    }}>
                        <Card>
                            <CardHeader
                                title="Услуги"
                            />
                            <Divider/>
                            <CardContent sx={{position: 'relative'}}>
                                {services.length ?
                                <DataGrid
                                    rows={services}
                                    columns={servicesColumns}
                                    initialState={{
                                        pagination: {
                                        paginationModel: { page: 0, pageSize: 5 },
                                        },
                                    }}
                                    pageSizeOptions={[5, 10]}
                                    />
                                :
                                <Typography>
                                    Нет задач
                                </Typography>}
                            </CardContent>
                        </Card>
                    </Box>
                </Container>
            </Box>

            <Box sx={{backgroundColor: 'background.default', pt: 3}}>
                <Container maxWidth={false}>
                    <Box sx={{
                        paddingBottom: 1
                    }}>
                        <Card>
                            <CardHeader
                                title="Раздел До/после"
                            />
                            <Box sx={{
                                paddingBottom: 1
                            }}></Box>
                            <Divider />
                            <CardContent sx={{position: 'relative'}}>
                                {beforeAfter.length ?
                                <TableContainer component={Paper}>
                                <Table aria-label="collapsible table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Заголовок</TableCell>
                                            <TableCell>Фото до</TableCell>
                                            <TableCell>Фото после</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {beforeAfter.map((row) => (
                                            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                            <TableCell>
                                                {row.id}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                              {row.title}
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ alignItems: 'center', display: 'flex' }}>
                                                    <Avatar
                                                        src={
                                                            row.before_img
                                                                ? `${process.env.REACT_APP_API_URL}public/uploads/images/${row.before_img}`
                                                                : ''
                                                        }
                                                    />
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ alignItems: 'center', display: 'flex' }}>
                                                    <Avatar
                                                        src={
                                                            row.after_img
                                                                ? `${process.env.REACT_APP_API_URL}public/uploads/images/${row.after_img}`
                                                                : ''
                                                        }
                                                    />
                                                </Box>
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                </TableContainer>
                                :
                                <Typography>
                                    Нет записей
                                </Typography>
                                }
                            </CardContent>
                        </Card>
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default SpecialistInfo;
