import React, {useState, useEffect} from 'react';
import {Helmet} from 'react-helmet';
import {
    Box,
    Avatar,
    Container,
    Button,
    Card,
    Grid,
    CardContent,
    Breadcrumbs,
    Paper,
    CardMedia,
    CardHeader
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import {Link, useParams, useNavigate} from 'react-router-dom';
import {useGet} from '../../API/request';
import '../../styles/All.css'
import PerfectScrollbar from 'react-perfect-scrollbar';
import {BallTriangle} from "react-loader-spinner";

const DocumentInfo = () => {

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
        getU(`documents/${id}`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setValue(resp.data.document)
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
                <title>{value?.title || 'Документ'}</title>
            </Helmet>
            <Container maxWidth={false} >
                <Box>
                    <Button startIcon={<ChevronLeft />} onClick={() => navigate(-1)}>
                        Назад
                    </Button>
                </Box>
                <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 14, justifyContent: 'flex-start' }}>
                    <Link underline="hover" color="inherit" to="/app/documents">
                        Документы
                    </Link>
                        <p>{value?.title || 'Документ'}</p>
                </Breadcrumbs>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Link to={`/app/document/edit/${value.id}`}>
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
                                <div className="wrapAvatar" style={{ display: 'flex' }}>
                                    <div className="info-block" style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div className="wrap">
                                            <div className="label" style={{ width: '300px' }}>
                                                ID:
                                            </div>
                                            <div className="text">
                                                {value?.id || '---'}
                                            </div>
                                        </div>

                                        <div className="wrap">
                                            <div className="label" style={{ width: '300px' }}>
                                                Название документа
                                            </div>
                                            <div className="text">
                                                {value?.title || '---'}
                                            </div>
                                        </div>

                                        <div className="wrap">
                                            <div className="label" style={{ width: '300px' }}>
                                                Описание
                                            </div>
                                            <div className="text">
                                                {value?.description || '---'}
                                            </div>
                                        </div>

                                        <div className="wrap">
                                            <div className="label" style={{ width: '300px' }}>
                                                Дата получения документа:
                                            </div>
                                            <div className="text">
                                                {formattedDateTime(value?.date_receipt)?.split(',')[0] || '---'}
                                            </div>
                                        </div>

                                        <div className="wrap">
                                            <div className="label" style={{ width: '300px' }}>
                                                Дата создания:
                                            </div>
                                            <div className="text">
                                                {formattedDateTime(value?.date_create) || '---'}
                                            </div>
                                        </div>

                                        <div className="wrap" style={{ marginBottom: '10px' }}>
                                            <div className="label" style={{ width: '300px' }}>
                                                Дата обновления:
                                            </div>
                                            <div className="text">
                                                {formattedDateTime(value?.date_update) || '---'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <CardHeader
                                    title="Загруженные изображения документа"
                                />
                                <Grid container spacing={2}>
                                    {value.img?.map((img, index) => (
                                    <Grid item xs={6} sm={4} md={3} key={index}>
                                        <Paper elevation={3} style={{ width: '220px', height: '220px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative',  marginBottom: '15px' }}>
                                            <CardMedia
                                                component="img"
                                                image={`${process.env.REACT_APP_API_URL}public/uploads/images/${img}`}
                                                alt={`Изображение ${index + 1}`}
                                                sx={{
                                                    width: '200px',
                                                    height: '200px',
                                                    objectFit: 'contain',
                                                }}
                                            />
                                        </Paper>
                                    </Grid>
                                    ))}
                                </Grid>
                            </PerfectScrollbar>
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        </>
    );
};

export default DocumentInfo;
