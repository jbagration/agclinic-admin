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
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Table,
    Typography,
    CardMedia,
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

const NewsInfo = () => {

    const navigate = useNavigate();
    const getU = useGet();
    const {id} = useParams();

    const [isLoaded, setIsLoaded] = useState(true);
    const [value, setValue] = useState({})

    function stripHtmlTags(html) {
        const regex = /(<([^>]+)>)/gi;
        return html ? html.replace(regex, '') : '';
      }

    useEffect(() => {
        setIsLoaded(true)
        getU(`publication/${id}`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setValue(resp.data.publication)
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
                <title>News</title>
            </Helmet>
            <Box sx={{pt: 2}}>
            <Container maxWidth={false} >
                <Box>
                    <Button startIcon={<ChevronLeft />} onClick={() => navigate(-1)}>
                        Назад
                    </Button>
                </Box>
                <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 14, justifyContent: 'flex-start' }}>
                    <Link underline="hover" color="inherit" to="/app/news">
                        Новости
                    </Link>
                    <p>{value?.title || 'Новость'}</p>
                </Breadcrumbs>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Link to={`/app/news/edit/${value.id}`}>
                    <Button color="primary" variant="contained">
                        Редактировать
                    </Button>
                    </Link>
                </Box>
            </Container>
            </Box>
            <Box sx={{backgroundColor: 'background.default', pt: 3, pb: 1}}>
                <Container maxWidth={false}>
                    <Card>
                        <CardContent sx={{p: 3}}>
                            <PerfectScrollbar>
                                <div className="wrapAvatar">
                                    <div className="avatar-block">
                                        <Avatar src={`${process.env.REACT_APP_API_URL}public/uploads/images/${value.img}`} className="avatar"/>
                                    </div>
                                    <div className="info-block">
                                        <div className="wrap">
                                            <div className="label">
                                                ID:
                                            </div>
                                            <div className="text">
                                                {value?.id || '---'}
                                            </div>
                                        </div>
                                        <div className="wrap">
                                            <div className="label">
                                                News name
                                            </div>
                                            <div className="text">
                                                {value?.title || '---'}
                                            </div>
                                        </div>

                                        <div className="wrap">
                                            <div className="label">
                                                Города
                                            </div>
                                            <div className="text">
                                                {value?.city?.map(el => el.name)?.join(', ') || '---'}
                                            </div>
                                        </div>

                                        <div className="wrap">
                                            <div className="label">
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
                                <div className="text">
                                    {stripHtmlTags(value?.description) || '---'}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        </>
    );
};

export default NewsInfo;
