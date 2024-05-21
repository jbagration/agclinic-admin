import React, {useState, useEffect} from 'react';
import {Helmet} from 'react-helmet';
import {
    Box,
    Avatar,
    Container,
    Button,
    Card,
    CardContent,
    Breadcrumbs,
    Divider,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Table,
    Typography,
    CardMedia,
    CardHeader
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import {Link, useParams, useNavigate} from 'react-router-dom';
import {useGet} from '../../API/request';
import '../../styles/All.css'
import PerfectScrollbar from 'react-perfect-scrollbar';
import {BallTriangle} from "react-loader-spinner";

const ServicesInfo = () => {

    const navigate = useNavigate();
    const getU = useGet();
    const {id} = useParams();

    const [isLoaded, setIsLoaded] = useState(true);

    const [categories, setCategories] = useState([])
    const [value, setValue] = useState({})

    function stripHtmlTags(html) {
        const regex = /(<([^>]+)>)/gi;
        return html ? html.replace(regex, '') : '';
      }

    useEffect(() => {
        setIsLoaded(true)
        getU(`services_category`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setCategories(resp.data.category)
                }
            })
            .catch((err) => {
                console.log(err)
            })
        getU(`services/${id}`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setValue(resp.data.service)
                }
            })
            .catch((err) => {
                console.log(err)
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
                <title>Услуга</title>
            </Helmet>
            <Container maxWidth={false} >
                <Box>
                    <Button startIcon={<ChevronLeft />} onClick={() => navigate(-1)}>
                        Назад
                    </Button>
                </Box>
                <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 14, justifyContent: 'flex-start' }}>
                    <Link underline="hover" color="inherit" to="/app/services">
                        Услуги
                    </Link>
                        <p>{value?.title || 'Услуга'}</p>
                </Breadcrumbs>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Link to={`/app/services/edit/${value.id}`}>
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
                                        <Avatar src={`${process.env.REACT_APP_API_URL}public/uploads/images/${value.preview_img}`} className="avatar"/>
                                    </div>
                                    <div className="info-block">
                                        <div className="wrap">
                                            <div className="label" style={{ width: '200px' }}>
                                                ID:
                                            </div>
                                            <div className="text">
                                                {value?.id || '---'}
                                            </div>
                                        </div>

                                        <div className="wrap">
                                            <div className="label" style={{ width: '200px' }}>
                                                Название услуги
                                            </div>
                                            <div className="text">
                                                {value?.title || '---'}
                                            </div>
                                        </div>

                                        <div className="wrap">
                                            <div className="label" style={{ width: '200px' }}>
                                                Категория услуги
                                            </div>
                                            <div className="text">
                                                {categories?.find(el => el.id === value.category_id)?.value || '---'}
                                            </div>
                                        </div>

                                        <div className="wrap">
                                            <div className="label" style={{ width: '200px' }}>
                                                Города
                                            </div>
                                            <div className="text">
                                                {value?.city?.map(el => el.name)?.join(', ') || '---'}
                                            </div>
                                        </div>

                                        <div className="wrap">
                                            <div className="label" style={{ width: '200px' }}>
                                                Инфо
                                            </div>
                                            <div className="text">
                                                {value?.preview_description || '---'}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </PerfectScrollbar>
                        </CardContent>
                    </Card>
                    <Card sx={{marginTop: '10px'}}>
                    <CardMedia
                        component="img"
                        height="300"
                        image={
                            value.main_img
                                ? `${process.env.REACT_APP_API_URL}public/uploads/images/${value.main_img}`
                                : '/static/images/defphoto.jpg'
                        }
                        alt="Изображение"
                    />
                        <CardHeader title="Полное описание" />
                        <CardContent>
                            <div className="wrap">
                                <div className="text" dangerouslySetInnerHTML={{__html: value?.text || '---'}}>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        </>
    );
};

export default ServicesInfo;
