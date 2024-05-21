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
    Table,
    Typography,
    Breadcrumbs,
    CardHeader
} from '@material-ui/core';
import {
    TableContainer
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import {makeStyles} from '@material-ui/styles';
import {Link, useParams, useNavigate} from 'react-router-dom';
import {useGet} from '../../API/request';
import '../../styles/All.css'
import PerfectScrollbar from 'react-perfect-scrollbar';
import {BallTriangle} from "react-loader-spinner";
import { DataGrid } from '@mui/x-data-grid';
import { Paper } from '@mui/material';

export const servicesColumns = [
    { field: 'id', headerName: 'id', width: 70 },
    { field: 'title', headerName: 'Наименование услуги', width: 330 },
    { field: 'category_id', headerName: 'Категория', width: 230 },
]

const CategoryInfo = () => {

    const navigate = useNavigate();
    const getU = useGet();
    const {id} = useParams();

    const [isLoaded, setIsLoaded] = useState(true);

    const [category, setCategory] = useState({});
    const [cities, setCities ] = useState([])
    const [services, setServces] = useState([])

    const [beforeAfter, setBeforeAfter] = useState([])

    useEffect(() => {
        setIsLoaded(true)
        getU(`city`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setCities(resp.data.city)
                }
            })
            .catch(() => {

            })
            .finally(() => {
                setIsLoaded(false)
            });
        getU(`services_category/${id}`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setCategory(resp.data.category)
                }
            })
            .catch(() => {

            })
            .finally(() => {
                setIsLoaded(false)
            });
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
                <title>Информация категории</title>
            </Helmet>
            <Box sx={{pt: 2}}>
                <Container maxWidth={false}>
                    <Button startIcon={<ChevronLeft/>} onClick={() => navigate(-1)}>
                        Назад
                    </Button>
                    <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 14 }}>
                        <Link underline="hover" color="inherit" to="/app/categories">
                            Категории
                        </Link>
                            <p>{category?.value || 'Информация категории'}</p>
                    </Breadcrumbs>
                </Container>
            </Box>
            <Box sx={{backgroundColor: 'background.default', pt: 3, pb: 1}}>
                <Container maxWidth={false}>
                    <Card>
                        <CardContent sx={{p: 3}}>
                            <PerfectScrollbar>
                                <div className="wrapAvatar">
                                    <div className="avatar-block">
                                        <Avatar src={`${process.env.REACT_APP_API_URL}public/uploads/images/${category.img}`} className="avatar"/>
                                    </div>
                                    <div className="info-block">
                                        <div className="wrap">
                                            <div className="label">
                                                ID:
                                            </div>
                                            <div className="text">
                                                {category?.id || '---'}
                                            </div>
                                        </div>
                                        <div className="wrap">
                                            <div className="label">
                                                Имя:
                                            </div>
                                            <div className="text">
                                                {category?.value || '---'}
                                            </div>
                                        </div>

                                        <div className="wrap">
                                            <div className="label">
                                                Описание:
                                            </div>
                                            <div className="text">
                                                {category?.description || '---'}
                                            </div>
                                        </div>

                                        <div className="wrap">
                                            <div className="label">
                                                Города:
                                            </div>
                                            <div className="text">
                                                {category?.city?.map(el => el.name)?.join(', ') || '---'}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </PerfectScrollbar>
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
                                { category?.services?.length ? <DataGrid
                                    rows={category?.services || {}}
                                    columns={servicesColumns}
                                    initialState={{
                                        pagination: {
                                        paginationModel: { page: 0, pageSize: 5 },
                                        },
                                    }}
                                    pageSizeOptions={[5, 10]}
                                    /> :
                                    <Typography>
                                        Нет услуг
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

export default CategoryInfo;
