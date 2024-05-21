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

const BannerInfo = () => {

    const navigate = useNavigate();
    const getU = useGet();
    const {id} = useParams();

    const [isLoaded, setIsLoaded] = useState(true);
    const [value, setValue] = useState({})

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
          minute: '2-digit',
        });
      };

    useEffect(() => {
        setIsLoaded(true)
        getU(`banners/${id}`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setValue(resp.data.banner)
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
                <title>{value?.title || 'Баннер'}</title>
            </Helmet>
            <Container maxWidth={false} >
                <Box>
                    <Button startIcon={<ChevronLeft />} onClick={() => navigate(-1)}>
                        Назад
                    </Button>
                </Box>
                <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 14, justifyContent: 'flex-start' }}>
                    <Link underline="hover" color="inherit" to="/app/banners">
                        Баннера
                    </Link>
                        <p>{value?.title || 'Баннер'}</p>
                </Breadcrumbs>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Link to={`/app/banner/edit/${value.id}`}>
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
                                        <Avatar src={`${process.env.REACT_APP_API_URL}public/uploads/images/${value.mobile_img}`} className="avatar"/>
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
                                            Название баннера
                                            </div>
                                            <div className="text">
                                                {value?.title || '---'}
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
                                                Ссылка
                                            </div>
                                            <div className="text">
                                                {value?.url || '---'}
                                            </div>
                                        </div>

                                        <div className="wrap">
                                            <div className="label" style={{ width: '200px' }}>
                                                Дата создания:
                                            </div>
                                            <div className="text">
                                                {formattedDateTime(value?.date_create) || '---'}
                                            </div>
                                        </div>

                                        <div className="wrap">
                                            <div className="label" style={{ width: '200px' }}>
                                                Дата обновления:
                                            </div>
                                            <div className="text">
                                                {formattedDateTime(value?.date_update) || '---'}
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
                            image={
                                value.desktop_img
                                    ? `${process.env.REACT_APP_API_URL}public/uploads/images/${value.desktop_img}`
                                    : '/static/images/defphoto.jpg'
                            }
                            alt="Изображение"
                        />
                    </Card>
                </Container>
            </Box>
        </>
    );
};

export default BannerInfo;
